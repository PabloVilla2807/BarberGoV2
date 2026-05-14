import { SignJWT, jwtVerify } from 'jose'

export const SESSION_COOKIE_NAME = 'barbergo_session'
const MAX_AGE_SEC = 60 * 60 * 24 * 7

function getEncodedSecret() {
  const secret = process.env.AUTH_SECRET
  if (!secret || secret.length < 16) {
    throw new Error(
      'AUTH_SECRET debe estar definido en .env.local (minimo 16 caracteres).',
    )
  }
  return new TextEncoder().encode(secret)
}

export async function createSessionToken(payload: {
  sub: string
  typ: 'client' | 'barber'
  name: string
  email: string
}) {
  return new SignJWT({ typ: payload.typ, name: payload.name, email: payload.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SEC}s`)
    .sign(getEncodedSecret())
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getEncodedSecret())
  return payload
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: MAX_AGE_SEC,
  }
}
