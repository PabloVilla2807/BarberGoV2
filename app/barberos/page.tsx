'use client'

import { useState, useMemo } from 'react'
import { SearchBar } from '@/components/search-bar'
import { BarberList } from '@/components/barber-list'
import { barbers } from '@/lib/mock-data'
import { Scissors, Users, Star, MapPin } from 'lucide-react'

export default function BarberosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState('all')

  const filteredBarbers = useMemo(() => {
    return barbers
      .filter((barber) => {
        const matchesSearch = barber.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
        const matchesCity =
          selectedCity === 'all' || barber.city === selectedCity
        return matchesSearch && matchesCity
      })
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
  }, [searchTerm, selectedCity])

  const isFiltered = searchTerm !== '' || selectedCity !== 'all'

  return (
    <div className="min-h-screen bg-background">
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
      />

      {/* Hero Section */}
      <section className="bg-secondary py-16 px-4 border-b border-border">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="h-px w-12 bg-secondary-foreground/30" />
            <Scissors className="h-5 w-5 text-secondary-foreground/60" />
            <div className="h-px w-12 bg-secondary-foreground/30" />
          </div>
          
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-2 text-secondary-foreground tracking-wide">
            ENCUENTRA TU
          </h1>
          <h2 className="font-sans text-xl md:text-2xl tracking-[0.3em] text-secondary-foreground/80 uppercase mb-6">
            Barbero Ideal
          </h2>
          <p className="text-secondary-foreground/60 text-sm tracking-widest uppercase max-w-xl mx-auto mb-10">
            &ldquo;Descubre los mejores profesionales de tu zona&rdquo;
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm text-secondary-foreground/70">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full border border-secondary-foreground/30 flex items-center justify-center">
                <Scissors className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="block font-serif text-lg text-secondary-foreground">+500</span>
                <span className="text-xs tracking-widest uppercase">Barberos</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full border border-secondary-foreground/30 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="block font-serif text-lg text-secondary-foreground">+10K</span>
                <span className="text-xs tracking-widest uppercase">Clientes</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full border border-secondary-foreground/30 flex items-center justify-center">
                <Star className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="block font-serif text-lg text-secondary-foreground">4.8</span>
                <span className="text-xs tracking-widest uppercase">Rating</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full border border-secondary-foreground/30 flex items-center justify-center">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="block font-serif text-lg text-secondary-foreground">6</span>
                <span className="text-xs tracking-widest uppercase">Ciudades</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Barbers Section */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground tracking-wide">
              {isFiltered ? 'Resultados' : 'Barberos Destacados'}
            </h2>
            <p className="text-muted-foreground text-sm tracking-wide mt-1">
              {filteredBarbers.length} barbero{filteredBarbers.length !== 1 && 's'}{' '}
              {isFiltered ? 'encontrado' : 'disponible'}{filteredBarbers.length !== 1 && 's'}
              {selectedCity !== 'all' && ` en ${selectedCity}`}
            </p>
          </div>
        </div>

        <BarberList barbers={filteredBarbers} isFiltered={isFiltered} />
      </main>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="h-px w-8 bg-secondary-foreground/30" />
              <div className="w-12 h-12 rounded-full border border-secondary-foreground/40 flex items-center justify-center">
                <span className="font-serif text-secondary-foreground text-sm">BA</span>
              </div>
              <div className="h-px w-8 bg-secondary-foreground/30" />
            </div>
            <h3 className="font-serif text-xl text-secondary-foreground tracking-wide">BARBER APP</h3>
            <p className="text-secondary-foreground/50 text-xs tracking-widest uppercase">
              Tu corte, nuestra experiencia
            </p>
            <p className="text-secondary-foreground/40 text-xs tracking-widest mt-4">
              EST 2024
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
