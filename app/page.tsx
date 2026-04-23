'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Scissors } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    router.push('/barberos')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header decorativo */}
      <div className="text-center pt-12 pb-8 px-4">
        <div className="flex items-center justify-center gap-8 mb-6">
          <div className="h-px w-16 bg-foreground/30" />
          <Scissors className="h-6 w-6 text-foreground/60" />
          <div className="h-px w-16 bg-foreground/30" />
        </div>
        
        {/* Logo estilo barbershop */}
        <div className="mb-6">
          <div className="w-20 h-28 mx-auto border-2 border-foreground/80 rounded-t-full flex flex-col items-center justify-end pb-2 relative">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-foreground/60" />
            <div className="w-full px-2 space-y-1">
              <div className="h-0.5 bg-foreground/40" />
              <div className="h-0.5 bg-foreground/40" />
              <div className="h-0.5 bg-foreground/40" />
            </div>
          </div>
        </div>

        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-wide text-foreground mb-2">
          BARBER
        </h1>
        <h2 className="font-sans text-xl md:text-2xl tracking-[0.3em] text-foreground/90 uppercase mb-4">
          App
        </h2>
        <p className="text-foreground/60 text-sm tracking-widest uppercase">
          &ldquo;Tu corte, nuestra experiencia&rdquo;
        </p>
      </div>

      {/* Formulario */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-sm">
          <div className="border border-foreground/20 bg-card/30 backdrop-blur-sm p-8">
            <h3 className="font-serif text-xl text-center text-card-foreground mb-6 tracking-wide">
              Iniciar Sesion
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-card-foreground/80 text-xs tracking-widest uppercase">
                  Correo Electronico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-10 bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-card-foreground/80 text-xs tracking-widest uppercase">
                    Contrasena
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
              <p className="text-foreground/60 text-sm">
                No tienes una cuenta?
              </p>
              <Link 
                href="/registro" 
                className="inline-block mt-2 text-foreground font-sans tracking-widest uppercase text-sm hover:text-accent transition-colors"
              >
                Crear Cuenta
              </Link>
            </div>
          </div>

          {/* Footer decorativo */}
          <div className="flex items-center justify-center gap-4 mt-8 text-foreground/40 text-xs tracking-widest">
            <span>EST</span>
            <div className="w-8 h-8 rounded-full border border-foreground/30 flex items-center justify-center">
              <span className="font-serif text-xs">BA</span>
            </div>
            <span>2024</span>
          </div>
        </div>
      </div>
    </div>
  )
}
