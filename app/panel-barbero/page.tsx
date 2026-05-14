'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  CalendarDays,
  Clock3,
  LogOut,
  MapPin,
  Scissors,
  User,
  Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Appointment, AppointmentStatus, Barber } from '@/lib/types'

const dateFormatter = new Intl.DateTimeFormat('es-MX', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

function statusBadgeVariant(status: AppointmentStatus | undefined) {
  switch (status ?? 'pending') {
    case 'pending':
      return 'secondary' as const
    case 'confirmed':
      return 'default' as const
    case 'cancelled':
      return 'outline' as const
    default:
      return 'secondary' as const
  }
}

function statusText(status: AppointmentStatus | undefined) {
  switch (status ?? 'pending') {
    case 'pending':
      return 'Pendiente'
    case 'confirmed':
      return 'Confirmada'
    case 'cancelled':
      return 'Rechazada'
    default:
      return 'Pendiente'
  }
}

type BarberProfile = Barber & { email?: string }

export default function PanelBarberoPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('citas')
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [profile, setProfile] = useState<BarberProfile | null>(null)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    location: '',
    bio: '',
    availability: '',
    yearsExperience: '',
    priceRange: '',
    photo: '',
    specialties: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const [apRes, meRes] = await Promise.all([
        fetch('/api/barber/appointments', { cache: 'no-store' }),
        fetch('/api/barbers/me', { cache: 'no-store' }),
      ])
      if (!apRes.ok || !meRes.ok) {
        throw new Error('No se pudieron cargar los datos.')
      }
      const apJson = (await apRes.json()) as { data: Appointment[] }
      const meJson = (await meRes.json()) as { data: BarberProfile }
      setAppointments(apJson.data)
      const b = meJson.data
      setProfile(b)
      setForm({
        name: b.name,
        phone: b.phone,
        location: b.location,
        bio: b.bio,
        availability: b.availability,
        yearsExperience: String(b.yearsExperience),
        priceRange: b.priceRange,
        photo: b.photo,
        specialties: b.specialties.join(', '),
      })
    } catch {
      setErrorMessage('No se pudo cargar el panel. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      const left = new Date(`${a.date}T${a.time}:00`).getTime()
      const right = new Date(`${b.date}T${b.time}:00`).getTime()
      return left - right
    })
  }, [appointments])

  const updateAppointmentStatus = async (
    id: string,
    status: AppointmentStatus,
  ) => {
    setErrorMessage('')
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) {
        throw new Error('No se pudo actualizar la cita.')
      }
      const payload = (await response.json()) as { data: Appointment }
      setAppointments((current) =>
        current.map((row) => (row.id === id ? payload.data : row)),
      )
    } catch {
      setErrorMessage('No se pudo actualizar el estado de la cita.')
    }
  }

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setErrorMessage('')
    setSuccessMessage('')
    try {
      const response = await fetch('/api/barbers/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          location: form.location,
          bio: form.bio,
          availability: form.availability,
          yearsExperience: Number(form.yearsExperience),
          priceRange: form.priceRange,
          photo: form.photo.trim() || profile.photo,
          specialties: form.specialties,
        }),
      })
      if (!response.ok) {
        const err = (await response.json()) as { message?: string }
        throw new Error(err.message || 'No se pudo guardar.')
      }
      const payload = (await response.json()) as { data: BarberProfile }
      setProfile(payload.data)
      setSuccessMessage('Perfil actualizado correctamente.')
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Error al guardar.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full border border-border flex items-center justify-center">
              <Scissors className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-muted-foreground">
                Panel barbero
              </p>
              <h1 className="font-serif text-lg text-foreground">
                {profile?.name ?? 'BarberGo'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">Inicio</Link>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="default"
              className="gap-2"
              onClick={() => void handleSignOut()}
            >
              <LogOut className="h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {errorMessage && (
          <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 rounded-md border border-green-600/30 bg-green-50 px-4 py-3 text-sm text-green-800 dark:bg-green-950/40 dark:text-green-200">
            {successMessage}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 h-11 bg-secondary/60">
            <TabsTrigger
              value="citas"
              className="px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Citas de clientes
            </TabsTrigger>
            <TabsTrigger
              value="perfil"
              className="px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Mi informacion
            </TabsTrigger>
          </TabsList>

          <TabsContent value="citas">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Cargando citas...</p>
            ) : sortedAppointments.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
                Aun no tienes reservas desde la app. Cuando un cliente reserve
                contigo, apareceran aqui.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {sortedAppointments.map((appointment) => (
                  <Card key={appointment.id} className="border-border bg-card">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-muted-foreground">
                            Cliente
                          </p>
                          <p className="font-medium text-foreground flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {appointment.clientName || 'Cliente BarberGo'}
                          </p>
                          {appointment.clientEmail && (
                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                              <Mail className="h-3.5 w-3.5" />
                              {appointment.clientEmail}
                            </p>
                          )}
                        </div>
                        <Badge variant={statusBadgeVariant(appointment.status)}>
                          {statusText(appointment.status)}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 shrink-0" />
                          <span className="capitalize">
                            {dateFormatter.format(new Date(appointment.date))}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4 shrink-0" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span>{appointment.barberLocation}</span>
                        </div>
                      </div>

                      {(appointment.status ?? 'pending') === 'pending' && (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            type="button"
                            className="flex-1"
                            onClick={() =>
                              void updateAppointmentStatus(
                                appointment.id,
                                'confirmed',
                              )
                            }
                          >
                            Confirmar cita
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1 border-destructive/40 text-destructive hover:bg-destructive/10"
                            onClick={() =>
                              void updateAppointmentStatus(
                                appointment.id,
                                'cancelled',
                              )
                            }
                          >
                            Rechazar
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="perfil">
            {isLoading || !profile ? (
              <p className="text-sm text-muted-foreground">Cargando perfil...</p>
            ) : (
              <form
                onSubmit={(e) => void handleSaveProfile(e)}
                className="max-w-xl space-y-4 border border-border rounded-lg p-6 bg-card"
              >
                {profile.email && (
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                      Correo (no editable)
                    </Label>
                    <p className="text-sm text-foreground">{profile.email}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Nombre profesional</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Direccion / ubicacion</Label>
                  <Input
                    id="location"
                    value={form.location}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, location: e.target.value }))
                    }
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    La ciudad se actualiza automaticamente a partir de la ultima
                    parte tras una coma (ej. Calle 1, Tijuana).
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialties">Especialidades (separadas por coma)</Label>
                  <Input
                    id="specialties"
                    value={form.specialties}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, specialties: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Descripcion</Label>
                  <Textarea
                    id="bio"
                    rows={3}
                    value={form.bio}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, bio: e.target.value }))
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="years">Anos de experiencia</Label>
                    <Input
                      id="years"
                      type="number"
                      min={0}
                      value={form.yearsExperience}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          yearsExperience: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Rango de precios</Label>
                    <Input
                      id="price"
                      value={form.priceRange}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, priceRange: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">Horario de atencion</Label>
                  <Input
                    id="availability"
                    value={form.availability}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, availability: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo">URL de foto</Label>
                  <Input
                    id="photo"
                    value={form.photo}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, photo: e.target.value }))
                    }
                  />
                </div>

                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </form>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
