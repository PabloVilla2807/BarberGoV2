import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { hashPassword } from '@/lib/password'
import {
  clientRegistrationSchema,
  isEmailRegistered,
  normalizeEmail,
} from '@/lib/register'
import type { Client } from '@/lib/types'

interface ClientRecord extends Client {
  passwordHash: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = clientRegistrationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || 'Datos invalidos.' },
        { status: 400 },
      )
    }

    const { name, email, phone, password } = parsed.data
    const normalizedEmail = normalizeEmail(email)

    if (await isEmailRegistered(normalizedEmail)) {
      return NextResponse.json(
        { message: 'Ya existe una cuenta con ese correo electronico.' },
        { status: 409 },
      )
    }

    const client: ClientRecord = {
      id: randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      createdAt: new Date().toISOString(),
      passwordHash: await hashPassword(password),
    }

    const db = await getDatabase()
    await db.collection<ClientRecord>('clients').insertOne(client)

    const { passwordHash: _, ...publicClient } = client

    return NextResponse.json({ data: publicClient }, { status: 201 })
  } catch (error) {
    console.error('Failed to create client in MongoDB Atlas:', error)
    return NextResponse.json(
      { message: 'No se pudo crear la cuenta de cliente.' },
      { status: 500 },
    )
  }
}
