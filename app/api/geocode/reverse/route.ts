import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  if (!lat || !lon) {
    return NextResponse.json({ message: 'lat y lon son obligatorios.' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'BarberGo/1.0 (barber registration)',
        },
      },
    )

    if (!response.ok) {
      throw new Error('Reverse geocode failed')
    }

    const data = (await response.json()) as { display_name?: string }
    return NextResponse.json({ data: { displayName: data.display_name?.trim() || null } })
  } catch {
    return NextResponse.json(
      { message: 'No se pudo obtener la direccion.' },
      { status: 502 },
    )
  }
}
