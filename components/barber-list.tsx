'use client'

import { BarberCard } from './barber-card'
import type { Barber } from '@/lib/types'
import { Scissors } from 'lucide-react'

interface BarberListProps {
  barbers: Barber[]
  isFiltered: boolean
}

export function BarberList({ barbers, isFiltered }: BarberListProps) {
  if (barbers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Scissors className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No se encontraron barberos
        </h3>
        <p className="text-muted-foreground text-center max-w-md">
          {isFiltered
            ? 'Intenta ajustar los filtros de búsqueda para encontrar más resultados.'
            : 'No hay barberos disponibles en este momento.'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {barbers.map((barber) => (
        <BarberCard key={barber.id} barber={barber} />
      ))}
    </div>
  )
}
