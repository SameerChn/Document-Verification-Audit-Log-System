import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import type { DocumentRecord } from "@/lib/types"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const documents = await db.collection("documents").find({}).sort({ uploadedAt: -1 }).toArray()

    return NextResponse.json(documents)
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const document: DocumentRecord = await request.json()
    const { db } = await connectToDatabase()

    await db.collection("documents").insertOne(document)

    return NextResponse.json({ success: true, document })
  } catch (error) {
    console.error("Error saving document:", error)
    return NextResponse.json({ error: "Failed to save document" }, { status: 500 })
  }
}
