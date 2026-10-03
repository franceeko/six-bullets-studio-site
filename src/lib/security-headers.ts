const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "form-action 'self'",
  "script-src 'self'",
  "script-src-attr 'none'",
  "style-src 'self'",
  "style-src-elem 'self'",
  "style-src-attr 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
].join("; ");

const CONTENT_SECURITY_POLICY_HTTPS = `${CONTENT_SECURITY_POLICY}; upgrade-insecure-requests`;

export function withSecurityHeaders(response: Response, requestUrl?: string): Response {
  const headers = new Headers(response.headers);

  headers.set(
    "Content-Security-Policy",
    requestUrl?.startsWith("https://") ? CONTENT_SECURITY_POLICY_HTTPS : CONTENT_SECURITY_POLICY,
  );
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Permissions-Policy",
    "accelerometer=(), autoplay=(self), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=()",
  );
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("Cross-Origin-Resource-Policy", "same-origin");
  headers.set("X-DNS-Prefetch-Control", "off");
  headers.set("X-Permitted-Cross-Domain-Policies", "none");
  headers.set("Origin-Agent-Cluster", "?1");

  if (requestUrl?.startsWith("https://")) {
    headers.set("Strict-Transport-Security", "max-age=31536000");
  }

  if (response.status >= 500) {
    headers.set("Cache-Control", "no-store");
  } else if (requestUrl) {
    try {
      const pathname = new URL(requestUrl).pathname;
      if (pathname.startsWith("/assets/") && !headers.has("Cache-Control")) {
        headers.set("Cache-Control", "public, max-age=31536000, immutable");
      }
    } catch {
      // Ignore malformed request URLs; the response remains otherwise valid.
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
