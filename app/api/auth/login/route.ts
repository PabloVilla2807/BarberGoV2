import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getDatabase } from '@/lib/mongodb'
import {
  SESSION_COOKIE_NAME,
  createSessionToken,
  sessionCookieOptions,
} from '@/lib/auth-session'
import { verifyPassword } from '@/lib/password'
import { normalizeEmail } from '@/lib/register'

const loginSchema = z.object({
  email: z.string().trim().email('Correo electronico invalido.'),
  password: z.string().min(1, 'La contrasena es obligatoria.'),
})

interface ClientDoc {
  id: string
  name: string
  email: string
  phone: string
  passwordHash?: string
}

interface BarberDoc {
  id: string
  name: string
  email: string
  passwordHash?: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || 'Datos invalidos.' },
        { status: 400 },
      )
    }

    const email = normalizeEmail(parsed.data.email)
    const password = parsed.data.password
    const db = await getDatabase()

    const client = await db.collection<ClientDoc>('clients').findOne({ email })
    if (client?.passwordHash) {
      const ok = await verifyPassword(password, client.passwordHash)
      if (ok) {
        const token = await createSessionToken({
          sub: client.id,
          typ: 'client',
          name: client.name,
          email: client.email,
        })
        const res = NextResponse.json({
          data: {
            userType: 'client' as const,
            user: {
              id: client.id,
              name: client.name,
              email: client.email,
            },
          },
        })
        res.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions())
        return res
      }
    }

    const barber = await db.collection<BarberDoc>('barbers').findOne({ email })
    if (barber?.passwordHash) {
      const ok = await verifyPassword(password, barber.passwordHash)
      if (ok) {
        const token = await createSessionToken({
          sub: barber.id,
          typ: 'barber',
          name: barber.name,
          email: barber.email,
        })
        const res = NextResponse.json({
          data: {
            userType: 'barber' as const,
            user: {
              id: barber.id,
              name: barber.name,
              email: barber.email,
            },
          },
        })
        res.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions())
        return res
      }
    }

    return NextResponse.json(
      { message: 'Correo o contrasena incorrectos.' },
      { status: 401 },
    )
  } catch (error) {
    if (error instanceof Error && error.message.includes('AUTH_SECRET')) {
      console.error(error.message)
      return NextResponse.json(
        { message: 'El servidor no tiene configurada la sesion (AUTH_SECRET).' },
        { status: 500 },
      )
    }
    console.error('Login failed:', error)
    return NextResponse.json(
      { message: 'No se pudo iniciar sesion. Intenta de nuevo.' },
      { status: 500 },
    )
  }
}
