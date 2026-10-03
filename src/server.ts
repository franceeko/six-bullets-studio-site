import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

import { logServerError } from "@/lib/error-capture";
import { renderErrorPage } from "@/lib/error-page";
import { withSecurityHeaders } from "@/lib/security-headers";

async function fetchWithProtection(request: Request) {
  try {
    const response = await handler.fetch(request);
    if (response.status < 500) {
      return withSecurityHeaders(response, request.url);
    }

    logServerError("TanStack Start returned a server error", `HTTP ${response.status}`);
    return withSecurityHeaders(
      new Response(renderErrorPage(), {
        status: response.status,
        statusText: response.statusText,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
        },
      }),
      request.url,
    );
  } catch (error) {
    logServerError("Unhandled server error", error);
    return withSecurityHeaders(
      new Response(renderErrorPage(), {
        status: 500,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
        },
      }),
      request.url,
    );
  }
}

export default createServerEntry({
  fetch: fetchWithProtection,
});
