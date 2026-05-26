import { z } from 'zod'
import { getDatabase } from '@/lib/mongodb'

export const DEFAULT_BARBER_PHOTO =
  'https://images.unsplash.com/photo-1503951914875-452162b0f3d1?w=400&h=400&fit=crop&crop=face'

const passwordSchema = z
  .string()
  .min(8, 'La contrasena debe tener al menos 8 caracteres.')

export const clientRegistrationSchema = z
  .object({
    name: z.string().trim().min(1, 'El nombre es obligatorio.'),
    email: z.string().trim().email('Correo electronico invalido.'),
    phone: z.string().trim().min(1, 'El telefono es obligatorio.'),
    password: passwordSchema,
    passwordConfirm: passwordSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Las contrasenas no coinciden.',
    path: ['passwordConfirm'],
  })

export const barberRegistrationSchema = z
  .object({
    name: z.string().trim().min(1, 'El nombre es obligatorio.'),
    email: z.string().trim().email('Correo electronico invalido.'),
    phone: z.string().trim().min(1, 'El telefono es obligatorio.'),
    location: z.string().trim().min(1, 'La direccion es obligatoria.'),
    specialties: z.string().trim().min(1, 'Las especialidades son obligatorias.'),
    bio: z.string().trim().optional(),
    yearsExperience: z.coerce
      .number()
      .int('Los anos de experiencia deben ser un numero entero.')
      .min(0, 'Los anos de experiencia no pueden ser negativos.'),
    priceRange: z.string().trim().min(1, 'El rango de precios es obligatorio.'),
    password: passwordSchema,
    passwordConfirm: passwordSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Las contrasenas no coinciden.',
    path: ['passwordConfirm'],
  })

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function parseSpecialties(value: string) {
  return value
    .split(',')
    .map((specialty) => specialty.trim())
    .filter(Boolean)
}

export function extractCityFromLocation(location: string) {
  const parts = location
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

  return parts.length > 1 ? parts[parts.length - 1] : parts[0] || 'Sin ciudad'
}

export async function isEmailRegistered(email: string) {
  const normalizedEmail = normalizeEmail(email)
  const db = await getDatabase()

  const [existingClient, existingBarber] = await Promise.all([
    db.collection('clients').findOne({ email: normalizedEmail }),
    db.collection('barbers').findOne({ email: normalizedEmail }),
  ])

  return Boolean(existingClient || existingBarber)
}
