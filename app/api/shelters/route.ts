import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

// GET - List all shelters
export async function GET() {
  try {
    const shelters = await executeQuery("SELECT * FROM Shelter ORDER BY sid DESC")
    return NextResponse.json(shelters)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch shelters" }, { status: 500 })
  }
}

// POST - Register new shelter
export async function POST(request: NextRequest) {
  try {
    const { sname, saddress, sphno, semail } = await request.json()

    const result = await executeQuery("INSERT INTO Shelter (sname, saddress, sphno, semail) VALUES (?, ?, ?, ?)", [
      sname,
      saddress,
      sphno,
      semail,
    ])

    return NextResponse.json({ message: "Shelter registered successfully", result })
  } catch (error) {
    return NextResponse.json({ error: "Failed to register shelter" }, { status: 500 })
  }
}
