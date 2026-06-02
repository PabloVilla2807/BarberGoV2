'use client'

import { useEffect } from 'react'
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import L from 'leaflet'
import { CITY_COORDINATES } from '@/lib/geo'

const DEFAULT_CENTER: [number, number] = [
  CITY_COORDINATES.Tijuana.latitude,
  CITY_COORDINATES.Tijuana.longitude,
]

const pickerIcon = L.divIcon({
  className: '',
  html: '<div style="background:#dc2626;width:16px;height:16px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.4)"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

export interface LocationPickerMapProps {
  position: [number, number] | null
  onPositionChange: (latitude: number, longitude: number) => void
}

function MapClickHandler({
  onPositionChange,
}: {
  onPositionChange: (latitude: number, longitude: number) => void
}) {
  useMapEvents({
    click(event) {
      onPositionChange(event.latlng.lat, event.latlng.lng)
    },
  })
  return null
}

function MapViewSync({ center }: { center: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [map, center])

  return null
}

export function LocationPickerMap({
  position,
  onPositionChange,
}: LocationPickerMapProps) {
  const center = position ?? DEFAULT_CENTER

  return (
    <MapContainer
      center={center}
      zoom={position ? 16 : 12}
      scrollWheelZoom
      className="h-full w-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler onPositionChange={onPositionChange} />
      <MapViewSync center={center} />
      {position && (
        <Marker
          position={position}
          icon={pickerIcon}
          draggable
          eventHandlers={{
            dragend: (event) => {
              const { lat, lng } = event.target.getLatLng()
              onPositionChange(lat, lng)
            },
          }}
        />
      )}
    </MapContainer>
  )
}
