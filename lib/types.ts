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
  createdAt: string
}

export type UserType = 'client' | 'barber'

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled'

export interface Appointment {
  id: string
  barberId: string
  barberName: string
  barberLocation: string
  date: string
  time: string
  createdAt: string
  status: AppointmentStatus
  clientId?: string
  clientName?: string
  clientEmail?: string
}
