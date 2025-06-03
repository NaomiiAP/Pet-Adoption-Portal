import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

// DELETE - Cancel adoption
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get adoption record details
    const adoption = await executeQuery("SELECT pid FROM AdoptionRecord WHERE rid = ?", [params.id])

    if (!Array.isArray(adoption) || adoption.length === 0) {
      return NextResponse.json({ error: "Adoption record not found" }, { status: 404 })
    }

    const petId = (adoption[0] as any).pid

    // Delete adoption record
    await executeQuery("DELETE FROM AdoptionRecord WHERE rid = ?", [params.id])

    // Update pet status back to available
    await executeQuery("UPDATE Pets SET adoptionstatus = ? WHERE pid = ?", ["available", petId])

    return NextResponse.json({ message: "Adoption cancelled successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to cancel adoption" }, { status: 500 })
  }
}
