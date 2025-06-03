"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Heart, MapPin, User, Stethoscope, Phone, Plus, Dog, Cat } from "lucide-react"

interface Pet {
  pid: number
  pname: string
  species: string
  gender: string
  age: number
  adoptionstatus: string
  imageurl: string
  shelter_name: string
  shelter_phone: string
  shelter_email: string
}

interface MedicalRecord {
  mrid: number
  checkupdate: string
  condition: string
  treatment: string
  vetname: string
}

interface Adopter {
  aid: number
  fname: string
}

export default function PetProfilePage({ params }: { params: { id: string } }) {
  const [pet, setPet] = useState<Pet | null>(null)
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])
  const [adopters, setAdopters] = useState<Adopter[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdopting, setIsAdopting] = useState(false)
  const [isAddingMedical, setIsAddingMedical] = useState(false)
  const [adoptionForm, setAdoptionForm] = useState({
    aid: "",
    notes: "",
  })
  const [medicalForm, setMedicalForm] = useState({
    checkupdate: "",
    condition: "",
    treatment: "",
    vetname: "",
  })

  useEffect(() => {
    fetchPetDetails()
    fetchMedicalRecords()
    fetchAdopters()
  }, [params.id])

  const fetchPetDetails = async () => {
    try {
      const response = await fetch(`/api/pets/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setPet(data)
      }
    } catch (error) {
      console.error("Failed to fetch pet details:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMedicalRecords = async () => {
    try {
      const response = await fetch(`/api/medical-records?petId=${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setMedicalRecords(data)
      }
    } catch (error) {
      console.error("Failed to fetch medical records:", error)
    }
  }

  const fetchAdopters = async () => {
    try {
      const response = await fetch("/api/adopters")
      if (response.ok) {
        const data = await response.json()
        setAdopters(data)
      }
    } catch (error) {
      console.error("Failed to fetch adopters:", error)
    }
  }

  const handleAdoption = async () => {
    if (!pet || !adoptionForm.aid) return

    try {
      const response = await fetch("/api/adoptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aid: Number.parseInt(adoptionForm.aid),
          pid: pet.pid,
          sid: 1, // You might want to get this from the pet's shelter
          notes: adoptionForm.notes,
        }),
      })

      if (response.ok) {
        alert("Pet adopted successfully!")
        setIsAdopting(false)
        fetchPetDetails() // Refresh pet details
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      console.error("Failed to process adoption:", error)
    }
  }

  const handleAddMedicalRecord = async () => {
    if (!pet) return

    try {
      const response = await fetch("/api/medical-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pid: pet.pid,
          ...medicalForm,
        }),
      })

      if (response.ok) {
        alert("Medical record added successfully!")
        setIsAddingMedical(false)
        setMedicalForm({ checkupdate: "", condition: "", treatment: "", vetname: "" })
        fetchMedicalRecords()
      }
    } catch (error) {
      console.error("Failed to add medical record:", error)
    }
  }

  const getPetIcon = (species: string) => {
    return species?.toLowerCase() === "dog" ? Dog : Cat
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-green-500 text-white"
      case "pending":
        return "bg-yellow-500 text-white"
      case "adopted":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-white mt-4">Loading pet details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Pet Not Found</h1>
            <Button asChild>
              <Link href="/pets">Back to Pet Listings</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const PetIcon = getPetIcon(pet.species)

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-6 animate-fade-in text-gray-300 hover:text-white">
          <Link href="/pets">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pet Listings
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pet Image */}
          <div className="animate-scale-in">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg bg-gray-800">
              {pet.imageurl ? (
                <img src={pet.imageurl || "/placeholder.svg"} alt={pet.pname} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full gradient-lilac flex items-center justify-center">
                  <PetIcon className="w-32 h-32 text-white" />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <Badge className={getStatusColor(pet.adoptionstatus)}>{pet.adoptionstatus}</Badge>
              </div>
            </div>
          </div>

          {/* Pet Info */}
          <div className="space-y-6 animate-slide-up">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-4xl font-bold text-white">{pet.pname}</h1>
                <Heart className="w-6 h-6 text-gray-400 hover:text-red-400 cursor-pointer transition-colors" />
              </div>

              <p className="text-xl text-purple-400 font-medium mb-4">{pet.species}</p>
            </div>

            {/* Quick Info */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="w-5 h-5 text-purple-400" />
                  Quick Info
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Age</p>
                  <p className="font-medium text-white">{pet.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Gender</p>
                  <p className="font-medium text-white">{pet.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Species</p>
                  <p className="font-medium text-white">{pet.species}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="font-medium text-white">{pet.adoptionstatus}</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  Shelter Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium text-white">{pet.shelter_name}</p>
                {pet.shelter_phone && (
                  <p className="text-gray-300 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {pet.shelter_phone}
                  </p>
                )}
                {pet.shelter_email && <p className="text-gray-300">{pet.shelter_email}</p>}
              </CardContent>
            </Card>

            {/* Adopt Button */}
            {pet.adoptionstatus === "available" && (
              <Dialog open={isAdopting} onOpenChange={setIsAdopting}>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full gradient-lilac hover:opacity-90 text-white text-lg py-6">
                    <Heart className="w-5 h-5 mr-2" />
                    Adopt {pet.pname}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle>Adopt {pet.pname}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="adopter">Select Adopter</Label>
                      <Select
                        value={adoptionForm.aid}
                        onValueChange={(value) => setAdoptionForm({ ...adoptionForm, aid: value })}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Choose an adopter" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          {adopters.map((adopter) => (
                            <SelectItem key={adopter.aid} value={adopter.aid.toString()}>
                              {adopter.fname} (ID: {adopter.aid})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="notes">Adoption Notes</Label>
                      <Textarea
                        id="notes"
                        className="bg-gray-700 border-gray-600 text-white"
                        value={adoptionForm.notes}
                        onChange={(e) => setAdoptionForm({ ...adoptionForm, notes: e.target.value })}
                        placeholder="Any special notes about this adoption..."
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button onClick={handleAdoption} className="flex-1 gradient-lilac hover:opacity-90 text-white">
                        Confirm Adoption
                      </Button>
                      <Button variant="outline" onClick={() => setIsAdopting(false)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="mt-12 animate-slide-up">
          <Tabs defaultValue="medical" className="w-full">
            <TabsList className="grid w-full grid-cols-1 bg-gray-800 border border-gray-700">
              <TabsTrigger
                value="medical"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Stethoscope className="w-4 h-4" />
                Medical History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="medical" className="mt-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">Medical History</CardTitle>
                  <Dialog open={isAddingMedical} onOpenChange={setIsAddingMedical}>
                    <DialogTrigger asChild>
                      <Button className="gradient-lilac hover:opacity-90 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Record
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-gray-700 text-white">
                      <DialogHeader>
                        <DialogTitle>Add Medical Record</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="checkupdate">Checkup Date</Label>
                          <Input
                            id="checkupdate"
                            type="date"
                            className="bg-gray-700 border-gray-600 text-white"
                            value={medicalForm.checkupdate}
                            onChange={(e) => setMedicalForm({ ...medicalForm, checkupdate: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="condition">Condition</Label>
                          <Input
                            id="condition"
                            className="bg-gray-700 border-gray-600 text-white"
                            value={medicalForm.condition}
                            onChange={(e) => setMedicalForm({ ...medicalForm, condition: e.target.value })}
                            placeholder="Health condition or checkup type"
                          />
                        </div>
                        <div>
                          <Label htmlFor="treatment">Treatment</Label>
                          <Textarea
                            id="treatment"
                            className="bg-gray-700 border-gray-600 text-white"
                            value={medicalForm.treatment}
                            onChange={(e) => setMedicalForm({ ...medicalForm, treatment: e.target.value })}
                            placeholder="Treatment details"
                          />
                        </div>
                        <div>
                          <Label htmlFor="vetname">Veterinarian</Label>
                          <Input
                            id="vetname"
                            className="bg-gray-700 border-gray-600 text-white"
                            value={medicalForm.vetname}
                            onChange={(e) => setMedicalForm({ ...medicalForm, vetname: e.target.value })}
                            placeholder="Veterinarian name"
                          />
                        </div>
                        <div className="flex gap-4">
                          <Button
                            onClick={handleAddMedicalRecord}
                            className="flex-1 gradient-lilac hover:opacity-90 text-white"
                          >
                            Add Record
                          </Button>
                          <Button variant="outline" onClick={() => setIsAddingMedical(false)} className="flex-1">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {medicalRecords.map((record) => (
                      <div
                        key={record.mrid}
                        className="border-l-4 border-purple-400 pl-4 py-2 bg-gray-700/50 rounded-r-lg"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-white">{record.condition}</h4>
                          <span className="text-sm text-gray-400">
                            {new Date(record.checkupdate).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-1">{record.treatment}</p>
                        <p className="text-sm text-purple-400">Veterinarian: {record.vetname}</p>
                      </div>
                    ))}
                    {medicalRecords.length === 0 && (
                      <p className="text-gray-400 text-center py-8">No medical records found for this pet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
