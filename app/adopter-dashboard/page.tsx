"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, User, Calendar, MapPin, Edit, Trash2, Phone, Mail } from "lucide-react"

// Mock data for adopter
const mockAdopter = {
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  phone: "(555) 123-4567",
  address: "123 Main Street, Anytown, ST 12345",
  memberSince: "January 2023",
  adoptedPets: [
    {
      id: 1,
      name: "Max",
      breed: "Golden Retriever",
      adoptionDate: "2023-03-15",
      image: "/placeholder.svg?height=200&width=200",
      shelter: "Happy Paws Shelter",
    },
    {
      id: 2,
      name: "Whiskers",
      breed: "Persian Cat",
      adoptionDate: "2023-08-22",
      image: "/placeholder.svg?height=200&width=200",
      shelter: "Feline Friends Rescue",
    },
  ],
}

export default function AdopterDashboard() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(mockAdopter)

  const handleSaveProfile = () => {
    setIsEditing(false)
    // Here you would typically save to a backend
  }

  return (
    <div className="min-h-screen bg-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">My Dashboard</h1>
          <p className="text-xl text-gray-600">Manage your profile and view your adopted pets</p>
        </div>

        <Tabs defaultValue="pets" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-purple-200 mb-8">
            <TabsTrigger value="pets" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              My Adopted Pets
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile Settings
            </TabsTrigger>
          </TabsList>

          {/* Adopted Pets Tab */}
          <TabsContent value="pets" className="animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockAdopter.adoptedPets.map((pet, index) => (
                <Card
                  key={pet.id}
                  className="card-hover border-purple-200 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative aspect-video">
                    <Image
                      src={pet.image || "/placeholder.svg"}
                      alt={pet.name}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>

                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-1">{pet.name}</h3>
                        <p className="text-purple-600 font-medium">{pet.breed}</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Adopted
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Adopted on {pet.adoptionDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>From {pet.shelter}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {mockAdopter.adoptedPets.length === 0 && (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No adopted pets yet</h3>
                <p className="text-gray-500 mb-6">Start your journey by browsing available pets</p>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Browse Available Pets
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="animate-slide-up">
            <div className="max-w-2xl mx-auto">
              <Card className="border-purple-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-600" />
                    Profile Information
                  </CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </CardHeader>

                <CardContent className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={profile.address}
                          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        />
                      </div>

                      <div className="flex gap-4">
                        <Button
                          onClick={handleSaveProfile}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Contact Information</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                              <User className="w-4 h-4" />
                              <span>{profile.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span>{profile.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{profile.phone}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Address</h4>
                          <div className="flex items-start gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 mt-1" />
                            <span>{profile.address}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-purple-200">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Member since {profile.memberSince}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card className="border-purple-200 mt-6">
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive" className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
