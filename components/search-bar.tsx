'use client'

import { Search, MapPin, Scissors } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cities } from '@/lib/mock-data'

interface SearchBarProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCity: string
  setSelectedCity: (city: string) => void
}

export function SearchBar({
  searchTerm,
  setSearchTerm,
  selectedCity,
  setSelectedCity,
}: SearchBarProps) {
  return (
    <div className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Logo */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full border-2 border-card-foreground/60 flex items-center justify-center">
                <Scissors className="h-4 w-4 text-card-foreground" />
              </div>
              <div>
                <span className="font-serif text-lg text-card-foreground tracking-wide block leading-tight">BARBER</span>
                <span className="font-sans text-[10px] text-card-foreground/70 tracking-[0.2em] uppercase">App</span>
              </div>
            </div>
          </div>
          
          {/* Search */}
          <div className="flex flex-1 gap-3 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar barbero..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input/50 border-border text-card-foreground placeholder:text-muted-foreground"
              />
            </div>
            
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[180px] bg-input/50 border-border text-card-foreground">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Ubicacion" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">Todas las ciudades</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 w-full md:w-auto">
            <Button 
              variant="outline" 
              className="flex-1 md:flex-none border-card-foreground/30 text-card-foreground hover:bg-card-foreground/10 tracking-wider uppercase text-xs" 
              asChild
            >
              <a href="/registro">Registrarse</a>
            </Button>
            <Button 
              className="flex-1 md:flex-none bg-primary text-primary-foreground hover:bg-primary/90 tracking-wider uppercase text-xs" 
              asChild
            >
              <a href="/">Salir</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
