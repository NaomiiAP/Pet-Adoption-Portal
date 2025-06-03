"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Building2, Mail, Phone, MapPin, Trash2 } from "lucide-react"

interface Shelter {
  sid: number
  sname: string
  saddress: string
  sphno: string
  semail: string
}

export default function SheltersPage() {
  const [shelters, setShelters] = useState<Shelter[]>([])
  const [isAddingShelter, setIsAddingShelter] = useState(false)
  const [editingShelter, setEditingShelter] = useState<Shelter | null>(null)
  const [newShelter, setNewShelter] = useState({
    sname: "",
    saddress: "",
    sphno: "",
    semail: "",
  })

  useEffect(() => {
    fetchShelters()
  }, [])

  const fetchShelters = async () => {
    try {
      const response = await fetch("/api/shelters")
      const data = await response.json()
      setShelters(data)
    } catch (error) {
      console.error("Failed to fetch shelters:", error)
    }
  }

  const handleAddShelter = async () => {
    try {
      const response = await fetch("/api/shelters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newShelter),
      })

      if (response.ok) {
        setNewShelter({ sname: "", saddress: "", sphno: "", semail: "" })
        setIsAddingShelter(false)
        fetchShelters()
        alert("Shelter added successfully!")
      }
    } catch (error) {
      console.error("Failed to add shelter:", error)
    }
  }

  const handleUpdateShelter = async () => {
    if (!editingShelter) return

    try {
      const response = await fetch(`/api/shelters/${editingShelter.sid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingShelter),
      })

      if (response.ok) {
        setEditingShelter(null)
        fetchShelters()
        alert("Shelter updated successfully!")
      }
    } catch (error) {
      console.error("Failed to update shelter:", error)
    }
  }

  const handleDeleteShelter = async (sid: number) => {
    if (!confirm("Are you sure you want to delete this shelter? This will also delete all associated pets.")) return

    try {
      const response = await fetch(`/api/shelters/${sid}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchShelters()
        alert("Shelter deleted successfully!")
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      console.error("Failed to delete shelter:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-4">Shelter Management</h1>
          <p className="text-xl text-gray-300">Manage shelter registrations and information</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">All Shelters</h2>

          <Dialog open={isAddingShelter} onOpenChange={setIsAddingShelter}>
            <DialogTrigger asChild>
              <Button className="gradient-lilac hover:opacity-90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add New Shelter
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>Add New Shelter</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sname">Shelter Name</Label>
                  <Input
                    id="sname"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={newShelter.sname}
                    onChange={(e) => setNewShelter({ ...newShelter, sname: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="semail">Email</Label>
                  <Input
                    id="semail"
                    type="email"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={newShelter.semail}
                    onChange={(e) => setNewShelter({ ...newShelter, semail: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="sphno">Phone</Label>
                  <Input
                    id="sphno"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={newShelter.sphno}
                    onChange={(e) => setNewShelter({ ...newShelter, sphno: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="saddress">Address</Label>
                  <Input
                    id="saddress"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={newShelter.saddress}
                    onChange={(e) => setNewShelter({ ...newShelter, saddress: e.target.value })}
                  />
                </div>
                <div className="flex gap-4">
                  <Button onClick={handleAddShelter} className="flex-1 gradient-lilac hover:opacity-90 text-white">
                    Add Shelter
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingShelter(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shelters.map((shelter, index) => (
            <Card
              key={shelter.sid}
              className="card-hover bg-gray-800 border-gray-700 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-purple-400" />
                      {shelter.sname}
                    </CardTitle>
                    <Badge variant="secondary" className="mt-2 bg-purple-600/20 text-purple-300">
                      ID: {shelter.sid}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-purple-400 hover:text-purple-300"
                    onClick={() => setEditingShelter(shelter)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:text-red-300"
                    onClick={() => handleDeleteShelter(shelter.sid)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{shelter.semail}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{shelter.sphno}</span>
                </div>
                <div className="flex items-start gap-2 text-gray-300">
                  <MapPin className="w-4 h-4 mt-1" />
                  <span className="text-sm">{shelter.saddress}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editingShelter} onOpenChange={() => setEditingShelter(null)}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Edit Shelter</DialogTitle>
            </DialogHeader>
            {editingShelter && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-sname">Shelter Name</Label>
                  <Input
                    id="edit-sname"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={editingShelter.sname}
                    onChange={(e) => setEditingShelter({ ...editingShelter, sname: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-semail">Email</Label>
                  <Input
                    id="edit-semail"
                    type="email"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={editingShelter.semail}
                    onChange={(e) => setEditingShelter({ ...editingShelter, semail: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-sphno">Phone</Label>
                  <Input
                    id="edit-sphno"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={editingShelter.sphno}
                    onChange={(e) => setEditingShelter({ ...editingShelter, sphno: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-saddress">Address</Label>
                  <Input
                    id="edit-saddress"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={editingShelter.saddress}
                    onChange={(e) => setEditingShelter({ ...editingShelter, saddress: e.target.value })}
                  />
                </div>
                <div className="flex gap-4">
                  <Button onClick={handleUpdateShelter} className="flex-1 gradient-lilac hover:opacity-90 text-white">
                    Update Shelter
                  </Button>
                  <Button variant="outline" onClick={() => setEditingShelter(null)} className="flex-1">
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
