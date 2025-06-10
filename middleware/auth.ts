import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get('user');
  let isLoggedIn = false;
  
  if (userCookie && userCookie.value) {
    try {
      const userData = JSON.parse(userCookie.value);
      isLoggedIn = userData.isLoggedIn;
    } catch (error) {
      // If JSON parsing fails, treat as not logged in
      isLoggedIn = false;
    }
  }

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
