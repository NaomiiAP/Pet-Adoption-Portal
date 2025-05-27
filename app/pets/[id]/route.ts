import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pet = await prisma.pet.findUnique({
      where: { id: Number(params.id) },
    })

    if (!pet) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 })
    }

    return NextResponse.json(pet)
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
