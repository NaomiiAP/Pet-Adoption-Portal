"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Building2, Heart, Edit, Trash2, Calendar, FileText } from "lucide-react"

// Mock data for shelter
const mockShelter = {
  name: "Happy Paws Shelter",
  pets: [
    {
      id: 1,
      name: "Luna",
      species: "Dog",
      breed: "Golden Retriever",
      age: "2 years",
      status: "Available",
      image: "/placeholder.svg?height=200&width=200",
      addedDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Max",
      species: "Dog",
      breed: "Labrador Mix",
      age: "1 year",
      status: "Adopted",
      image: "/placeholder.svg?height=200&width=200",
      addedDate: "2024-01-10",
      adoptedDate: "2024-01-20",
    },
    {
      id: 3,
      name: "Whiskers",
      species: "Cat",
      breed: "Persian",
      age: "3 years",
      status: "Pending",
      image: "/placeholder.svg?height=200&width=200",
      addedDate: "2024-01-12",
    },
  ],
  adoptionRecords: [
    {
      id: 1,
      petName: "Max",
      adopterName: "Sarah Johnson",
      adoptionDate: "2024-01-20",
      status: "Completed",
    },
    {
      id: 2,
      petName: "Bella",
      adopterName: "Mike Chen",
      adoptionDate: "2024-01-18",
      status: "Completed",
    },
  ],
}

export default function ShelterDashboard() {
  const [pets, setPets] = useState(mockShelter.pets)
  const [isAddingPet, setIsAddingPet] = useState(false)
  const [newPet, setNewPet] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    description: "",
    status: "Available",
  })

  const handleAddPet = () => {
    const pet = {
      id: pets.length + 1,
      ...newPet,
      image: "/placeholder.svg?height=200&width=200",
      addedDate: new Date().toISOString().split("T")[0],
    }
    setPets([...pets, pet])
    setNewPet({
      name: "",
      species: "",
      breed: "",
      age: "",
      description: "",
      status: "Available",
    })
    setIsAddingPet(false)
  }

  const handleDeletePet = (petId: number) => {
    setPets(pets.filter((pet) => pet.id !== petId))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-500"
      case "Pending":
        return "bg-yellow-500"
      case "Adopted":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Shelter Dashboard</h1>
          <p className="text-xl text-gray-600">Manage your pets and adoption records</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-purple-200 animate-scale-in">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                {pets.filter((p) => p.status === "Available").length}
              </h3>
              <p className="text-gray-600">Available</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 animate-scale-in" style={{ animationDelay: "0.1s" }}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{pets.filter((p) => p.status === "Pending").length}</h3>
              <p className="text-gray-600">Pending</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{pets.filter((p) => p.status === "Adopted").length}</h3>
              <p className="text-gray-600">Adopted</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 animate-scale-in" style={{ animationDelay: "0.3s" }}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{pets.length}</h3>
              <p className="text-gray-600">Total Pets</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pets" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-purple-200 mb-8">
            <TabsTrigger value="pets" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Manage Pets
            </TabsTrigger>
            <TabsTrigger value="adoptions" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Adoption Records
            </TabsTrigger>
          </TabsList>

          {/* Pets Management Tab */}
          <TabsContent value="pets" className="animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Your Pets</h2>

              <Dialog open={isAddingPet} onOpenChange={setIsAddingPet}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Pet
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Pet</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="petName">Pet Name</Label>
                      <Input
                        id="petName"
                        value={newPet.name}
                        onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                        placeholder="Enter pet name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="species">Species</Label>
                        <Select
                          value={newPet.species}
                          onValueChange={(value) => setNewPet({ ...newPet, species: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select species" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Dog">Dog</SelectItem>
                            <SelectItem value="Cat">Cat</SelectItem>
                            <SelectItem value="Rabbit">Rabbit</SelectItem>
                            <SelectItem value="Bird">Bird</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          value={newPet.age}
                          onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
                          placeholder="e.g., 2 years"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="breed">Breed</Label>
                      <Input
                        id="breed"
                        value={newPet.breed}
                        onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                        placeholder="Enter breed"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newPet.description}
                        onChange={(e) => setNewPet({ ...newPet, description: e.target.value })}
                        placeholder="Describe the pet's personality and characteristics"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={handleAddPet}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet, index) => (
                <Card
                  key={pet.id}
                  className="card-hover border-purple-200 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={pet.image || "/placeholder.svg"}
                      alt={pet.name}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className={getStatusColor(pet.status)}>{pet.status}</Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{pet.name}</h3>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                          onClick={() => handleDeletePet(pet.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-purple-600 font-medium mb-2">{pet.breed}</p>
                    <p className="text-gray-600 text-sm mb-3">
                      {pet.age} • {pet.species}
                    </p>
                    <p className="text-gray-500 text-xs">Added: {pet.addedDate}</p>
                    {pet.adoptedDate && <p className="text-green-600 text-xs">Adopted: {pet.adoptedDate}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Adoption Records Tab */}
          <TabsContent value="adoptions" className="animate-slide-up">
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle>Recent Adoptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockShelter.adoptionRecords.map((record, index) => (
                    <div key={record.id} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">{record.petName}</h4>
                        <p className="text-gray-600">Adopted by {record.adopterName}</p>
                        <p className="text-sm text-gray-500">{record.adoptionDate}</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {record.status}
                      </Badge>
                    </div>
                  ))}
                </div>

                {mockShelter.adoptionRecords.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No adoption records yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
