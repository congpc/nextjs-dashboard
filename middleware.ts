import { NextResponse } from "next/server";

export function middleware(request: any) {
  let cspFaHeader = process.env.CSP_HEADERS;
  if (!cspFaHeader || !cspFaHeader.length) {
    cspFaHeader = "frame-ancestors 'self' https://congpc.vercel.app http://localhost:3000;"
  }
  let nonce = '';
  let nonceHeader = '';
  if (process.env.NONCE_HEADER === 'true') {
    nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    nonceHeader = `
      script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http: ${
      process.env.NODE_ENV === "production" ? "" : `'unsafe-eval'`
      };
      style-src 'self' 'nonce-${nonce}';
    `
  }
  // default-src 'self';
  // img-src 'self' blob: data:;
  // font-src 'self';
  // object-src 'none';
  // base-uri 'self';
  // form-action 'self';
  // upgrade-insecure-requests;
  const cspHeader = `
    ${nonceHeader}
    ${cspFaHeader}
  `;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();
  const requestHeaders = new Headers(request.headers);
  if (process.env.NONCE_HEADER === 'true') requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
