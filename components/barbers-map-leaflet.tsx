'use client'

import { useEffect, useMemo } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Barber } from '@/lib/types'
import type { Coordinates } from '@/lib/geo'
import { CITY_COORDINATES, getBarberCoordinates } from '@/lib/geo'

const DEFAULT_CENTER: [number, number] = [
  CITY_COORDINATES.Tijuana.latitude,
  CITY_COORDINATES.Tijuana.longitude,
]

interface BarberMapMarker {
  id: string
  name: string
  position: [number, number]
  distance?: number
}

export interface BarbersMapLeafletProps {
  barbers: Barber[]
  userLocation: Coordinates | null
}

function toLatLng(coords: Coordinates): [number, number] {
  return [coords.latitude, coords.longitude]
}

const userIcon = L.divIcon({
  className: '',
  html: '<div style="background:#3b82f6;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.35)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

const barberIcon = L.divIcon({
  className: '',
  html: '<div style="background:#dc2626;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.35)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

function FitMapBounds({
  userLocation,
  barberMarkers,
}: {
  userLocation: Coordinates | null
  barberMarkers: BarberMapMarker[]
}) {
  const map = useMap()

  useEffect(() => {
    const points: [number, number][] = []
    if (userLocation) points.push(toLatLng(userLocation))
    barberMarkers.forEach((marker) => points.push(marker.position))

    if (points.length === 0) return

    if (points.length === 1) {
      map.setView(points[0], 14)
      return
    }

    map.fitBounds(L.latLngBounds(points), { padding: [48, 48] })
  }, [map, userLocation, barberMarkers])

  return null
}

export function BarbersMapLeaflet({
  barbers,
  userLocation,
}: BarbersMapLeafletProps) {
  const barberMarkers = useMemo(() => {
    return barbers
      .map((barber): BarberMapMarker | null => {
        const coords = getBarberCoordinates(barber)
        if (!coords) return null
        return {
          id: barber.id,
          name: barber.name,
          position: toLatLng(coords),
          distance: barber.distance,
        }
      })
      .filter((marker): marker is BarberMapMarker => marker !== null)
  }, [barbers])

  const mapCenter = userLocation
    ? toLatLng(userLocation)
    : barberMarkers[0]?.position ?? DEFAULT_CENTER

  return (
    <MapContainer
      center={mapCenter}
      zoom={12}
      scrollWheelZoom
      className="h-full w-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitMapBounds userLocation={userLocation} barberMarkers={barberMarkers} />

      {userLocation && (
        <Marker position={toLatLng(userLocation)} icon={userIcon}>
          <Popup>Tu ubicacion</Popup>
        </Marker>
      )}

      {barberMarkers.map((marker) => (
        <Marker key={marker.id} position={marker.position} icon={barberIcon}>
          <Popup>
            <span className="font-medium">{marker.name}</span>
            {marker.distance !== undefined && (
              <span className="block text-sm text-muted-foreground">
                {marker.distance} km
              </span>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
