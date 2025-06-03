import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

// GET - View pet details
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pet = await executeQuery(
      `
      SELECT p.*, s.sname as shelter_name, s.sphno as shelter_phone, s.semail as shelter_email
      FROM Pets p 
      LEFT JOIN Shelter s ON p.sid = s.sid 
      WHERE p.pid = ?
    `,
      [params.id],
    )

    if (!Array.isArray(pet) || pet.length === 0) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 })
    }

    return NextResponse.json(pet[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pet" }, { status: 500 })
  }
}

// PUT - Update pet details
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { pname, species, gender, age, adoptionstatus, imageurl } = await request.json()

    await executeQuery(
      "UPDATE Pets SET pname = ?, species = ?, gender = ?, age = ?, adoptionstatus = ?, imageurl = ? WHERE pid = ?",
      [pname, species, gender, age, adoptionstatus, imageurl, params.id],
    )

    return NextResponse.json({ message: "Pet updated successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update pet" }, { status: 500 })
  }
}

// DELETE - Delete pet entry
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if pet is adopted
    const pet = await executeQuery("SELECT adoptionstatus FROM Pets WHERE pid = ?", [params.id])

    if (Array.isArray(pet) && pet.length > 0 && (pet[0] as any).adoptionstatus === "adopted") {
      return NextResponse.json({ error: "Cannot delete adopted pet" }, { status: 400 })
    }

    // Delete medical records first
    await executeQuery("DELETE FROM PetMedicalRecord WHERE pid = ?", [params.id])

    // Delete pet
    await executeQuery("DELETE FROM Pets WHERE pid = ?", [params.id])

    return NextResponse.json({ message: "Pet deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete pet" }, { status: 500 })
  }
}
