import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { cities as mockCities } from '@/lib/mock-data'

interface CityDocument {
  name: string
}

export async function GET() {
  try {
    const db = await getDatabase()
    const collection = db.collection<CityDocument>('cities')
    const cities = await collection
      .find({}, { projection: { _id: 0, name: 1 } })
      .sort({ name: 1 })
      .toArray()

    if (cities.length === 0) {
      const seed = mockCities.map((name) => ({ name }))
      await collection.insertMany(seed)
      return NextResponse.json({ data: mockCities })
    }

    return NextResponse.json({ data: cities.map((city) => city.name) })
  } catch (error) {
    console.error('Failed to fetch cities from MongoDB Atlas:', error)
    return NextResponse.json(
      { message: 'No se pudieron consultar las ciudades.' },
      { status: 500 },
    )
  }
}
