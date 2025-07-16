
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth?.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth")
    const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth")
    const isPublicPage = req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/public")

    // Allow API auth routes
    if (isApiAuthRoute) {
      return NextResponse.next()
    }

    // Allow public pages
    if (isPublicPage) {
      return NextResponse.next()
    }

    // Redirect to login if not authenticated and trying to access protected pages
    if (!isAuth && !isAuthPage) {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }

    // Redirect to dashboard if authenticated and trying to access auth pages
    if (isAuth && isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // UNIVERSAL RFQ SYSTEM - AUTOMATIC PORTAL REDIRECTION
    // Redirect users to appropriate portal based on their role/type
    const userRoles = token?.roles || []
    const isCustomerPortalPath = req.nextUrl.pathname.startsWith("/customer-portal")
    const isSupplierPortalPath = req.nextUrl.pathname.startsWith("/supplier-portal")
    const isInternalPath = !isCustomerPortalPath && !isSupplierPortalPath

    // Helper function to check if user has specific role
    const hasRole = (roleName: string) => {
      if (!Array.isArray(userRoles)) return false
      return userRoles.some((role: any) => {
        return typeof role === 'string' ? role === roleName : role?.name === roleName
      })
    }

    // Automatic portal redirection logic
    if (isAuth && !isAuthPage) {
      // Customer portal users
      if (hasRole('customer') && !isCustomerPortalPath) {
        console.log('🔄 Redirecting customer to customer portal:', token?.sub)
        return NextResponse.redirect(new URL("/customer-portal", req.url))
      }
      
      // Supplier portal users
      if (hasRole('supplier') && !isSupplierPortalPath) {
        console.log('🔄 Redirecting supplier to supplier portal:', token?.sub)
        return NextResponse.redirect(new URL("/supplier-portal", req.url))
      }
      
      // Internal users (default to main system)
      if (!hasRole('customer') && !hasRole('supplier') && (isCustomerPortalPath || isSupplierPortalPath)) {
        console.log('🔄 Redirecting internal user to dashboard:', token?.sub)
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true // We handle auth in the middleware function
    }
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)"
  ]
}
