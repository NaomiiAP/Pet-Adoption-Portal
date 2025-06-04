import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

// PUT - Update medical record
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { checkupdate, condition, treatment, vetname } = await request.json()

    await executeQuery(
      "UPDATE PetMedicalRecord SET checkupdate = ?, mcondition = ?, treatment = ?, vetname = ? WHERE mrid = ?",
      [checkupdate, condition, treatment, vetname, params.id],
    )

    return NextResponse.json({ message: "Medical record updated successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update medical record" }, { status: 500 })
  }
}

// DELETE - Delete medical record
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await executeQuery("DELETE FROM PetMedicalRecord WHERE mrid = ?", [params.id])
    return NextResponse.json({ message: "Medical record deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete medical record" }, { status: 500 })
  }
}
