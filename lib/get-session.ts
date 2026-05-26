import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { SESSION_COOKIE_NAME } from '@/lib/auth-session'

export interface SessionUser {
  sub: string
  typ: 'client' | 'barber'
  name: string
  email: string
}

export async function getSession(): Promise<SessionUser | null> {
  const secret = process.env.AUTH_SECRET
  if (!secret || secret.length < 16) {
    return null
  }

  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))
    const typ = payload.typ
    if (typ !== 'client' && typ !== 'barber') {
      return null
    }
    const sub = typeof payload.sub === 'string' ? payload.sub : ''
    const name = typeof payload.name === 'string' ? payload.name : ''
    const email = typeof payload.email === 'string' ? payload.email : ''
    if (!sub) {
      return null
    }
    return { sub, typ, name, email }
  } catch {
    return null
  }
}
