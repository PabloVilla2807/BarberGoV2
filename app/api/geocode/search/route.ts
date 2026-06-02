import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()

  if (!q) {
    return NextResponse.json({ message: 'q es obligatorio.' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'BarberGo/1.0 (barber registration)',
        },
      },
    )

    if (!response.ok) {
      throw new Error('Search geocode failed')
    }

    const data = (await response.json()) as Array<{
      lat: string
      lon: string
      display_name?: string
    }>

    const hit = data[0]
    if (!hit) {
      return NextResponse.json({ data: null })
    }

    return NextResponse.json({
      data: {
        latitude: Number(hit.lat),
        longitude: Number(hit.lon),
        displayName: hit.display_name?.trim() || q,
      },
    })
  } catch {
    return NextResponse.json(
      { message: 'No se pudo buscar la direccion.' },
      { status: 502 },
    )
  }
}
