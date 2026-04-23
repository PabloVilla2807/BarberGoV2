export interface Barber {
  id: string
  name: string
  photo: string
  rating: number
  reviewCount: number
  specialties: string[]
  location: string
  city: string
  distance?: number
  priceRange: string
  yearsExperience: number
  bio: string
  availability: string
  phone: string
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
}

export type UserType = 'client' | 'barber'
