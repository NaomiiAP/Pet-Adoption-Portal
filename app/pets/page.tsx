"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Calendar, Filter, Dog, Cat, Plus } from "lucide-react"
import { Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Pet {
  pid: number
  pname: string
  species: string
  gender: string
  age: number
  adoptionstatus: string
  imageurl: string
  shelter_name: string
}

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    species: "all",
    gender: "all",
    status: "all",
  })

  const [isAddingPet, setIsAddingPet] = useState(false)
  const [editingPet, setEditingPet] = useState<Pet | null>(null)
  const [shelters, setShelters] = useState<{ sid: number; sname: string }[]>([])
  const [newPet, setNewPet] = useState({
    pname: "",
    species: "Dog",
    gender: "Male",
    age: 1,
    adoptionstatus: "available",
    imageurl: "",
    sid: "",
  })

  const fetchShelters = async () => {
    try {
      const response = await fetch("/api/shelters")
      const data = await response.json()
      setShelters(data)
    } catch (error) {
      console.error("Failed to fetch shelters:", error)
    }
  }

  useEffect(() => {
    fetchPets()
    fetchShelters()
  }, [filters])

  const fetchPets = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.species !== "all") params.append("species", filters.species)
      if (filters.gender !== "all") params.append("gender", filters.gender)
      if (filters.status !== "all") params.append("status", filters.status)

      const response = await fetch(`/api/pets?${params.toString()}`)
      const data = await response.json()
      setPets(data)
    } catch (error) {
      console.error("Failed to fetch pets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }))
  }

  const getPetIcon = (species: string) => {
    return species.toLowerCase() === "dog" ? Dog : Cat
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-600 text-white"
      case "pending":
        return "bg-yellow-600 text-white"
      case "adopted":
        return "bg-blue-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  const handleAddPet = async () => {
    try {
      const response = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPet),
      })

      if (response.ok) {
        setNewPet({
          pname: "",
          species: "Dog",
          gender: "Male",
          age: 1,
          adoptionstatus: "available",
          imageurl: "",
          sid: "",
        })
        setIsAddingPet(false)
        fetchPets()
        alert("Pet added successfully!")
      }
    } catch (error) {
      console.error("Failed to add pet:", error)
    }
  }

  const handleUpdatePet = async () => {
    if (!editingPet) return

    try {
      const response = await fetch(`/api/pets/${editingPet.pid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPet),
      })

      if (response.ok) {
        setEditingPet(null)
        fetchPets()
        alert("Pet updated successfully!")
      }
    } catch (error) {
      console.error("Failed to update pet:", error)
    }
  }

  const handleDeletePet = async (pid: number) => {
    if (!confirm("Are you sure you want to delete this pet?")) return

    try {
      const response = await fetch(`/api/pets/${pid}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchPets()
        alert("Pet deleted successfully!")
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      console.error("Failed to delete pet:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-white mt-4">Loading pets...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-4">Find Your Perfect Pet</h1>
          <p className="text-xl text-gray-300">Browse through our available pets and find your new best friend</p>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8 animate-slide-up border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Filter Pets</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={filters.species} onValueChange={(value) => handleFilterChange("species", value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Species" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all">All Species</SelectItem>
                <SelectItem value="Dog">Dogs</SelectItem>
                <SelectItem value="Cat">Cats</SelectItem>
                <SelectItem value="Rabbit">Rabbits</SelectItem>
                <SelectItem value="Bird">Birds</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.gender} onValueChange={(value) => handleFilterChange("gender", value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="adopted">Adopted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-400">Showing {pets.length} pets</p>

          <Dialog open={isAddingPet} onOpenChange={setIsAddingPet}>
            <DialogTrigger asChild>
              <Button className="gradient-lilac hover:opacity-90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add New Pet
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>Add New Pet</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pname">Pet Name</Label>
                  <Input
                    id="pname"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={newPet.pname}
                    onChange={(e) => setNewPet({ ...newPet, pname: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="species">Species</Label>
                    <Select value={newPet.species} onValueChange={(value) => setNewPet({ ...newPet, species: value })}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select species" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="Dog">Dog</SelectItem>
                        <SelectItem value="Cat">Cat</SelectItem>
                        <SelectItem value="Rabbit">Rabbit</SelectItem>
                        <SelectItem value="Bird">Bird</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={newPet.gender} onValueChange={(value) => setNewPet({ ...newPet, gender: value })}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age (years)</Label>
                    <Input
                      id="age"
                      type="number"
                      className="bg-gray-700 border-gray-600 text-white"
                      value={newPet.age}
                      onChange={(e) => setNewPet({ ...newPet, age: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newPet.adoptionstatus}
                      onValueChange={(value) => setNewPet({ ...newPet, adoptionstatus: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="adopted">Adopted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="imageurl">Image URL</Label>
                  <Input
                    id="imageurl"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={newPet.imageurl}
                    onChange={(e) => setNewPet({ ...newPet, imageurl: e.target.value })}
                    placeholder="https://example.com/pet-image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="shelter">Shelter</Label>
                  <Select value={newPet.sid} onValueChange={(value) => setNewPet({ ...newPet, sid: value })}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select shelter" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {shelters.map((shelter) => (
                        <SelectItem key={shelter.sid} value={shelter.sid.toString()}>
                          {shelter.sname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-4">
                  <Button onClick={handleAddPet} className="flex-1 gradient-lilac hover:opacity-90 text-white">
                    Add Pet
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingPet(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Pet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet, index) => {
            const PetIcon = getPetIcon(pet.species)
            return (
              <Card
                key={pet.pid}
                className="card-hover bg-gray-800 border-gray-700 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-square gradient-lilac rounded-t-lg flex items-center justify-center">
                  {pet.imageurl ? (
                    <img
                      src={pet.imageurl || "/placeholder.svg"}
                      alt={pet.pname}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <PetIcon className="w-24 h-24 text-white" />
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge className={getStatusColor(pet.adoptionstatus)}>{pet.adoptionstatus}</Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-white">{pet.pname}</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-purple-400 hover:text-purple-300"
                        onClick={() => setEditingPet(pet)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-300"
                        onClick={() => handleDeletePet(pet.pid)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-purple-400 font-medium mb-2">{pet.species}</p>

                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {pet.age} years • {pet.gender}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{pet.shelter_name || "Unknown Shelter"}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button asChild className="w-full gradient-lilac hover:opacity-90 text-white">
                    <Link href={`/pets/${pet.pid}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {pets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-300">No pets found matching your criteria.</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters to see more results.</p>
          </div>
        )}
        {/* Edit Pet Dialog */}
        <Dialog open={!!editingPet} onOpenChange={() => setEditingPet(null)}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Edit Pet</DialogTitle>
            </DialogHeader>
            {editingPet && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-pname">Pet Name</Label>
                  <Input
                    id="edit-pname"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={editingPet.pname}
                    onChange={(e) => setEditingPet({ ...editingPet, pname: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-species">Species</Label>
                    <Select
                      value={editingPet.species}
                      onValueChange={(value) => setEditingPet({ ...editingPet, species: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select species" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="Dog">Dog</SelectItem>
                        <SelectItem value="Cat">Cat</SelectItem>
                        <SelectItem value="Rabbit">Rabbit</SelectItem>
                        <SelectItem value="Bird">Bird</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-gender">Gender</Label>
                    <Select
                      value={editingPet.gender}
                      onValueChange={(value) => setEditingPet({ ...editingPet, gender: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-age">Age (years)</Label>
                    <Input
                      id="edit-age"
                      type="number"
                      className="bg-gray-700 border-gray-600 text-white"
                      value={editingPet.age}
                      onChange={(e) => setEditingPet({ ...editingPet, age: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={editingPet.adoptionstatus}
                      onValueChange={(value) => setEditingPet({ ...editingPet, adoptionstatus: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="adopted">Adopted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-imageurl">Image URL</Label>
                  <Input
                    id="edit-imageurl"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={editingPet.imageurl}
                    onChange={(e) => setEditingPet({ ...editingPet, imageurl: e.target.value })}
                    placeholder="https://example.com/pet-image.jpg"
                  />
                </div>
                <div className="flex gap-4">
                  <Button onClick={handleUpdatePet} className="flex-1 gradient-lilac hover:opacity-90 text-white">
                    Update Pet
                  </Button>
                  <Button variant="outline" onClick={() => setEditingPet(null)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
