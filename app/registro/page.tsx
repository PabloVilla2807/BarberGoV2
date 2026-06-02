'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Scissors, Mail, Lock, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { LocationPickerDialog } from '@/components/location-picker-dialog'
import { PhotoUpload } from '@/components/photo-upload'
import type { UserType } from '@/lib/types'

const initialClientForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirm: '',
}

const initialBarberForm = {
  name: '',
  email: '',
  phone: '',
  location: '',
  specialties: '',
  bio: '',
  yearsExperience: '',
  priceRange: '',
  latitude: null as number | null,
  longitude: null as number | null,
  locationConfirmed: false,
  photo: null as string | null,
  password: '',
  passwordConfirm: '',
}

export default function RegistroPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<UserType>('client')
  const [clientForm, setClientForm] = useState(initialClientForm)
  const [barberForm, setBarberForm] = useState(initialBarberForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false)
  const [photoError, setPhotoError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      if (userType === 'barber' && !barberForm.locationConfirmed) {
        throw new Error('Confirma la ubicacion de tu barberia en el mapa.')
      }

      const endpoint = userType === 'client' ? '/api/clients' : '/api/barbers'
      const payload =
        userType === 'client'
          ? clientForm
          : {
              name: barberForm.name,
              email: barberForm.email,
              phone: barberForm.phone,
              location: barberForm.location,
              specialties: barberForm.specialties,
              bio: barberForm.bio,
              yearsExperience: Number(barberForm.yearsExperience),
              priceRange: barberForm.priceRange,
              password: barberForm.password,
              passwordConfirm: barberForm.passwordConfirm,
              latitude: barberForm.latitude,
              longitude: barberForm.longitude,
              ...(barberForm.photo ? { photo: barberForm.photo } : {}),
            }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = (await response.json()) as { message?: string }

      if (!response.ok) {
        throw new Error(result.message || 'No se pudo crear la cuenta.')
      }

      if (userType === 'client') {
        setClientForm(initialClientForm)
      } else {
        setBarberForm(initialBarberForm)
      }

      router.push('/')
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo conectar con MongoDB Atlas.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-lg mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-6 transition-colors text-sm tracking-wider uppercase"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="h-px w-10 bg-foreground/30" />
            <div className="w-14 h-14 rounded-full border-2 border-foreground/60 flex items-center justify-center">
              <Scissors className="h-6 w-6 text-foreground" />
            </div>
            <div className="h-px w-10 bg-foreground/30" />
          </div>

          <h1 className="font-serif text-3xl font-bold text-foreground tracking-wide mb-2">
            CREAR CUENTA
          </h1>
          <p className="text-foreground/60 text-sm tracking-widest uppercase">
            Unete a nuestra comunidad
          </p>
        </div>

        <div
          className="border border-foreground/20 bg-card/30 backdrop-blur-sm p-6"
          style={{ borderRadius: '1rem' }}
        >
          <Tabs value={userType} onValueChange={(value) => setUserType(value as UserType)}>
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50">
              <TabsTrigger
                value="client"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground tracking-wider uppercase text-xs"
              >
                <User className="h-4 w-4" />
                Cliente
              </TabsTrigger>
              <TabsTrigger
                value="barber"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground tracking-wider uppercase text-xs"
              >
                <Scissors className="h-4 w-4" />
                Barbero
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              {errorMessage && (
                <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}

              <TabsContent value="client" className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="client-name"
                    className="text-card-foreground/80 text-xs tracking-widest uppercase"
                  >
                    Nombre completo
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="client-name"
                      placeholder="Juan Perez"
                      value={clientForm.name}
                      onChange={(event) =>
                        setClientForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      className="pl-10 bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="client-email"
                    className="text-card-foreground/80 text-xs tracking-widest uppercase"
                  >
                    Correo electronico
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="client-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={clientForm.email}
                      onChange={(event) =>
                        setClientForm((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                      className="pl-10 bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="client-phone"
                    className="text-card-foreground/80 text-xs tracking-widest uppercase"
                  >
                    Telefono
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="client-phone"
                      type="tel"
                      placeholder="+ 52 6641234567"
                      value={clientForm.phone}
                      onChange={(event) =>
                        setClientForm((current) => ({
                          ...current,
                          phone: event.target.value,
                        }))
                      }
                      className="pl-10 bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="client-password"
                    className="text-card-foreground/80 text-xs tracking-widest uppercase"
                  >
                    Contrasena
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="client-password"
                      type="password"
                      placeholder="********"
                      value={clientForm.password}
                      onChange={(event) =>
                        setClientForm((current) => ({
                          ...current,
                          password: event.target.value,
                        }))
                      }
                      className="pl-10 bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="client-password-confirm"
                    className="text-card-foreground/80 text-xs tracking-widest uppercase"
                  >
                    Confirmar contrasena
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="client-password-confirm"
                      type="password"
                      placeholder="********"
                      value={clientForm.passwordConfirm}
                      onChange={(event) =>
                        setClientForm((current) => ({
                          ...current,
                          passwordConfirm: event.target.value,
                        }))
                      }
                      className="pl-10 bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="barber" className="space-y-4">
                <PhotoUpload
                  value={barberForm.photo}
                  onChange={(photo) =>
                    setBarberForm((current) => ({
                      ...current,
                      photo,
                    }))
                  }
                  onError={setPhotoError}
                  disabled={isSubmitting}
                />
                {photoError && (
                  <p className="text-center text-sm text-destructive">{photoError}</p>
                )}

                <div className="space-y-2">
                  <Label
                    htmlFor="barber-name"
                    className="text-card-foreground/80 text-xs tracking-widest uppercase"
                  >
                    Nombre profesional
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="barber-name"
                      placeholder="Tu nombre"
                      value={barberForm.name}
                      onChange={(event) =>
                        setBarberForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      className="pl-10 bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="barber-email"
                    className="text-card-foreground/80 text-xs tracking-widest uppercase"
                  >
                    Correo electronico
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="barber-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={barberForm.email}
                      onChange={(event) =>
                        setBarberForm((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                      className="pl-10 bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="barber-phone"
                    className="text-card-foreground/80 text-xs tracking-widest uppercase"
                  >
                    Telefono de contacto
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="barber-phone"
                      type="tel"
                      placeholder="+ 52 6641234567"
                      value={barberForm.phone}
                      onChange={(event) =>
                        setBarberForm((current) => ({
                          ...current,
                          phone: event.target.value,
                        }))
                      }
                      className="pl-10 bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="barber-location"
                    className="text-card-foreground/80 text-xs tracking-widest uppercase"
                  >
                    Direccion de la barberia
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="barber-location"
                      placeholder="Calle Principal 123, Tijuana"
                      value={barberForm.location}
                      onChange={(event) =>
                        setBarberForm((current) => ({
                          ...current,
                          location: event.target.value,
                          latitude: null,
                          longitude: null,
                          locationConfirmed: false,
                        }))
                      }
                      className="pl-10 bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => setIsLocationPickerOpen(true)}
                    >
                      <MapPin className="h-3.5 w-3.5 mr-1.5" />
                      Confirmar en mapa
                    </Button>
                    {barberForm.locationConfirmed && (
                      <span className="text-xs text-green-700 dark:text-green-400">
                        Ubicacion confirmada en el mapa
                      </span>
                    )}
                  </div>
                </div>

                <LocationPickerDialog
                  open={isLocationPickerOpen}
                  onOpenChange={setIsLocationPickerOpen}
                  address={barberForm.location}
                  latitude={barberForm.latitude}
                  longitude={barberForm.longitude}
                  onConfirm={({ latitude, longitude, address }) =>
                    setBarberForm((current) => ({
                      ...current,
                      location: address,
                      latitude,
                      longitude,
                      locationConfirmed: true,
                    }))
                  }
                />

                <div className="space-y-2">
                  <Label
                    htmlFor="barber-specialties"
                    className="text-card-foreground/80 text-xs tracking-widest uppercase"
                  >
                    Especialidades
                  </Label>
                  <Input
                    id="barber-specialties"
                    placeholder="Fade, Barba, Disenos (separar por comas)"
                    value={barberForm.specialties}
                    onChange={(event) =>
                      setBarberForm((current) => ({
                        ...current,
                        specialties: event.target.value,
                      }))
                    }
                    className="bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="barber-bio"
                    className="text-card-foreground/80 text-xs tracking-widest uppercase"
                  >
                    Descripcion profesional
                  </Label>
                  <Textarea
                    id="barber-bio"
                    placeholder="Cuentanos sobre tu experiencia..."
                    rows={3}
                    value={barberForm.bio}
                    onChange={(event) =>
                      setBarberForm((current) => ({
                        ...current,
                        bio: event.target.value,
                      }))
                    }
                    className="bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="barber-experience"
                      className="text-card-foreground/80 text-xs tracking-widest uppercase"
                    >
                      Anos de exp.
                    </Label>
                    <Input
                      id="barber-experience"
                      type="number"
                      placeholder="5"
                      min="0"
                      value={barberForm.yearsExperience}
                      onChange={(event) =>
                        setBarberForm((current) => ({
                          ...current,
                          yearsExperience: event.target.value,
                        }))
                      }
                      className="bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="barber-price"
                      className="text-card-foreground/80 text-xs tracking-widest uppercase"
                    >
                      Rango de precios
                    </Label>
                    <Input
                      id="barber-price"
                      placeholder="200 - 300 MXN"
                      value={barberForm.priceRange}
                      onChange={(event) =>
                        setBarberForm((current) => ({
                          ...current,
                          priceRange: event.target.value,
                        }))
                      }
                      className="bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="barber-password"
                    className="text-card-foreground/80 text-xs tracking-widest uppercase"
                  >
                    Contrasena
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="barber-password"
                      type="password"
                      placeholder="********"
                      value={barberForm.password}
                      onChange={(event) =>
                        setBarberForm((current) => ({
                          ...current,
                          password: event.target.value,
                        }))
                      }
                      className="pl-10 bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="barber-password-confirm"
                    className="text-card-foreground/80 text-xs tracking-widest uppercase"
                  >
                    Confirmar contrasena
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="barber-password-confirm"
                      type="password"
                      placeholder="********"
                      value={barberForm.passwordConfirm}
                      onChange={(event) =>
                        setBarberForm((current) => ({
                          ...current,
                          passwordConfirm: event.target.value,
                        }))
                      }
                      className="pl-10 bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              </TabsContent>

              <Button
                type="submit"
                className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground tracking-widest uppercase text-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
            </form>
          </Tabs>

          <div className="mt-6 pt-6 border-t border-foreground/20 text-center">
            <p className="text-foreground/60 text-sm">Ya tienes una cuenta?</p>
            <Link
              href="/"
              className="inline-block mt-2 text-foreground font-sans tracking-widest uppercase text-sm hover:text-accent transition-colors"
            >
              Iniciar Sesion
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-8 text-foreground/40 text-xs tracking-widest">
          <span>EST</span>
          <div className="w-8 h-8 rounded-full border border-foreground/30 flex items-center justify-center">
            <span className="font-serif text-xs">BA</span>
          </div>
          <span>2024</span>
        </div>
      </div>
    </div>
  )
}
