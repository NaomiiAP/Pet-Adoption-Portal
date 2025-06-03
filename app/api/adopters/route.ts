import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

// GET - List all adopters
export async function GET() {
  try {
    const adopters = await executeQuery("SELECT * FROM Adopter ORDER BY aid DESC")
    return NextResponse.json(adopters)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch adopters" }, { status: 500 })
  }
}

// POST - Register new adopter
export async function POST(request: NextRequest) {
  try {
    const { fname, aemail, aphno, aaddress, account } = await request.json()

    const result = await executeQuery(
      "INSERT INTO Adopter (fname, aemail, aphno, aaddress, account) VALUES (?, ?, ?, ?, ?)",
      [fname, aemail, aphno, aaddress, account],
    )

    return NextResponse.json({ message: "Adopter registered successfully", result })
  } catch (error) {
    return NextResponse.json({ error: "Failed to register adopter" }, { status: 500 })
  }
}
