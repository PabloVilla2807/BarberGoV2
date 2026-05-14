import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { SESSION_COOKIE_NAME } from '@/lib/auth-session'

export async function middleware(request: NextRequest) {
  const secret = process.env.AUTH_SECRET
  if (!secret || secret.length < 16) {
    return NextResponse.next()
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))
    const typ = payload.typ
    const pathname = request.nextUrl.pathname

    if (pathname.startsWith('/barberos')) {
      if (typ === 'barber') {
        return NextResponse.redirect(new URL('/panel-barbero', request.url))
      }
      if (typ !== 'client') {
        return NextResponse.redirect(new URL('/', request.url))
      }
      return NextResponse.next()
    }

    if (pathname.startsWith('/panel-barbero')) {
      if (typ === 'client') {
        return NextResponse.redirect(new URL('/barberos', request.url))
      }
      if (typ !== 'barber') {
        return NextResponse.redirect(new URL('/', request.url))
      }
      return NextResponse.next()
    }

    return NextResponse.next()
  } catch {
    const res = NextResponse.redirect(new URL('/', request.url))
    res.cookies.set(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })
    return res
  }
}

export const config = {
  matcher: ['/barberos/:path*', '/panel-barbero/:path*'],
}
