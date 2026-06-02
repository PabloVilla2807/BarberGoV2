export async function reverseGeocode(latitude: number, longitude: number) {
  const response = await fetch(
    `/api/geocode/reverse?lat=${latitude}&lon=${longitude}`,
  )
  if (!response.ok) return null
  const payload = (await response.json()) as {
    data?: { displayName: string | null }
  }
  return payload.data?.displayName ?? null
}

export async function searchAddress(address: string) {
  const query = address.trim()
  if (!query) return null

  const response = await fetch(`/api/geocode/search?q=${encodeURIComponent(query)}`)
  if (!response.ok) return null
  const payload = (await response.json()) as {
    data?: {
      latitude: number
      longitude: number
      displayName: string
    } | null
  }
  return payload.data ?? null
}
