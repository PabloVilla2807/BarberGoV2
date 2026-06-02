'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Coordinates } from '@/lib/geo'

export type LocationStatus =
  | 'idle'
  | 'loading'
  | 'granted'
  | 'denied'
  | 'unsupported'

export function useUserLocation(requestOnMount = true) {
  const [location, setLocation] = useState<Coordinates | null>(null)
  const [status, setStatus] = useState<LocationStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const requestLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setStatus('unsupported')
      setErrorMessage('Tu navegador no soporta geolocalizacion.')
      return
    }

    setStatus('loading')
    setErrorMessage(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setStatus('granted')
      },
      (error) => {
        setStatus('denied')
        setErrorMessage(
          error.code === error.PERMISSION_DENIED
            ? 'Permiso de ubicacion denegado.'
            : 'No se pudo obtener tu ubicacion.',
        )
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5 * 60 * 1000,
      },
    )
  }, [])

  useEffect(() => {
    if (requestOnMount) {
      requestLocation()
    }
  }, [requestOnMount, requestLocation])

  return { location, status, errorMessage, requestLocation }
}
