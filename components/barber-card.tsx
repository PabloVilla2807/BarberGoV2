'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Star, MapPin, Clock, Phone, Scissors, MessageCircle } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Appointment, Barber } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface BarberCardProps {
  barber: Barber
  appointments: Appointment[]
  onCreateAppointment: (appointment: Appointment) => void
}

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '16:00', '18:00']

function getNextDays(totalDays = 7) {
  const dateFormatter = new Intl.DateTimeFormat('es-MX', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() + index)
    const isoDate = date.toISOString().split('T')[0]
    return {
      value: isoDate,
      label: dateFormatter.format(date),
    }
  })
}

function formatAppointmentDateLabel(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number)
  const local = new Date(year, month - 1, day)
  return new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(local)
}

function buildWhatsAppConfirmUrl(
  phoneDigits: string,
  barber: Barber,
  selectedDate: string,
  selectedTime: string,
) {
  const name = barber.name.trim()
  const location = barber.location.trim()

  const text =
    selectedDate && selectedTime
      ? `Hola ${name},

Soy cliente de BarberGo y quiero confirmar mi cita:

📅 ${formatAppointmentDateLabel(selectedDate)}
🕐 ${selectedTime}
📍 ${location}

¿Me confirmas esta reservación? Gracias.`
      : `Hola ${name},

Soy cliente de BarberGo. Me gustaría agendar una cita contigo en ${location}.

¿Qué días y horarios tienes disponibles?

Gracias.`

  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(text)}`
}

export function BarberCard({
  barber,
  appointments,
  onCreateAppointment,
}: BarberCardProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  const availableDays = useMemo(() => getNextDays(), [])

  const bookedSlots = useMemo(() => {
    return new Set(
      appointments
        .filter(
          (appointment) =>
            appointment.barberId === barber.id &&
            appointment.date === selectedDate &&
            (appointment.status ?? 'confirmed') !== 'cancelled',
        )
        .map((appointment) => appointment.time),
    )
  }, [appointments, barber.id, selectedDate])

  const availableTimeSlots = TIME_SLOTS.filter((time) => !bookedSlots.has(time))

  const phoneDigits = barber.phone.replace(/\D/g, '')

  const whatsappLink = useMemo(() => {
    if (!phoneDigits) {
      return ''
    }
    return buildWhatsAppConfirmUrl(phoneDigits, barber, selectedDate, selectedTime)
  }, [barber, phoneDigits, selectedDate, selectedTime])

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      return
    }

    onCreateAppointment({
      id: crypto.randomUUID(),
      barberId: barber.id,
      barberName: barber.name,
      barberLocation: barber.location,
      date: selectedDate,
      time: selectedTime,
      createdAt: new Date().toISOString(),
      status: 'pending',
    })

    setIsBookingOpen(false)
    setSelectedDate('')
    setSelectedTime('')
  }

  return (
    <Card className="overflow-hidden bg-card border-border hover:border-foreground/30 transition-all duration-300 group">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={barber.photo}
          alt={barber.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        
        <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-sm px-2 py-1 flex items-center gap-1 border border-border">
          <Star className="h-3 w-3 fill-accent text-accent" />
          <span className="font-serif text-sm text-card-foreground">{barber.rating}</span>
          <span className="text-muted-foreground text-xs">({barber.reviewCount})</span>
        </div>
        
        {barber.distance && (
          <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-sm px-2 py-1 text-xs tracking-wider uppercase">
            {barber.distance} km
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-serif text-xl text-white drop-shadow-lg">{barber.name}</h3>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{barber.location}</span>
          </div>
          <span className="text-accent font-serif text-sm">{barber.priceRange}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {barber.specialties.map((specialty) => (
            <Badge 
              key={specialty} 
              variant="secondary" 
              className="text-xs tracking-wider uppercase bg-secondary/50 text-secondary-foreground border border-border"
            >
              {specialty}
            </Badge>
          ))}
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {barber.bio}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{barber.availability}</span>
          </div>
          <div className="flex items-center gap-1">
            <Scissors className="h-3 w-3" />
            <span>{barber.yearsExperience} anos exp.</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 tracking-wider uppercase text-xs"
              size="sm"
            >
              Reservar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reservar con {barber.name}</DialogTitle>
              <DialogDescription>
                Selecciona un dia y horario disponible para tu cita.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Dia</p>
                <Select
                  value={selectedDate}
                  onValueChange={(date) => {
                    setSelectedDate(date)
                    setSelectedTime('')
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un dia" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDays.map((day) => (
                      <SelectItem key={day.value} value={day.value} className="capitalize">
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Horario</p>
                <Select
                  value={selectedTime}
                  onValueChange={setSelectedTime}
                  disabled={!selectedDate || availableTimeSlots.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        selectedDate
                          ? 'Selecciona un horario'
                          : 'Selecciona primero un dia'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedDate && availableTimeSlots.length === 0 && (
                  <p className="text-xs text-destructive">
                    No hay horarios libres para este dia.
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <div className="w-full flex flex-col gap-2">
                <Button
                  className="w-full"
                  onClick={handleBookAppointment}
                  disabled={!selectedDate || !selectedTime}
                >
                  Confirmar reservacion
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-green-600/40 text-green-700 hover:bg-green-50"
                  disabled={!phoneDigits}
                  onClick={() => {
                    if (!whatsappLink) return
                    window.open(whatsappLink, '_blank', 'noopener,noreferrer')
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contactar por WhatsApp
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 border-border text-card-foreground hover:bg-card-foreground/10"
        >
          <Phone className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
