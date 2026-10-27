import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (path.startsWith('/admin')) {
    // Validación de permisos
  }

  if (path.startsWith('/talent')) {
    // Validación de talento
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/talent/:path*', '/dashboard/:path*'],
}
