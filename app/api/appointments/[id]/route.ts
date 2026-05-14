import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getDatabase } from '@/lib/mongodb'
import { getSession } from '@/lib/get-session'
import type { Appointment } from '@/lib/types'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

const patchSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled']),
})

export async function PATCH(request: Request, context: RouteParams) {
  try {
    const session = await getSession()
    if (!session || session.typ !== 'barber') {
      return NextResponse.json({ message: 'No autorizado.' }, { status: 403 })
    }

    const { id } = await context.params
    const parsed = patchSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || 'Datos invalidos.' },
        { status: 400 },
      )
    }

    const db = await getDatabase()
    const collection = db.collection<Appointment>('appointments')
    const doc = await collection.findOne({ id })
    if (!doc || doc.barberId !== session.sub) {
      return NextResponse.json({ message: 'Cita no encontrada.' }, { status: 404 })
    }

    await collection.updateOne({ id }, { $set: { status: parsed.data.status } })
    const updated = await collection.findOne(
      { id },
      { projection: { _id: 0 } },
    )

    if (!updated) {
      return NextResponse.json({ message: 'Cita no encontrada.' }, { status: 404 })
    }

    return NextResponse.json({ data: updated })
  } catch (error) {
    console.error('PATCH appointment failed:', error)
    return NextResponse.json(
      { message: 'No se pudo actualizar la cita.' },
      { status: 500 },
    )
  }
}

export async function DELETE(_: Request, context: RouteParams) {
  try {
    const session = await getSession()
    if (!session || session.typ !== 'client') {
      return NextResponse.json({ message: 'No autorizado.' }, { status: 403 })
    }

    const { id } = await context.params
    const db = await getDatabase()
    const collection = db.collection<Appointment>('appointments')
    const doc = await collection.findOne({ id })
    if (!doc) {
      return NextResponse.json({ message: 'Cita no encontrada.' }, { status: 404 })
    }
    if (doc.clientId && doc.clientId !== session.sub) {
      return NextResponse.json({ message: 'No autorizado.' }, { status: 403 })
    }
    if (!doc.clientId) {
      return NextResponse.json(
        { message: 'Esta cita no puede cancelarse desde la cuenta actual.' },
        { status: 403 },
      )
    }

    await collection.deleteOne({ id })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Failed to delete appointment in MongoDB Atlas:', error)
    return NextResponse.json(
      { message: 'No se pudo cancelar la cita.' },
      { status: 500 },
    )
  }
}
