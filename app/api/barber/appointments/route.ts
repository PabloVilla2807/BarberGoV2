import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { getSession } from '@/lib/get-session'
import type { Appointment, AppointmentStatus } from '@/lib/types'

function normalizeStatus(status: unknown): AppointmentStatus {
  if (status === 'pending' || status === 'confirmed' || status === 'cancelled') {
    return status
  }
  return 'pending'
}

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.typ !== 'barber') {
      return NextResponse.json({ message: 'No autorizado.' }, { status: 403 })
    }

    const db = await getDatabase()
    const raw = await db
      .collection<Appointment>('appointments')
      .find({ barberId: session.sub }, { projection: { _id: 0 } })
      .sort({ date: 1, time: 1 })
      .toArray()

    const data = raw.map((row) => ({
      ...row,
      status: normalizeStatus(row.status),
    }))

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Failed to fetch barber appointments:', error)
    return NextResponse.json(
      { message: 'No se pudieron consultar las citas.' },
      { status: 500 },
    )
  }
}
