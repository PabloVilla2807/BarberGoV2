'use client'

import { CalendarDays, Clock3, MapPin, Scissors, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Appointment } from '@/lib/types'

interface AppointmentsListProps {
  appointments: Appointment[]
  onCancelAppointment: (appointmentId: string) => void
}

const dateFormatter = new Intl.DateTimeFormat('es-MX', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

function statusLabel(status: Appointment['status'] | undefined) {
  switch (status ?? 'pending') {
    case 'pending':
      return 'Pendiente de confirmacion'
    case 'confirmed':
      return 'Confirmada por el barbero'
    case 'cancelled':
      return 'Cancelada'
    default:
      return 'Pendiente de confirmacion'
  }
}

export function AppointmentsList({
  appointments,
  onCancelAppointment,
}: AppointmentsListProps) {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-border rounded-lg">
        <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mb-4">
          <CalendarDays className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Aun no tienes citas</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Reserva con un barbero en la pestaña de listado para que aparezca aqui.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id} className="border-border bg-card">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-serif text-lg text-foreground">{appointment.barberName}</h3>
                <p className="text-sm text-muted-foreground">{statusLabel(appointment.status)}</p>
              </div>
              <Scissors className="h-5 w-5 text-primary" />
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span className="capitalize">{dateFormatter.format(new Date(appointment.date))}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                <span>{appointment.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{appointment.barberLocation}</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-border"
              disabled={(appointment.status ?? 'pending') === 'cancelled'}
              onClick={() => onCancelAppointment(appointment.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Cancelar cita
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
