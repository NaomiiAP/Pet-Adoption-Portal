"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Heart,
  MapPin,
  User,
  Stethoscope,
  FileText,
  Phone,
  UploadCloud
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

type Pet = {
  id: number
  name: string
  species: string
  breed: string
  age: string
  gender: string
  weight: string
  color: string
  status: string
  location: string
  shelterContact: string
  image: string
  description: string
  personality: string[]
  medicalHistory: {
    date: string
    type: string
    description: string
    vet: string
  }[]
  adoptionRequirements: string[]
}

export default function PetProfilePage({ params }: { params: { id: string } }) {
  const [pet, setPet] = useState<Pet | null>(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    async function fetchPet() {
      try {
        const res = await fetch(`/api/pets/${params.id}`)
        if (!res.ok) throw new Error("Pet not found")
        const data = await res.json()
        setPet(data)
      } catch (err) {
        console.error(err)
        router.push("/pets")
      } finally {
        setLoading(false)
      }
    }
    fetchPet()
  }, [params.id, router])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return
    const file = event.target.files[0]
    const formData = new FormData()
    formData.append("image", file)

    try {
      const res = await fetch(`/api/pets/${params.id}/upload`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()
      setPet(prev => prev ? { ...prev, image: data.imageUrl } : null)
      toast({ title: "Image uploaded successfully!" })
    } catch (error) {
      console.error(error)
      toast({ title: "Upload failed", description: "Please try again later." })
    }
  }

  if (loading) return <div className="text-center mt-20">Loading pet profile...</div>
  if (!pet) return null

  return (
    <div className="min-h-screen bg-purple-50 py-8">
      <div className="container mx-auto px-4">
        <Button asChild variant="ghost" className="mb-6 animate-fade-in">
          <Link href="/pets">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pet Listings
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="animate-scale-in relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
              <Image src={pet.image || "/placeholder.svg"} alt={pet.name} fill className="object-cover" />
              <div className="absolute top-4 right-4">
                <Badge variant="default" className="bg-green-500 text-white">
                  {pet.status}
                </Badge>
              </div>
            </div>
            <div className="mt-3 text-center">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2"
              >
                <UploadCloud className="w-4 h-4 mr-2" />
                Upload New Image
              </Button>
            </div>
          </div>

          <div className="space-y-6 animate-slide-up">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-4xl font-bold text-gray-800">{pet.name}</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFavorited(!isFavorited)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Heart className={`w-6 h-6 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              </div>
              <p className="text-xl text-purple-600 font-medium mb-4">{pet.breed}</p>
              <p className="text-gray-600 text-lg leading-relaxed">{pet.description}</p>
            </div>

            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  Quick Info
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">Age</p><p className="font-medium">{pet.age}</p></div>
                <div><p className="text-sm text-gray-500">Gender</p><p className="font-medium">{pet.gender}</p></div>
                <div><p className="text-sm text-gray-500">Weight</p><p className="font-medium">{pet.weight}</p></div>
                <div><p className="text-sm text-gray-500">Color</p><p className="font-medium">{pet.color}</p></div>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader><CardTitle>Personality</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {pet.personality.map((trait, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Location & Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium">{pet.location}</p>
                <p className="text-gray-600 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {pet.shelterContact}
                </p>
              </CardContent>
            </Card>

            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
            >
              <Heart className="w-5 h-5 mr-2" />
              Adopt {pet.name}
            </Button>
          </div>
        </div>

        <div className="mt-12 animate-slide-up">
          <Tabs defaultValue="medical" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white border border-purple-200">
              <TabsTrigger value="medical" className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4" />
                Medical History
              </TabsTrigger>
              <TabsTrigger value="requirements" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Adoption Requirements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="medical" className="mt-6">
              <Card className="border-purple-200">
                <CardHeader><CardTitle>Medical History</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pet.medicalHistory.map((record, index) => (
                      <div key={index} className="border-l-4 border-purple-300 pl-4 py-2">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-800">{record.type}</h4>
                          <span className="text-sm text-gray-500">{record.date}</span>
                        </div>
                        <p className="text-gray-600 mb-1">{record.description}</p>
                        <p className="text-sm text-purple-600">Veterinarian: {record.vet}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requirements" className="mt-6">
              <Card className="border-purple-200">
                <CardHeader><CardTitle>Adoption Requirements</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {pet.adoptionRequirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
