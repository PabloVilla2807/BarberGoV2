import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { getSession } from '@/lib/get-session'
import type { Appointment, AppointmentStatus } from '@/lib/types'

function normalizeStatus(status: unknown): AppointmentStatus {
  if (status === 'pending' || status === 'confirmed' || status === 'cancelled') {
    return status
  }
  return 'confirmed'
}

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.typ !== 'client') {
      return NextResponse.json({ message: 'No autorizado.' }, { status: 403 })
    }

    const db = await getDatabase()
    const appointments = await db
      .collection<Appointment>('appointments')
      .find({ clientId: session.sub }, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray()

    const data = appointments.map((row) => ({
      ...row,
      status: normalizeStatus(row.status),
    }))

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Failed to fetch appointments from MongoDB Atlas:', error)
    return NextResponse.json(
      { message: 'No se pudieron consultar las citas.' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session || session.typ !== 'client') {
      return NextResponse.json(
        { message: 'Solo los clientes pueden crear citas.' },
        { status: 403 },
      )
    }

    const body = (await request.json()) as Partial<Appointment> & {
      id: string
      barberId: string
      barberName: string
      barberLocation: string
      date: string
      time: string
      createdAt: string
    }

    const appointment: Appointment = {
      id: body.id,
      barberId: body.barberId,
      barberName: body.barberName,
      barberLocation: body.barberLocation,
      date: body.date,
      time: body.time,
      createdAt: body.createdAt,
      status: 'pending',
      clientId: session.sub,
      clientName: session.name,
      clientEmail: session.email,
    }

    const db = await getDatabase()
    await db.collection<Appointment>('appointments').insertOne(appointment)

    return NextResponse.json({ data: appointment }, { status: 201 })
  } catch (error) {
    console.error('Failed to create appointment in MongoDB Atlas:', error)
    return NextResponse.json(
      { message: 'No se pudo crear la cita.' },
      { status: 500 },
    )
  }
}
