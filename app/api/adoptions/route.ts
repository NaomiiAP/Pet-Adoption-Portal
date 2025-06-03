import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

// GET - View adoption records
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adopterId = searchParams.get("adopterId")
    const shelterId = searchParams.get("shelterId")

    let query = `
      SELECT ar.*, a.fname as adopter_name, p.pname as pet_name, s.sname as shelter_name
      FROM AdoptionRecord ar
      LEFT JOIN Adopter a ON ar.aid = a.aid
      LEFT JOIN Pets p ON ar.pid = p.pid
      LEFT JOIN Shelter s ON ar.sid = s.sid
      WHERE 1=1
    `
    const params: any[] = []

    if (adopterId) {
      query += " AND ar.aid = ?"
      params.push(adopterId)
    }

    if (shelterId) {
      query += " AND ar.sid = ?"
      params.push(shelterId)
    }

    query += " ORDER BY ar.adoptiondate DESC"

    const adoptions = await executeQuery(query, params)
    return NextResponse.json(adoptions)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch adoption records" }, { status: 500 })
  }
}

// POST - Adopt pet
export async function POST(request: NextRequest) {
  try {
    const { aid, pid, sid, notes } = await request.json()

    // Check if pet is available
    const pet = await executeQuery("SELECT adoptionstatus FROM Pets WHERE pid = ?", [pid])

    if (!Array.isArray(pet) || pet.length === 0) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 })
    }

    if ((pet[0] as any).adoptionstatus !== "available") {
      return NextResponse.json({ error: "Pet is not available for adoption" }, { status: 400 })
    }

    // Create adoption record
    await executeQuery(
      "INSERT INTO AdoptionRecord (aid, pid, sid, adoptiondate, notes) VALUES (?, ?, ?, CURDATE(), ?)",
      [aid, pid, sid, notes],
    )

    // Update pet status
    await executeQuery("UPDATE Pets SET adoptionstatus = ? WHERE pid = ?", ["adopted", pid])

    return NextResponse.json({ message: "Pet adopted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process adoption" }, { status: 500 })
  }
}
