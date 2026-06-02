'use client'

import { useEffect, useMemo, useState } from 'react'
import { SearchBar } from '@/components/search-bar'
import { BarberList } from '@/components/barber-list'
import { BarbersMap } from '@/components/barbers-map'
import { AppointmentsList } from '@/components/appointments-list'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Scissors, Users, Star, MapPin, Navigation } from 'lucide-react'
import type { Appointment, Barber } from '@/lib/types'
import { useUserLocation } from '@/hooks/use-user-location'
import { computeBarberDistanceKm } from '@/lib/geo'

export default function BarberosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState('all')
  const [activeTab, setActiveTab] = useState('barbers')
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const {
    location: userLocation,
    status: locationStatus,
    errorMessage: locationError,
    requestLocation,
  } = useUserLocation()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true)
      setErrorMessage('')

      try {
        const [barbersResponse, citiesResponse, appointmentsResponse] =
          await Promise.all([
            fetch('/api/barbers', { cache: 'no-store' }),
            fetch('/api/cities', { cache: 'no-store' }),
            fetch('/api/appointments', { cache: 'no-store' }),
          ])

        if (
          !barbersResponse.ok ||
          !citiesResponse.ok ||
          !appointmentsResponse.ok
        ) {
          throw new Error('Error while reading API data')
        }

        const barbersPayload = (await barbersResponse.json()) as { data: Barber[] }
        const citiesPayload = (await citiesResponse.json()) as { data: string[] }
        const appointmentsPayload = (await appointmentsResponse.json()) as {
          data: Appointment[]
        }

        setBarbers(barbersPayload.data)
        setCities(citiesPayload.data)
        setAppointments(appointmentsPayload.data)
      } catch {
        setErrorMessage(
          'No se pudo conectar con MongoDB Atlas. Verifica MONGODB_URI y MONGODB_DB.',
        )
      } finally {
        setIsLoadingData(false)
      }
    }

    void fetchData()
  }, [])

  const filteredBarbers = useMemo(() => {
    const filtered = barbers.filter((barber) => {
      const matchesSearch = barber.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesCity =
        selectedCity === 'all' || barber.city === selectedCity
      return matchesSearch && matchesCity
    })

    const withDistance = filtered.map((barber) => {
      if (!userLocation) {
        return barber
      }
      const km = computeBarberDistanceKm(userLocation, barber)
      if (km === null) {
        return barber
      }
      return { ...barber, distance: km }
    })

    return withDistance.sort((a, b) => {
      const left = a.distance ?? Number.POSITIVE_INFINITY
      const right = b.distance ?? Number.POSITIVE_INFINITY
      return left - right
    })
  }, [barbers, searchTerm, selectedCity, userLocation])

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      const left = new Date(`${a.date}T${a.time}:00`).getTime()
      const right = new Date(`${b.date}T${b.time}:00`).getTime()
      return left - right
    })
  }, [appointments])

  const handleCreateAppointment = async (appointment: Appointment) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment),
      })

      if (!response.ok) {
        throw new Error('Failed to create appointment')
      }

      const payload = (await response.json()) as { data: Appointment }
      setAppointments((current) => [...current, payload.data])
      setActiveTab('appointments')
    } catch {
      setErrorMessage('No se pudo guardar la cita en MongoDB Atlas.')
    }
  }

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete appointment')
      }

      setAppointments((current) =>
        current.filter((appointment) => appointment.id !== appointmentId),
      )
    } catch {
      setErrorMessage('No se pudo cancelar la cita en MongoDB Atlas.')
    }
  }

  const isFiltered = searchTerm !== '' || selectedCity !== 'all'

  return (
    <div className="min-h-screen bg-background">
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        cities={cities}
      />

      {/* Hero Section */}
      <section className="bg-secondary py-16 px-4 border-b border-border">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="h-px w-12 bg-secondary-foreground/30" />
            <Scissors className="h-5 w-5 text-secondary-foreground/60" />
            <div className="h-px w-12 bg-secondary-foreground/30" />
          </div>
          
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-2 text-secondary-foreground tracking-wide">
            ENCUENTRA TU
          </h1>
          <h2 className="font-sans text-xl md:text-2xl tracking-[0.3em] text-secondary-foreground/80 uppercase mb-6">
            Barbero Ideal
          </h2>
          <p className="text-secondary-foreground/60 text-sm tracking-widest uppercase max-w-xl mx-auto mb-10">
            &ldquo;Descubre los mejores profesionales de tu zona&rdquo;
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm text-secondary-foreground/70">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full border border-secondary-foreground/30 flex items-center justify-center">
                <Scissors className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="block font-serif text-lg text-secondary-foreground">+500</span>
                <span className="text-xs tracking-widest uppercase">Barberos</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full border border-secondary-foreground/30 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="block font-serif text-lg text-secondary-foreground">+10K</span>
                <span className="text-xs tracking-widest uppercase">Clientes</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full border border-secondary-foreground/30 flex items-center justify-center">
                <Star className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="block font-serif text-lg text-secondary-foreground">4.8</span>
                <span className="text-xs tracking-widest uppercase">Rating</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full border border-secondary-foreground/30 flex items-center justify-center">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="block font-serif text-lg text-secondary-foreground">6</span>
                <span className="text-xs tracking-widest uppercase">Ciudades</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8 border-b border-border">
        <BarbersMap
          barbers={filteredBarbers}
          userLocation={userLocation}
          locationStatus={locationStatus}
          onRequestLocation={requestLocation}
        />
      </section>

      {/* Barbers Section */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {errorMessage && (
          <div className="mb-6 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </div>
        )}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 h-11 bg-secondary/60">
            <TabsTrigger
              value="barbers"
              className="px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Barberos
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              className="px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Mis Citas ({appointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="barbers">
            {isLoadingData && (
              <p className="text-sm text-muted-foreground mb-4">Cargando datos desde MongoDB...</p>
            )}

            {locationStatus === 'loading' && (
              <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                <Navigation className="h-4 w-4 animate-pulse" />
                Obteniendo tu ubicacion para ordenar barberos cercanos...
              </p>
            )}
            {locationStatus === 'granted' && userLocation && (
              <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Mostrando barberos ordenados por cercania a tu ubicacion.
              </p>
            )}
            {(locationStatus === 'denied' || locationStatus === 'unsupported') && (
              <div className="mb-4 flex flex-wrap items-center gap-3 rounded-md border border-border bg-muted/40 px-4 py-3 text-sm">
                <span className="text-muted-foreground">
                  {locationError ||
                    'Activa la ubicacion para ver primero a los barberos mas cercanos.'}
                </span>
                {locationStatus === 'denied' && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={requestLocation}
                  >
                    Usar mi ubicacion
                  </Button>
                )}
              </div>
            )}

            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground tracking-wide">
                  {isFiltered ? 'Resultados' : 'Barberos Destacados'}
                </h2>
                <p className="text-muted-foreground text-sm tracking-wide mt-1">
                  {filteredBarbers.length} barbero{filteredBarbers.length !== 1 && 's'}{' '}
                  {isFiltered ? 'encontrado' : 'disponible'}
                  {filteredBarbers.length !== 1 && 's'}
                  {selectedCity !== 'all' && ` en ${selectedCity}`}
                </p>
              </div>
            </div>

            <BarberList
              barbers={filteredBarbers}
              isFiltered={isFiltered}
              appointments={appointments}
              onCreateAppointment={handleCreateAppointment}
            />
          </TabsContent>

          <TabsContent value="appointments">
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-foreground tracking-wide">
                Citas Creadas
              </h2>
              <p className="text-muted-foreground text-sm tracking-wide mt-1">
                Administra tus reservaciones y horarios confirmados.
              </p>
            </div>

            <AppointmentsList
              appointments={sortedAppointments}
              onCancelAppointment={handleCancelAppointment}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="h-px w-8 bg-secondary-foreground/30" />
              <div className="w-12 h-12 rounded-full border border-secondary-foreground/40 flex items-center justify-center">
                <span className="font-serif text-secondary-foreground text-sm">BA</span>
              </div>
              <div className="h-px w-8 bg-secondary-foreground/30" />
            </div>
            <h3 className="font-serif text-xl text-secondary-foreground tracking-wide">BARBER GO</h3>
            <p className="text-secondary-foreground/50 text-xs tracking-widest uppercase">
              Tu corte, nuestra experiencia
            </p>
            <p className="text-secondary-foreground/40 text-xs tracking-widest mt-4">
              EST 2024
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
