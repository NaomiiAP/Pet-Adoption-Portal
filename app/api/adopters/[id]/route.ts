import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

// GET - View adopter profile
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adopter = await executeQuery("SELECT * FROM Adopter WHERE aid = ?", [params.id])

    if (!Array.isArray(adopter) || adopter.length === 0) {
      return NextResponse.json({ error: "Adopter not found" }, { status: 404 })
    }

    return NextResponse.json(adopter[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch adopter" }, { status: 500 })
  }
}

// PUT - Update adopter details
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { fname, aemail, aphno, aaddress, account } = await request.json()

    await executeQuery("UPDATE Adopter SET fname = ?, aemail = ?, aphno = ?, aaddress = ?, account = ? WHERE aid = ?", [
      fname,
      aemail,
      aphno,
      aaddress,
      account,
      params.id,
    ])

    return NextResponse.json({ message: "Adopter updated successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update adopter" }, { status: 500 })
  }
}

// DELETE - Delete adopter account
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if adopter has active adoptions
    const adoptions = await executeQuery("SELECT * FROM AdoptionRecord WHERE aid = ?", [params.id])

    if (Array.isArray(adoptions) && adoptions.length > 0) {
      return NextResponse.json({ error: "Cannot delete adopter with active adoptions" }, { status: 400 })
    }

    await executeQuery("DELETE FROM Adopter WHERE aid = ?", [params.id])
    return NextResponse.json({ message: "Adopter deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete adopter" }, { status: 500 })
  }
}
