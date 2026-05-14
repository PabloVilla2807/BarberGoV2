import { NextResponse } from 'next/server'
import { getSession } from '@/lib/get-session'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ message: 'No autenticado.' }, { status: 401 })
  }

  return NextResponse.json({
    data: {
      userType: session.typ,
      user: {
        id: session.sub,
        name: session.name,
        email: session.email,
      },
    },
  })
}
