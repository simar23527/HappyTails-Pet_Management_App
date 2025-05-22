import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const user = request.cookies.get('user');
  const isLoggedIn = user && JSON.parse(user).isLoggedIn;

  // List of protected routes
  const protectedRoutes = ['/PetShopping', '/ProductListing', '/Cart', '/Checkout'];

  // Check if the requested path is in protectedRoutes
  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/PetShopping/:path*', '/ProductListing/:path*', '/Cart/:path*', '/Checkout/:path*'],
}; 