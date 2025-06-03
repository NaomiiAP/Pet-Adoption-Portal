"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, User, Mail, Phone, MapPin } from "lucide-react"

interface Adopter {
  aid: number
  fname: string
  aemail: string
  aphno: string
  aaddress: string
  account: string
}

export default function AdoptersPage() {
  const [adopters, setAdopters] = useState<Adopter[]>([])
  const [isAddingAdopter, setIsAddingAdopter] = useState(false)
  const [editingAdopter, setEditingAdopter] = useState<Adopter | null>(null)
  const [newAdopter, setNewAdopter] = useState({
    fname: "",
    aemail: "",
    aphno: "",
    aaddress: "",
    account: "",
  })

  useEffect(() => {
    fetchAdopters()
  }, [])

  const fetchAdopters = async () => {
    try {
      const response = await fetch("/api/adopters")
      const data = await response.json()
      setAdopters(data)
    } catch (error) {
      console.error("Failed to fetch adopters:", error)
    }
  }

  const handleAddAdopter = async () => {
    try {
      const response = await fetch("/api/adopters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdopter),
      })

      if (response.ok) {
        setNewAdopter({ fname: "", aemail: "", aphno: "", aaddress: "", account: "" })
        setIsAddingAdopter(false)
        fetchAdopters()
        alert("Adopter added successfully!")
      }
    } catch (error) {
      console.error("Failed to add adopter:", error)
    }
  }

  const handleUpdateAdopter = async () => {
    if (!editingAdopter) return

    try {
      const response = await fetch(`/api/adopters/${editingAdopter.aid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingAdopter),
      })

      if (response.ok) {
        setEditingAdopter(null)
        fetchAdopters()
        alert("Adopter updated successfully!")
      }
    } catch (error) {
      console.error("Failed to update adopter:", error)
    }
  }

  const handleDeleteAdopter = async (aid: number) => {
    if (!confirm("Are you sure you want to delete this adopter?")) return

    try {
      const response = await fetch(`/api/adopters/${aid}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchAdopters()
        alert("Adopter deleted successfully!")
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      console.error("Failed to delete adopter:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-4">Adopter Management</h1>
          <p className="text-xl text-gray-300">Manage adopter registrations and profiles</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">All Adopters</h2>

          <Dialog open={isAddingAdopter} onOpenChange={setIsAddingAdopter}>
            <DialogTrigger asChild>
              <Button className="gradient-lilac hover:opacity-90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add New Adopter
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>Add New Adopter</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fname">Full Name</Label>
                  <Input
                    id="fname"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={newAdopter.fname}
                    onChange={(e) => setNewAdopter({ ...newAdopter, fname: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="aemail">Email</Label>
                  <Input
                    id="aemail"
                    type="email"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={newAdopter.aemail}
                    onChange={(e) => setNewAdopter({ ...newAdopter, aemail: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="aphno">Phone</Label>
                  <Input
                    id="aphno"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={newAdopter.aphno}
                    onChange={(e) => setNewAdopter({ ...newAdopter, aphno: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="aaddress">Address</Label>
                  <Input
                    id="aaddress"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={newAdopter.aaddress}
                    onChange={(e) => setNewAdopter({ ...newAdopter, aaddress: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="account">Account Info</Label>
                  <Input
                    id="account"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={newAdopter.account}
                    onChange={(e) => setNewAdopter({ ...newAdopter, account: e.target.value })}
                  />
                </div>
                <div className="flex gap-4">
                  <Button onClick={handleAddAdopter} className="flex-1 gradient-lilac hover:opacity-90 text-white">
                    Add Adopter
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingAdopter(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adopters.map((adopter, index) => (
            <Card
              key={adopter.aid}
              className="card-hover bg-gray-800 border-gray-700 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-400" />
                      {adopter.fname}
                    </CardTitle>
                    <Badge variant="secondary" className="mt-2 bg-purple-600/20 text-purple-300">
                      ID: {adopter.aid}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-purple-400 hover:text-purple-300"
                      onClick={() => setEditingAdopter(adopter)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400 hover:text-red-300"
                      onClick={() => handleDeleteAdopter(adopter.aid)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{adopter.aemail}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{adopter.aphno}</span>
                </div>
                <div className="flex items-start gap-2 text-gray-300">
                  <MapPin className="w-4 h-4 mt-1" />
                  <span className="text-sm">{adopter.aaddress}</span>
                </div>
                {adopter.account && (
                  <div className="text-gray-400 text-sm">
                    <strong>Account:</strong> {adopter.account}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editingAdopter} onOpenChange={() => setEditingAdopter(null)}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Edit Adopter</DialogTitle>
            </DialogHeader>
            {editingAdopter && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-fname">Full Name</Label>
                  <Input
                    id="edit-fname"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={editingAdopter.fname}
                    onChange={(e) => setEditingAdopter({ ...editingAdopter, fname: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-aemail">Email</Label>
                  <Input
                    id="edit-aemail"
                    type="email"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={editingAdopter.aemail}
                    onChange={(e) => setEditingAdopter({ ...editingAdopter, aemail: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-aphno">Phone</Label>
                  <Input
                    id="edit-aphno"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={editingAdopter.aphno}
                    onChange={(e) => setEditingAdopter({ ...editingAdopter, aphno: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-aaddress">Address</Label>
                  <Input
                    id="edit-aaddress"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={editingAdopter.aaddress}
                    onChange={(e) => setEditingAdopter({ ...editingAdopter, aaddress: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-account">Account Info</Label>
                  <Input
                    id="edit-account"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={editingAdopter.account}
                    onChange={(e) => setEditingAdopter({ ...editingAdopter, account: e.target.value })}
                  />
                </div>
                <div className="flex gap-4">
                  <Button onClick={handleUpdateAdopter} className="flex-1 gradient-lilac hover:opacity-90 text-white">
                    Update Adopter
                  </Button>
                  <Button variant="outline" onClick={() => setEditingAdopter(null)} className="flex-1">
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
