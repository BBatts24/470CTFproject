import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only redirect https to http for 404 pages
  if (request.nextUrl.pathname === '/404' && request.nextUrl.protocol === 'https:') {
    const url = request.nextUrl.clone();
    url.protocol = 'http:';
    return NextResponse.redirect(url);
  }
  
  const response = NextResponse.next();
  
  // Add custom headers for 404 pages
  response.headers.set('X-Page-Type', '404-Not-Found');
  response.headers.set('X-Error-Code', '404');
  response.headers.set('Cache-Control', 'public, max-age=3600');
  response.headers.set('X-Custom-Message', 'FLAG:{networkLEAK}');
  
  return response;
}

export const config = {
  matcher: '/:path*',
};
