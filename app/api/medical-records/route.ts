import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

// GET - View medical history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const petId = searchParams.get("petId")

    let query = `
      SELECT mr.*, p.pname as pet_name
      FROM PetMedicalRecord mr
      LEFT JOIN Pets p ON mr.pid = p.pid
    `
    const params: any[] = []

    if (petId) {
      query += " WHERE mr.pid = ?"
      params.push(petId)
    }

    query += " ORDER BY mr.checkupdate DESC"

    const records = await executeQuery(query, params)
    return NextResponse.json(records)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch medical records" }, { status: 500 })
  }
}

// POST - Add medical record
export async function POST(request: NextRequest) {
  try {
    const { pid, checkupdate, condition, treatment, vetname } = await request.json()

    const result = await executeQuery(
      "INSERT INTO PetMedicalRecord (pid, checkupdate, condition, treatment, vetname) VALUES (?, ?, ?, ?, ?)",
      [pid, checkupdate, condition, treatment, vetname],
    )

    return NextResponse.json({ message: "Medical record added successfully", result })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add medical record" }, { status: 500 })
  }
}
