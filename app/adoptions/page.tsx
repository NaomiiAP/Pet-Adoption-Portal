"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Calendar, User, Heart, Trash2, Filter } from "lucide-react"

interface AdoptionRecord {
  rid: number
  adoptiondate: string
  notes: string
  adopter_name: string
  pet_name: string
  shelter_name: string
  aid: number
  pid: number
  sid: number
}

interface Adopter {
  aid: number
  fname: string
}

interface Shelter {
  sid: number
  sname: string
}

export default function AdoptionsPage() {
  const [adoptions, setAdoptions] = useState<AdoptionRecord[]>([])
  const [adopters, setAdopters] = useState<Adopter[]>([])
  const [shelters, setShelters] = useState<Shelter[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    adopterId: "all",
    shelterId: "all",
  })

  useEffect(() => {
    fetchAdoptions()
    fetchAdopters()
    fetchShelters()
  }, [filters])

  const fetchAdoptions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.adopterId !== "all") params.append("adopterId", filters.adopterId)
      if (filters.shelterId !== "all") params.append("shelterId", filters.shelterId)

      const response = await fetch(`/api/adoptions?${params.toString()}`)
      const data = await response.json()
      setAdoptions(data)
    } catch (error) {
      console.error("Failed to fetch adoptions:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAdopters = async () => {
    try {
      const response = await fetch("/api/adopters")
      const data = await response.json()
      setAdopters(data)
    } catch (error) {
      console.error("Failed to fetch adopters:", error)
    }
  }

  const fetchShelters = async () => {
    try {
      const response = await fetch("/api/shelters")
      const data = await response.json()
      setShelters(data)
    } catch (error) {
      console.error("Failed to fetch shelters:", error)
    }
  }

  const handleCancelAdoption = async (rid: number) => {
    if (!confirm("Are you sure you want to cancel this adoption? This will make the pet available again.")) return

    try {
      const response = await fetch(`/api/adoptions/${rid}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchAdoptions()
        alert("Adoption cancelled successfully!")
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      console.error("Failed to cancel adoption:", error)
    }
  }

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-white mt-4">Loading adoption records...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-4">Adoption Records</h1>
          <p className="text-xl text-gray-300">View and manage all adoption records</p>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8 animate-slide-up border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Filter Adoptions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={filters.adopterId} onValueChange={(value) => handleFilterChange("adopterId", value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Filter by Adopter" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all">All Adopters</SelectItem>
                {adopters.map((adopter) => (
                  <SelectItem key={adopter.aid} value={adopter.aid.toString()}>
                    {adopter.fname} (ID: {adopter.aid})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.shelterId} onValueChange={(value) => handleFilterChange("shelterId", value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Filter by Shelter" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all">All Shelters</SelectItem>
                {shelters.map((shelter) => (
                  <SelectItem key={shelter.sid} value={shelter.sid.toString()}>
                    {shelter.sname} (ID: {shelter.sid})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">Showing {adoptions.length} adoption records</p>
        </div>

        {/* Adoption Records */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adoptions.map((adoption, index) => (
            <Card
              key={adoption.rid}
              className="card-hover bg-gray-800 border-gray-700 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Heart className="w-5 h-5 text-purple-400" />
                      {adoption.pet_name}
                    </CardTitle>
                    <Badge variant="secondary" className="mt-2 bg-green-600/20 text-green-300">
                      Adopted
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:text-red-300"
                    onClick={() => handleCancelAdoption(adoption.rid)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-gray-300">
                  <User className="w-4 h-4" />
                  <span className="text-sm">
                    <strong>Adopter:</strong> {adoption.adopter_name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">
                    <strong>Shelter:</strong> {adoption.shelter_name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    <strong>Date:</strong> {new Date(adoption.adoptiondate).toLocaleDateString()}
                  </span>
                </div>
                {adoption.notes && (
                  <div className="text-gray-400 text-sm">
                    <strong>Notes:</strong> {adoption.notes}
                  </div>
                )}
                <div className="text-xs text-gray-500 pt-2 border-t border-gray-700">Record ID: {adoption.rid}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {adoptions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-300">No adoption records found.</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>
    </div>
  )
}
