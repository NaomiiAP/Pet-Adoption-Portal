"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Building2, Heart, Phone, Mail, MapPin } from "lucide-react"

export default function RegisterPage() {
  const [adopterForm, setAdopterForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    age: "",
    experience: "",
    housing: "",
    preferences: "",
  })

  const [shelterForm, setShelterForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    license: "",
    capacity: "",
    description: "",
    website: "",
  })

  const handleAdopterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Adopter registration:", adopterForm)
    alert("Adopter registration successful!")
  }

  const handleShelterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Shelter registration:", shelterForm)
    alert("Shelter registration successful!")
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-4">Join PawPal</h1>
          <p className="text-xl text-gray-300">Register as an adopter or shelter to get started</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="adopter" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800 border border-gray-700 mb-8">
              <TabsTrigger
                value="adopter"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Heart className="w-4 h-4" />
                Register as Adopter
              </TabsTrigger>
              <TabsTrigger
                value="shelter"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Building2 className="w-4 h-4" />
                Register as Shelter
              </TabsTrigger>
            </TabsList>

            {/* Adopter Registration */}
            <TabsContent value="adopter" className="animate-slide-up">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <UserPlus className="w-5 h-5 text-purple-400" />
                    Adopter Registration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAdopterSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="adopter-name" className="text-gray-300">
                          Full Name *
                        </Label>
                        <Input
                          id="adopter-name"
                          className="bg-gray-700 border-gray-600 text-white"
                          value={adopterForm.name}
                          onChange={(e) => setAdopterForm({ ...adopterForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="adopter-age" className="text-gray-300">
                          Age *
                        </Label>
                        <Input
                          id="adopter-age"
                          type="number"
                          className="bg-gray-700 border-gray-600 text-white"
                          value={adopterForm.age}
                          onChange={(e) => setAdopterForm({ ...adopterForm, age: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="adopter-email" className="text-gray-300">
                          Email Address *
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="adopter-email"
                            type="email"
                            className="pl-10 bg-gray-700 border-gray-600 text-white"
                            value={adopterForm.email}
                            onChange={(e) => setAdopterForm({ ...adopterForm, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="adopter-phone" className="text-gray-300">
                          Phone Number *
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="adopter-phone"
                            className="pl-10 bg-gray-700 border-gray-600 text-white"
                            value={adopterForm.phone}
                            onChange={(e) => setAdopterForm({ ...adopterForm, phone: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="adopter-address" className="text-gray-300">
                        Address *
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="adopter-address"
                          className="pl-10 bg-gray-700 border-gray-600 text-white"
                          value={adopterForm.address}
                          onChange={(e) => setAdopterForm({ ...adopterForm, address: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="adopter-housing" className="text-gray-300">
                          Housing Type *
                        </Label>
                        <Select
                          value={adopterForm.housing}
                          onValueChange={(value) => setAdopterForm({ ...adopterForm, housing: value })}
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Select housing type" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="house">House</SelectItem>
                            <SelectItem value="condo">Condo</SelectItem>
                            <SelectItem value="farm">Farm</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="adopter-experience" className="text-gray-300">
                          Pet Experience
                        </Label>
                        <Select
                          value={adopterForm.experience}
                          onValueChange={(value) => setAdopterForm({ ...adopterForm, experience: value })}
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            <SelectItem value="first-time">First-time owner</SelectItem>
                            <SelectItem value="some">Some experience</SelectItem>
                            <SelectItem value="experienced">Very experienced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="adopter-preferences" className="text-gray-300">
                        Pet Preferences
                      </Label>
                      <Textarea
                        id="adopter-preferences"
                        placeholder="Tell us about your ideal pet (size, energy level, etc.)"
                        className="bg-gray-700 border-gray-600 text-white"
                        value={adopterForm.preferences}
                        onChange={(e) => setAdopterForm({ ...adopterForm, preferences: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <Button type="submit" className="w-full gradient-lilac hover:opacity-90 text-white">
                      Register as Adopter
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Shelter Registration */}
            <TabsContent value="shelter" className="animate-slide-up">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Building2 className="w-5 h-5 text-purple-400" />
                    Shelter Registration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShelterSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="shelter-name" className="text-gray-300">
                          Shelter Name *
                        </Label>
                        <Input
                          id="shelter-name"
                          className="bg-gray-700 border-gray-600 text-white"
                          value={shelterForm.name}
                          onChange={(e) => setShelterForm({ ...shelterForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="shelter-license" className="text-gray-300">
                          License Number *
                        </Label>
                        <Input
                          id="shelter-license"
                          className="bg-gray-700 border-gray-600 text-white"
                          value={shelterForm.license}
                          onChange={(e) => setShelterForm({ ...shelterForm, license: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="shelter-email" className="text-gray-300">
                          Email Address *
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="shelter-email"
                            type="email"
                            className="pl-10 bg-gray-700 border-gray-600 text-white"
                            value={shelterForm.email}
                            onChange={(e) => setShelterForm({ ...shelterForm, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="shelter-phone" className="text-gray-300">
                          Phone Number *
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="shelter-phone"
                            className="pl-10 bg-gray-700 border-gray-600 text-white"
                            value={shelterForm.phone}
                            onChange={(e) => setShelterForm({ ...shelterForm, phone: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="shelter-address" className="text-gray-300">
                        Address *
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="shelter-address"
                          className="pl-10 bg-gray-700 border-gray-600 text-white"
                          value={shelterForm.address}
                          onChange={(e) => setShelterForm({ ...shelterForm, address: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="shelter-capacity" className="text-gray-300">
                          Capacity
                        </Label>
                        <Input
                          id="shelter-capacity"
                          type="number"
                          placeholder="Number of animals"
                          className="bg-gray-700 border-gray-600 text-white"
                          value={shelterForm.capacity}
                          onChange={(e) => setShelterForm({ ...shelterForm, capacity: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="shelter-website" className="text-gray-300">
                          Website
                        </Label>
                        <Input
                          id="shelter-website"
                          type="url"
                          placeholder="https://..."
                          className="bg-gray-700 border-gray-600 text-white"
                          value={shelterForm.website}
                          onChange={(e) => setShelterForm({ ...shelterForm, website: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="shelter-description" className="text-gray-300">
                        Description
                      </Label>
                      <Textarea
                        id="shelter-description"
                        placeholder="Tell us about your shelter, mission, and services"
                        className="bg-gray-700 border-gray-600 text-white"
                        value={shelterForm.description}
                        onChange={(e) => setShelterForm({ ...shelterForm, description: e.target.value })}
                        rows={4}
                      />
                    </div>

                    <Button type="submit" className="w-full gradient-lilac hover:opacity-90 text-white">
                      Register as Shelter
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
