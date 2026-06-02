'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Loader2, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { reverseGeocode, searchAddress } from '@/lib/geocode'

const LocationPickerMap = dynamic(
  () =>
    import('@/components/location-picker-map').then((mod) => mod.LocationPickerMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[280px] items-center justify-center bg-muted/30 text-sm text-muted-foreground">
        Cargando mapa...
      </div>
    ),
  },
)

export interface LocationPickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  address: string
  latitude: number | null
  longitude: number | null
  onConfirm: (value: {
    latitude: number
    longitude: number
    address: string
  }) => void
}

export function LocationPickerDialog({
  open,
  onOpenChange,
  address,
  latitude,
  longitude,
  onConfirm,
}: LocationPickerDialogProps) {
  const [draftPosition, setDraftPosition] = useState<[number, number] | null>(
    latitude !== null && longitude !== null ? [latitude, longitude] : null,
  )
  const [draftAddress, setDraftAddress] = useState(address)
  const [isResolving, setIsResolving] = useState(false)

  useEffect(() => {
    if (!open) return

    setDraftAddress(address)
    if (latitude !== null && longitude !== null) {
      setDraftPosition([latitude, longitude])
      return
    }

    let cancelled = false

    const initFromAddress = async () => {
      if (!address.trim()) {
        setDraftPosition(null)
        return
      }

      setIsResolving(true)
      try {
        const result = await searchAddress(address)
        if (cancelled || !result) return
        setDraftPosition([result.latitude, result.longitude])
        setDraftAddress(result.displayName)
      } finally {
        if (!cancelled) setIsResolving(false)
      }
    }

    void initFromAddress()

    return () => {
      cancelled = true
    }
  }, [open, address, latitude, longitude])

  const handlePositionChange = async (lat: number, lng: number) => {
    setDraftPosition([lat, lng])
    setIsResolving(true)
    try {
      const label = await reverseGeocode(lat, lng)
      if (label) {
        setDraftAddress(label)
      }
    } finally {
      setIsResolving(false)
    }
  }

  const handleConfirm = () => {
    if (!draftPosition) return
    onConfirm({
      latitude: draftPosition[0],
      longitude: draftPosition[1],
      address: draftAddress.trim() || address.trim(),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Confirmar ubicacion en el mapa</DialogTitle>
          <DialogDescription>
            Toca el mapa o arrastra el marcador para indicar donde esta tu barberia.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="relative h-[min(320px,50vh)] overflow-hidden rounded-lg border border-border [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full">
            <LocationPickerMap
              position={draftPosition}
              onPositionChange={(lat, lng) => void handlePositionChange(lat, lng)}
            />
            {isResolving && (
              <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/40">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          {draftPosition ? (
            <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Ubicacion seleccionada
              </p>
              <p className="text-foreground">{draftAddress || 'Direccion no disponible'}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {draftPosition[0].toFixed(5)}, {draftPosition[1].toFixed(5)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Selecciona un punto en el mapa para continuar.
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={!draftPosition || isResolving}>
            Confirmar ubicacion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
