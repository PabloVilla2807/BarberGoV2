import type { Barber } from '@/lib/types'

export interface Coordinates {
  latitude: number
  longitude: number
}

/** Centros aproximados de ciudades de la app (fallback si el barbero no tiene lat/lng). */
export const CITY_COORDINATES: Record<string, Coordinates> = {
  Tijuana: { latitude: 32.5149, longitude: -117.0382 },
  Mexicali: { latitude: 32.6245, longitude: -115.4523 },
  Ensenada: { latitude: 31.8667, longitude: -116.5967 },
  Tepic: { latitude: 21.5085, longitude: -104.8936 },
  'La Paz': { latitude: 24.1426, longitude: -110.3128 },
  Mazatlán: { latitude: 23.2494, longitude: -106.4111 },
}

const EARTH_RADIUS_KM = 6371

export function haversineDistance(from: Coordinates, to: Coordinates) {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(to.latitude - from.latitude)
  const dLon = toRad(to.longitude - from.longitude)
  const lat1 = toRad(from.latitude)
  const lat2 = toRad(to.latitude)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function getCityCoordinates(city: string): Coordinates | null {
  const normalized = city.trim()
  const exact = CITY_COORDINATES[normalized]
  if (exact) return exact

  const match = Object.entries(CITY_COORDINATES).find(
    ([name]) => name.toLowerCase() === normalized.toLowerCase(),
  )
  return match ? match[1] : null
}

export function getBarberCoordinates(barber: Barber): Coordinates | null {
  if (
    typeof barber.latitude === 'number' &&
    typeof barber.longitude === 'number'
  ) {
    return { latitude: barber.latitude, longitude: barber.longitude }
  }
  return getCityCoordinates(barber.city)
}

export function computeBarberDistanceKm(
  user: Coordinates,
  barber: Barber,
): number | null {
  const coords = getBarberCoordinates(barber)
  if (!coords) return null
  return Math.round(haversineDistance(user, coords) * 10) / 10
}

export function formatDistanceKm(km: number) {
  return km < 1 ? `${Math.round(km * 10) / 10} km` : `${km} km`
}
