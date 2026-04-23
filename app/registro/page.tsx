'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, User, Scissors, Mail, Lock, Phone, MapPin, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import type { UserType } from '@/lib/types'

export default function RegistroPage() {
  const [userType, setUserType] = useState<UserType>('client')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    alert(`Registro exitoso como ${userType === 'client' ? 'cliente' : 'barbero'}!`)
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-lg mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-6 transition-colors text-sm tracking-wider uppercase"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="h-px w-10 bg-foreground/30" />
            <div className="w-14 h-14 rounded-full border-2 border-foreground/60 flex items-center justify-center">
              <Scissors className="h-6 w-6 text-foreground" />
            </div>
            <div className="h-px w-10 bg-foreground/30" />
          </div>
          
          <h1 className="font-serif text-3xl font-bold text-foreground tracking-wide mb-2">
            CREAR CUENTA
          </h1>
          <p className="text-foreground/60 text-sm tracking-widest uppercase">
            Unete a nuestra comunidad
          </p>
        </div>

        {/* Form Card */}
        <div className="border border-foreground/20 bg-card/30 backdrop-blur-sm p-6">
          <Tabs value={userType} onValueChange={(v) => setUserType(v as UserType)}>
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50">
              <TabsTrigger 
                value="client" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground tracking-wider uppercase text-xs"
              >
                <User className="h-4 w-4" />
                Cliente
              </TabsTrigger>
              <TabsTrigger 
                value="barber" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground tracking-wider uppercase text-xs"
              >
                <Scissors className="h-4 w-4" />
                Barbero
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="client" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client-name" className="text-card-foreground/80 text-xs tracking-widest uppercase">
                    Nombre completo
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="client-name"
                      placeholder="Juan Perez"
                      className="pl-10 bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-email" className="text-card-foreground/80 text-xs tracking-widest uppercase">
                    Correo electronico
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="client-email"
                      type="email"
                      placeholder="tu@email.com"
                      className="pl-10 bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-phone" className="text-card-foreground/80 text-xs tracking-widest uppercase">
                    Telefono
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="client-phone"
                      type="tel"
                      placeholder="+34 612 345 678"
                      className="pl-10 bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-password" className="text-card-foreground/80 text-xs tracking-widest uppercase">
                    Contrasena
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="client-password"
                      type="password"
                      placeholder="********"
                      className="pl-10 bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-password-confirm" className="text-card-foreground/80 text-xs tracking-widest uppercase">
                    Confirmar contrasena
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="client-password-confirm"
                      type="password"
                      placeholder="********"
                      className="pl-10 bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="barber" className="space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 bg-secondary/50 border-2 border-dashed border-foreground/30 rounded-full flex items-center justify-center cursor-pointer hover:border-foreground/50 transition-colors">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barber-name" className="text-card-foreground/80 text-xs tracking-widest uppercase">
                    Nombre profesional
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="barber-name"
                      placeholder="Tu nombre"
                      className="pl-10 bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barber-email" className="text-card-foreground/80 text-xs tracking-widest uppercase">
                    Correo electronico
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="barber-email"
                      type="email"
                      placeholder="tu@email.com"
                      className="pl-10 bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barber-phone" className="text-card-foreground/80 text-xs tracking-widest uppercase">
                    Telefono de contacto
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="barber-phone"
                      type="tel"
                      placeholder="+34 612 345 678"
                      className="pl-10 bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barber-location" className="text-card-foreground/80 text-xs tracking-widest uppercase">
                    Direccion de la barberia
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="barber-location"
                      placeholder="Calle Principal 123, Madrid"
                      className="pl-10 bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barber-specialties" className="text-card-foreground/80 text-xs tracking-widest uppercase">
                    Especialidades
                  </Label>
                  <Input
                    id="barber-specialties"
                    placeholder="Fade, Barba, Disenos (separar por comas)"
                    className="bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barber-bio" className="text-card-foreground/80 text-xs tracking-widest uppercase">
                    Descripcion profesional
                  </Label>
                  <Textarea
                    id="barber-bio"
                    placeholder="Cuentanos sobre tu experiencia..."
                    rows={3}
                    className="bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="barber-experience" className="text-card-foreground/80 text-xs tracking-widest uppercase">
                      Anos de exp.
                    </Label>
                    <Input
                      id="barber-experience"
                      type="number"
                      placeholder="5"
                      min="0"
                      className="bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barber-price" className="text-card-foreground/80 text-xs tracking-widest uppercase">
                      Rango de precios
                    </Label>
                    <Input
                      id="barber-price"
                      placeholder="15 - 35 EUR"
                      className="bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barber-password" className="text-card-foreground/80 text-xs tracking-widest uppercase">
                    Contrasena
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="barber-password"
                      type="password"
                      placeholder="********"
                      className="pl-10 bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barber-password-confirm" className="text-card-foreground/80 text-xs tracking-widest uppercase">
                    Confirmar contrasena
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="barber-password-confirm"
                      type="password"
                      placeholder="********"
                      className="pl-10 bg-input/50 border-foreground/30 text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>
              </TabsContent>

              <Button
                type="submit"
                className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground tracking-widest uppercase text-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
            </form>
          </Tabs>

          <div className="mt-6 pt-6 border-t border-foreground/20 text-center">
            <p className="text-foreground/60 text-sm">
              Ya tienes una cuenta?
            </p>
            <Link 
              href="/" 
              className="inline-block mt-2 text-foreground font-sans tracking-widest uppercase text-sm hover:text-accent transition-colors"
            >
              Iniciar Sesion
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
  )
}
