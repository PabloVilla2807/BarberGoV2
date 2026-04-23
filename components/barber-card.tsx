'use client'

import Image from 'next/image'
import { Star, MapPin, Clock, Phone, Scissors } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Barber } from '@/lib/types'

interface BarberCardProps {
  barber: Barber
}

export function BarberCard({ barber }: BarberCardProps) {
  return (
    <Card className="overflow-hidden bg-card border-border hover:border-foreground/30 transition-all duration-300 group">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={barber.photo}
          alt={barber.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        
        <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-sm px-2 py-1 flex items-center gap-1 border border-border">
          <Star className="h-3 w-3 fill-accent text-accent" />
          <span className="font-serif text-sm text-card-foreground">{barber.rating}</span>
          <span className="text-muted-foreground text-xs">({barber.reviewCount})</span>
        </div>
        
        {barber.distance && (
          <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-sm px-2 py-1 text-xs tracking-wider uppercase">
            {barber.distance} km
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-serif text-xl text-white drop-shadow-lg">{barber.name}</h3>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{barber.location}</span>
          </div>
          <span className="text-accent font-serif text-sm">{barber.priceRange}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {barber.specialties.map((specialty) => (
            <Badge 
              key={specialty} 
              variant="secondary" 
              className="text-xs tracking-wider uppercase bg-secondary/50 text-secondary-foreground border border-border"
            >
              {specialty}
            </Badge>
          ))}
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {barber.bio}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{barber.availability}</span>
          </div>
          <div className="flex items-center gap-1">
            <Scissors className="h-3 w-3" />
            <span>{barber.yearsExperience} anos exp.</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 tracking-wider uppercase text-xs" size="sm">
          Reservar
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 border-border text-card-foreground hover:bg-card-foreground/10"
        >
          <Phone className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
