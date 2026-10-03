declare const HTMLRewriter:
  | (new () => {
      on(
        selector: string,
        handlers: {
          element(element: {
            setAttribute(name: string, value: string): void;
          }): void;
        },
      ): HTMLRewriterInstance;
      transform(response: Response): Response;
    })
  | undefined;

type HTMLRewriterInstance = {
  on(
    selector: string,
    handlers: {
      element(element: {
        setAttribute(name: string, value: string): void;
      }): void;
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

function buildCsp(requestUrl: string, nonce: string): string {
  const directives = [...BASE_CSP];

  directives[6] = `script-src 'self' 'nonce-${nonce}'`;

  if (requestUrl.startsWith("https://")) {
    directives.push("upgrade-insecure-requests");
  }

  return directives.join("; ");
}

function addNonceToHtml(
  response: Response,
  nonce: string,
): Response {
  if (typeof HTMLRewriter === "undefined") {
    return response;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("text/html")) {
    return response;
  }

  return new HTMLRewriter()
    .on("script", {
      element(element) {
        element.setAttribute("nonce", nonce);
      },
    })
    .transform(response);
}

export function withSecurityHeaders(
  response: Response,
  requestUrl?: string,
): Response {
  const headers = new Headers(response.headers);
  const nonce = createNonce();

  headers.set(
    "Content-Security-Policy",
    buildCsp(requestUrl ?? "", nonce),
  );

  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");

  headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin",
  );

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

  headers.set(
    "Cross-Origin-Opener-Policy",
    "same-origin",
  );

  headers.set(
    "Cross-Origin-Resource-Policy",
    "same-origin",
  );

  headers.set("X-DNS-Prefetch-Control", "off");
  headers.set(
    "X-Permitted-Cross-Domain-Policies",
    "none",
  );
  headers.set("Origin-Agent-Cluster", "?1");

  if (requestUrl?.startsWith("https://")) {
    headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }

  if (response.status >= 500) {
    headers.set("Cache-Control", "no-store");
  } else if (requestUrl) {
    try {
      const pathname = new URL(requestUrl).pathname;

      if (
        pathname.startsWith("/assets/") &&
        !headers.has("Cache-Control")
      ) {
        headers.set(
          "Cache-Control",
          "public, max-age=31536000, immutable",
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
