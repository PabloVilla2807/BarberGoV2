import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getDatabase } from '@/lib/mongodb'
import { getSession } from '@/lib/get-session'
import { extractCityFromLocation, parseSpecialties } from '@/lib/register'
import type { Barber } from '@/lib/types'

interface BarberRecord extends Barber {
  email?: string
  passwordHash?: string
  createdAt?: string
}

const publicProjection = {
  _id: 0,
  passwordHash: 0,
} as const

const updateSchema = z.object({
  name: z.string().trim().min(1).optional(),
  phone: z.string().trim().min(1).optional(),
  location: z.string().trim().min(1).optional(),
  bio: z.string().optional(),
  availability: z.string().trim().min(1).optional(),
  yearsExperience: z.coerce.number().int().min(0).optional(),
  priceRange: z.string().trim().min(1).optional(),
  photo: z.string().trim().min(1).optional(),
  specialties: z.union([z.array(z.string()), z.string()]).optional(),
})

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.typ !== 'barber') {
      return NextResponse.json({ message: 'No autorizado.' }, { status: 403 })
    }

    const db = await getDatabase()
    const barber = await db
      .collection<BarberRecord>('barbers')
      .findOne({ id: session.sub }, { projection: publicProjection })

    if (!barber) {
      return NextResponse.json({ message: 'Perfil no encontrado.' }, { status: 404 })
    }

    return NextResponse.json({ data: barber })
  } catch (error) {
    console.error('GET /api/barbers/me failed:', error)
    return NextResponse.json(
      { message: 'No se pudo cargar el perfil.' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession()
    if (!session || session.typ !== 'barber') {
      return NextResponse.json({ message: 'No autorizado.' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || 'Datos invalidos.' },
        { status: 400 },
      )
    }

    const db = await getDatabase()
    const collection = db.collection<BarberRecord>('barbers')
    const existing = await collection.findOne({ id: session.sub })
    if (!existing) {
      return NextResponse.json({ message: 'Perfil no encontrado.' }, { status: 404 })
    }

    const patch: Partial<BarberRecord> = {}
    const data = parsed.data

    if (data.name !== undefined) patch.name = data.name
    if (data.phone !== undefined) patch.phone = data.phone
    if (data.bio !== undefined) patch.bio = data.bio.trim()
    if (data.availability !== undefined) patch.availability = data.availability
    if (data.yearsExperience !== undefined) patch.yearsExperience = data.yearsExperience
    if (data.priceRange !== undefined) patch.priceRange = data.priceRange
    if (data.photo !== undefined) {
      patch.photo = data.photo
    }
    if (data.location !== undefined) {
      patch.location = data.location
      patch.city = extractCityFromLocation(data.location)
    }
    if (data.specialties !== undefined) {
      patch.specialties =
        typeof data.specialties === 'string'
          ? parseSpecialties(data.specialties)
          : data.specialties.map((s) => s.trim()).filter(Boolean)
    }

    if (Object.keys(patch).length === 0) {
      const barber = await collection.findOne(
        { id: session.sub },
        { projection: publicProjection },
      )
      return NextResponse.json({ data: barber })
    }

    await collection.updateOne({ id: session.sub }, { $set: patch })
    const updated = await collection.findOne(
      { id: session.sub },
      { projection: publicProjection },
    )

    return NextResponse.json({ data: updated })
  } catch (error) {
    console.error('PATCH /api/barbers/me failed:', error)
    return NextResponse.json(
      { message: 'No se pudo actualizar el perfil.' },
      { status: 500 },
    )
  }
}
