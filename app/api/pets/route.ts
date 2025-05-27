import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  const pets = await prisma.pet.findMany({ orderBy: { addedDate: "desc" } })
  return Response.json(pets)
}

export async function POST(req: Request) {
  const body = await req.json()
  const pet = await prisma.pet.create({ data: body })
  return Response.json(pet)
}
