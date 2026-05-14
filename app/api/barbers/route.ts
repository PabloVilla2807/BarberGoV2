import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { barbers as mockBarbers } from '@/lib/mock-data'
import { hashPassword } from '@/lib/password'
import {
  barberRegistrationSchema,
  DEFAULT_BARBER_PHOTO,
  extractCityFromLocation,
  isEmailRegistered,
  normalizeEmail,
  parseSpecialties,
} from '@/lib/register'
import type { Barber } from '@/lib/types'

interface BarberRecord extends Barber {
  email: string
  passwordHash: string
  createdAt: string
}

const publicBarberProjection = {
  _id: 0,
  email: 0,
  passwordHash: 0,
  createdAt: 0,
} as const

export async function GET() {
  try {
    const db = await getDatabase()
    const collection = db.collection<BarberRecord>('barbers')
    const barbers = await collection
      .find({}, { projection: publicBarberProjection })
      .toArray()

    if (barbers.length === 0) {
      await collection.insertMany(mockBarbers)
      return NextResponse.json({ data: mockBarbers })
    }

    return NextResponse.json({ data: barbers })
  } catch (error) {
    console.error('Failed to fetch barbers from MongoDB Atlas:', error)
    return NextResponse.json(
      { message: 'No se pudo consultar la base de datos.' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = barberRegistrationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || 'Datos invalidos.' },
        { status: 400 },
      )
    }

    const {
      name,
      email,
      phone,
      location,
      specialties,
      bio,
      yearsExperience,
      priceRange,
      password,
    } = parsed.data
    const normalizedEmail = normalizeEmail(email)

    if (await isEmailRegistered(normalizedEmail)) {
      return NextResponse.json(
        { message: 'Ya existe una cuenta con ese correo electronico.' },
        { status: 409 },
      )
    }

    const barber: BarberRecord = {
      id: randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      location: location.trim(),
      city: extractCityFromLocation(location),
      specialties: parseSpecialties(specialties),
      bio: bio?.trim() || '',
      yearsExperience,
      priceRange: priceRange.trim(),
      photo: DEFAULT_BARBER_PHOTO,
      rating: 0,
      reviewCount: 0,
      availability: 'Por confirmar',
      createdAt: new Date().toISOString(),
      passwordHash: await hashPassword(password),
    }

    const db = await getDatabase()
    await db.collection<BarberRecord>('barbers').insertOne(barber)

    const { email: _, passwordHash: __, createdAt: ___, ...publicBarber } = barber

    return NextResponse.json({ data: publicBarber }, { status: 201 })
  } catch (error) {
    console.error('Failed to create barber in MongoDB Atlas:', error)
    return NextResponse.json(
      { message: 'No se pudo crear la cuenta de barbero.' },
      { status: 500 },
    )
  }
}
