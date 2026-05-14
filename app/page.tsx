'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Scissors } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const body = (await response.json()) as {
        message?: string
        data?: { userType: 'client' | 'barber' }
      }

      if (!response.ok) {
        throw new Error(body.message || 'No se pudo iniciar sesion.')
      }

      const next =
        body.data?.userType === 'barber' ? '/panel-barbero' : '/barberos'
      router.push(next)
      router.refresh()
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo conectar con el servidor.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="text-center pt-12 pb-8 px-4">
        <div className="flex items-center justify-center gap-8 mb-6">
          <div className="h-px w-16 bg-foreground/30" />
          <Scissors className="h-6 w-6 text-foreground/60" />
          <div className="h-px w-16 bg-foreground/30" />
        </div>

        <Image
          src="/barbergologo3.svg"
          alt="BarberGo"
          width={200}
          height={200}
          className="mx-auto h-auto w-40 md:w-100"
          priority
        />
        <p className="text-foreground/60 text-sm tracking-widest uppercase">
          &ldquo;Tu corte, nuestra experiencia&rdquo;
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-sm">
          <div
            className="border border-foreground/20 bg-card/30 backdrop-blur-sm p-8"
            style={{ borderRadius: '1rem' }}
          >
            <h3 className="font-serif text-xl text-center text-card-foreground mb-6 tracking-wide">
              Iniciar Sesion
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-card-foreground/80 text-xs tracking-widest uppercase"
                >
                  Correo Electronico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="pl-10 bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="password"
                    className="text-card-foreground/80 text-xs tracking-widest uppercase"
                  >
                    Contraseña
                  </Label>
                  <Link
                    href="#"
                    className="text-xs text-foreground/60 hover:text-foreground transition-colors"
                  >
                    Olvidaste tu contrasena?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="pl-10 bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-sans tracking-widest uppercase text-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-foreground/20 text-center">
              <p className="text-foreground/60 text-sm">No tienes una cuenta?</p>
              <Link
                href="/registro"
                className="inline-block mt-2 text-foreground font-sans tracking-widest uppercase text-sm hover:text-accent transition-colors"
              >
                Crear Cuenta
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8 text-foreground/40 text-xs tracking-widest">
            <span>EST</span>
            <div className="w-8 h-8 rounded-full border border-foreground/30 flex items-center justify-center">
              <span className="font-serif text-xs">BC</span>
            </div>
            <span>2026</span>
          </div>
        </div>
      </div>
    </div>
  )
}
