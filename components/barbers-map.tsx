'use client'

import dynamic from 'next/dynamic'
import { Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Barber } from '@/lib/types'
import type { Coordinates } from '@/lib/geo'
import type { LocationStatus } from '@/hooks/use-user-location'

const BarbersMapLeaflet = dynamic(
  () =>
    import('@/components/barbers-map-leaflet').then((mod) => mod.BarbersMapLeaflet),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[320px] items-center justify-center bg-muted/30 text-sm text-muted-foreground">
        Cargando mapa...
      </div>
    ),
  },
)

interface BarbersMapProps {
  barbers: Barber[]
  userLocation: Coordinates | null
  locationStatus: LocationStatus
  onRequestLocation: () => void
}

export function BarbersMap({
  barbers,
  userLocation,
  locationStatus,
  onRequestLocation,
}: BarbersMapProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl text-foreground tracking-wide">
            Mapa de barberos
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {userLocation
              ? 'Tu ubicacion y los barberos disponibles (OpenStreetMap).'
              : 'Activa tu ubicacion para verte en el mapa junto a los barberos.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white shadow" />
            Tu ubicacion
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-red-600 ring-2 ring-white shadow" />
            Barbero
          </span>
        </div>
      </div>

      {(locationStatus === 'denied' || locationStatus === 'unsupported') && (
        <div className="flex flex-wrap items-center gap-3 rounded-md border border-border bg-muted/40 px-4 py-3 text-sm">
          <Navigation className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="text-muted-foreground flex-1">
            Permite el acceso a tu ubicacion para mostrarte en el mapa.
          </span>
          {locationStatus === 'denied' && (
            <Button type="button" variant="outline" size="sm" onClick={onRequestLocation}>
              Activar ubicacion
            </Button>
          )}
        </div>
      )}

      <div className="relative h-[min(420px,55vh)] w-full overflow-hidden rounded-xl border border-border shadow-sm [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full">
        <BarbersMapLeaflet barbers={barbers} userLocation={userLocation} />

        {barbers.length === 0 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1000] bg-gradient-to-t from-background/90 to-transparent px-4 pb-4 pt-10">
            <p className="text-center text-sm text-muted-foreground">
              No hay barberos con ubicacion para mostrar en el mapa.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
