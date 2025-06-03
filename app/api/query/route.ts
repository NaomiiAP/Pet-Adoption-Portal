import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "No query provided" }, { status: 400 })
    }

    // Prevent certain dangerous operations
    const lowerQuery = query.toLowerCase()
    if (
      lowerQuery.includes("drop table") ||
      lowerQuery.includes("drop database") ||
      lowerQuery.includes("truncate table")
    ) {
      return NextResponse.json({ error: "Dangerous operations like DROP TABLE are not allowed" }, { status: 403 })
    }

    const results = await executeQuery(query)

    // Check if it's a SELECT query (returns rows) or a modification query (returns info about affected rows)
    if (Array.isArray(results)) {
      return NextResponse.json({ results })
    } else {
      return NextResponse.json({
        affectedRows: (results as any).affectedRows || 0,
        message: "Query executed successfully",
      })
    }
  } catch (error: any) {
    console.error("Query execution error:", error)
    return NextResponse.json({ error: error.message || "Failed to execute query" }, { status: 500 })
  }
}
