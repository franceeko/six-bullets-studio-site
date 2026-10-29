declare const HTMLRewriter:
  | (new () => {
      on(
        selector: string,
        handlers: {
          element(element: { setAttribute(name: string, value: string): void }): void;
        },
      ): HTMLRewriterInstance;
      transform(response: Response): Response;
    })
  | undefined;

type HTMLRewriterInstance = {
  on(
    selector: string,
    handlers: {
      element(element: { setAttribute(name: string, value: string): void }): void;
    },
  ): HTMLRewriterInstance;
  transform(response: Response): Response;
};

const BASE_CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "form-action 'self'",
  "script-src 'self'",
  "script-src-attr 'none'",
  "style-src 'self'",
  "style-src-attr 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
];

function createNonce(): string {
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);

  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

function isLocalDevelopmentUrl(requestUrl: string): boolean {
  try {
    const url = new URL(requestUrl);
    const hostname = url.hostname.replace(/^\[|\]$/g, "");
    return (
      url.protocol === "http:" &&
      (hostname === "localhost" ||
        hostname.endsWith(".localhost") ||
        hostname === "127.0.0.1" ||
        hostname === "::1")
    );
  } catch {
    return false;
  }
}

function buildCsp(requestUrl: string, nonce: string): string {
  const directives = [...BASE_CSP];

  directives[6] = `script-src 'self' 'nonce-${nonce}'`;

  if (isLocalDevelopmentUrl(requestUrl)) {
    // Vite injects component CSS into style elements during local development.
    // This relaxation is intentionally limited to loopback HTTP; production stays strict.
    const styleDirectiveIndex = directives.findIndex((directive) =>
      directive.startsWith("style-src 'self'"),
    );
    if (styleDirectiveIndex >= 0) {
      directives[styleDirectiveIndex] = "style-src 'self' 'unsafe-inline'";
    }
    const connectDirectiveIndex = directives.findIndex((directive) =>
      directive.startsWith("connect-src "),
    );
    if (connectDirectiveIndex >= 0) {
      directives[connectDirectiveIndex] = "connect-src 'self' ws: wss:";
    }
  }

  if (requestUrl.startsWith("https://")) {
    directives.push("upgrade-insecure-requests");
  }

  return directives.join("; ");
}

function createNonceStream(nonce: string): TransformStream<Uint8Array, Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let pending = "";
  let insideScript = false;

  const rewrite = (flush: boolean): string => {
    let output = "";
    let cursor = 0;

    while (cursor < pending.length) {
      if (insideScript) {
        const closingTag = /<\/script(?=[\s>])/gi;
        closingTag.lastIndex = cursor;
        const closeIndex = closingTag.exec(pending)?.index ?? -1;
        if (closeIndex === -1) {
          const safeEnd = flush ? pending.length : Math.max(cursor, pending.length - 9);
          output += pending.slice(cursor, safeEnd);
          cursor = safeEnd;
          break;
        }

        const closeEnd = pending.indexOf(">", closeIndex);
        if (closeEnd === -1) {
          output += pending.slice(cursor, closeIndex);
          cursor = closeIndex;
          break;
        }

        output += pending.slice(cursor, closeEnd + 1);
        cursor = closeEnd + 1;
        insideScript = false;
        continue;
      }

      const openMatch = /<script(?=[\s/>])/i.exec(pending.slice(cursor));
      if (!openMatch || openMatch.index === undefined) {
        const safeEnd = flush ? pending.length : Math.max(cursor, pending.length - 8);
        output += pending.slice(cursor, safeEnd);
        cursor = safeEnd;
        break;
      }

      const openIndex = cursor + openMatch.index;
      const openEnd = pending.indexOf(">", openIndex);
      if (openEnd === -1) {
        output += pending.slice(cursor, openIndex);
        cursor = openIndex;
        break;
      }

      output += pending.slice(cursor, openIndex);
      let openingTag = pending.slice(openIndex, openEnd + 1);
      if (/\snonce\s*=/i.test(openingTag)) {
        openingTag = openingTag.replace(
          /\snonce\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i,
          ` nonce="${nonce}"`,
        );
      } else {
        openingTag = `${openingTag.slice(0, -1)} nonce="${nonce}">`;
      }
      output += openingTag;
      cursor = openEnd + 1;
      insideScript = true;
    }

    pending = pending.slice(cursor);
    if (flush && pending) {
      output += pending;
      pending = "";
    }
    return output;
  };

  return new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      pending += decoder.decode(chunk, { stream: true });
      const rewritten = rewrite(false);
      if (rewritten) controller.enqueue(encoder.encode(rewritten));
    },
    flush(controller) {
      pending += decoder.decode();
      const rewritten = rewrite(true);
      if (rewritten) controller.enqueue(encoder.encode(rewritten));
    },
  });
}

function addNonceToHtml(response: Response, nonce: string): Response {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html") || !response.body) return response;

  if (typeof HTMLRewriter !== "undefined") {
    return new HTMLRewriter()
      .on("script", {
        element(element) {
          element.setAttribute("nonce", nonce);
        },
      })
      .transform(response);
  }

  // Vercel runs on Node rather than Workers; preserve streaming while adding CSP nonces.
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  headers.delete("content-encoding");
  headers.delete("content-md5");
  headers.delete("etag");

  return new Response(response.body.pipeThrough(createNonceStream(nonce)), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function withSecurityHeaders(response: Response, requestUrl?: string): Response {
  const headers = new Headers(response.headers);
  const nonce = createNonce();

  headers.set("Content-Security-Policy", buildCsp(requestUrl ?? "", nonce));

  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");

  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  headers.set(
    "Permissions-Policy",
    [
      "accelerometer=()",
      "autoplay=(self)",
      "camera=()",
      "geolocation=()",
      "gyroscope=()",
      "microphone=()",
      "payment=()",
      "usb=()",
    ].join(", "),
  );

  headers.set("Cross-Origin-Opener-Policy", "same-origin");

  headers.set("Cross-Origin-Resource-Policy", "same-origin");

  headers.set("X-DNS-Prefetch-Control", "off");
  headers.set("X-Permitted-Cross-Domain-Policies", "none");
  headers.set("Origin-Agent-Cluster", "?1");

  if (requestUrl?.startsWith("https://")) {
    headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  if (response.status >= 500) {
    headers.set("Cache-Control", "no-store");
  } else if (requestUrl) {
    try {
      const pathname = new URL(requestUrl).pathname;

      if (pathname.startsWith("/assets/") && !headers.has("Cache-Control")) {
        const isFingerprintedAsset = /-[a-f0-9]{8,}\.[a-z0-9]+$/i.test(pathname);
        headers.set(
          "Cache-Control",
          isFingerprintedAsset
            ? "public, max-age=31536000, immutable"
            : "public, max-age=86400, stale-while-revalidate=604800",
        );
      }
    } catch {
      // Ignore malformed request URLs.
    }
  }

  const securedResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });

  return addNonceToHtml(securedResponse, nonce);
}
