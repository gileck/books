import { NextResponse } from 'next/server';

export function middleware(request) {
  // Log information about the request
  // console.log('Middleware processing request:', request.method, request.nextUrl.pathname);

  // Allow the request to continue
  return NextResponse.next();
}

// Configure which paths this middleware is run for
export const config = {
  matcher: [
    // Apply to all API routes
    '/api/:path*',
  ],
};
