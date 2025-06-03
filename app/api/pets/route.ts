import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

// GET - View all pets with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const species = searchParams.get("species")
    const gender = searchParams.get("gender")
    const status = searchParams.get("status")
    const shelterId = searchParams.get("shelterId")

    let query = `
      SELECT p.*, s.sname as shelter_name 
      FROM Pets p 
      LEFT JOIN Shelter s ON p.sid = s.sid 
      WHERE 1=1
    `
    const params: any[] = []

    if (species && species !== "all") {
      query += " AND p.species = ?"
      params.push(species)
    }

    if (gender && gender !== "all") {
      query += " AND p.gender = ?"
      params.push(gender)
    }

    if (status && status !== "all") {
      query += " AND p.adoptionstatus = ?"
      params.push(status)
    }

    if (shelterId) {
      query += " AND p.sid = ?"
      params.push(shelterId)
    }

    query += " ORDER BY p.pid DESC"

    const pets = await executeQuery(query, params)
    return NextResponse.json(pets)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pets" }, { status: 500 })
  }
}

// POST - Add new pet
export async function POST(request: NextRequest) {
  try {
    const { pname, species, gender, age, adoptionstatus, imageurl, sid } = await request.json()

    const result = await executeQuery(
      "INSERT INTO Pets (pname, species, gender, age, adoptionstatus, imageurl, sid) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [pname, species, gender, age, adoptionstatus || "available", imageurl, sid],
    )

    return NextResponse.json({ message: "Pet added successfully", result })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add pet" }, { status: 500 })
  }
}
