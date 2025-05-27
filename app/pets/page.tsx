"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, MapPin, Calendar, Dog, Cat } from "lucide-react"

interface Pet {
  id: number
  name: string
  species: string
  breed: string
  age: string
  gender: string
  status: string
  location: string
  description: string
}

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([])
  const [filteredPets, setFilteredPets] = useState<Pet[]>([])
  const [filters, setFilters] = useState({
    species: "all",
    gender: "all",
    age: "all",
    status: "all",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/pets")
      .then((res) => res.json())
      .then((data: Pet[]) => {
        setPets(data)
        setFilteredPets(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch pets:", err)
        setLoading(false)
      })
  }, [])

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)

    let filtered = pets

    if (newFilters.species !== "all") {
      filtered = filtered.filter((pet) => pet.species.toLowerCase() === newFilters.species)
    }
    if (newFilters.gender !== "all") {
      filtered = filtered.filter((pet) => pet.gender.toLowerCase() === newFilters.gender)
    }
    if (newFilters.status !== "all") {
      filtered = filtered.filter((pet) => pet.status.toLowerCase() === newFilters.status)
    }

    setFilteredPets(filtered)
  }

  const getPetIcon = (species: string) => {
    return species.toLowerCase() === "dog" ? Dog : Cat
  }

  if (loading) {
    return <div className="text-white text-center py-10">Loading pets...</div>
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      {/* Example Filters UI */}
      <div className="container mx-auto px-4 mb-6 flex flex-wrap gap-4">
        <Select onValueChange={(val) => handleFilterChange("species", val)} value={filters.species}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Species" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Species</SelectItem>
            <SelectItem value="dog">Dog</SelectItem>
            <SelectItem value="cat">Cat</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(val) => handleFilterChange("gender", val)} value={filters.gender}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(val) => handleFilterChange("status", val)} value={filters.status}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="adopted">Adopted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="mb-6 px-4 container mx-auto">
        <p className="text-gray-400">Showing {filteredPets.length} pets</p>
      </div>

      {/* Pet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 container mx-auto px-4">
        {filteredPets.length === 0 ? (
          <div className="text-center py-12 text-gray-300">
            No pets found matching your criteria.
            <br />
            Try adjusting your filters.
          </div>
        ) : (
          filteredPets.map((pet, index) => {
            const PetIcon = getPetIcon(pet.species)
            return (
              <Card
                key={pet.id}
                className="card-hover bg-gray-800 border-gray-700 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-square gradient-lilac rounded-t-lg flex items-center justify-center">
                  <PetIcon className="w-24 h-24 text-white" />
                  <div className="absolute top-3 right-3">
                    <Badge
                      variant={pet.status === "Available" ? "default" : "secondary"}
                      className={pet.status === "Available" ? "bg-green-600 text-white" : "bg-yellow-600 text-white"}
                    >
                      {pet.status}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-white">{pet.name}</h3>
                    <Heart className="w-5 h-5 text-gray-400 hover:text-red-400 cursor-pointer transition-colors" />
                  </div>

                  <p className="text-purple-400 font-medium mb-2">{pet.breed}</p>
                  <p className="text-gray-300 text-sm mb-3">{pet.description}</p>

                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {pet.age} • {pet.gender}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{pet.location}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button asChild className="w-full gradient-lilac hover:opacity-90 text-white">
                    <Link href={`/pets/${pet.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
