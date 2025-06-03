import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

// GET - View shelter details
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const shelter = await executeQuery("SELECT * FROM Shelter WHERE sid = ?", [params.id])

    if (!Array.isArray(shelter) || shelter.length === 0) {
      return NextResponse.json({ error: "Shelter not found" }, { status: 404 })
    }

    return NextResponse.json(shelter[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch shelter" }, { status: 500 })
  }
}

// PUT - Update shelter info
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { sname, saddress, sphno, semail } = await request.json()

    await executeQuery("UPDATE Shelter SET sname = ?, saddress = ?, sphno = ?, semail = ? WHERE sid = ?", [
      sname,
      saddress,
      sphno,
      semail,
      params.id,
    ])

    return NextResponse.json({ message: "Shelter updated successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update shelter" }, { status: 500 })
  }
}

// DELETE - Delete shelter
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if shelter has pets
    const pets = await executeQuery("SELECT * FROM Pets WHERE sid = ?", [params.id])

    if (Array.isArray(pets) && pets.length > 0) {
      // Delete all medical records for pets in this shelter
      await executeQuery("DELETE FROM PetMedicalRecord WHERE pid IN (SELECT pid FROM Pets WHERE sid = ?)", [params.id])

      // Delete all adoption records for pets in this shelter
      await executeQuery("DELETE FROM AdoptionRecord WHERE pid IN (SELECT pid FROM Pets WHERE sid = ?)", [params.id])

      // Delete all pets in this shelter
      await executeQuery("DELETE FROM Pets WHERE sid = ?", [params.id])
    }

    // Delete the shelter
    await executeQuery("DELETE FROM Shelter WHERE sid = ?", [params.id])

    return NextResponse.json({ message: "Shelter deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete shelter" }, { status: 500 })
  }
}
