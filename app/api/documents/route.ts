import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { requireAdmin } from "@/lib/auth-middleware"
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
    const user = await requireAdmin()

    const document: DocumentRecord = await request.json()
    const { db } = await connectToDatabase()

    const documentWithUser = {
      ...document,
      uploadedBy: {
        email: user.email,
        name: user.name,
      },
    }

    await db.collection("documents").insertOne(documentWithUser)

    return NextResponse.json({ success: true, document: documentWithUser })
  } catch (error) {
    if (error instanceof Error && error.message.includes("required")) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    console.error("Error saving document:", error)
    return NextResponse.json({ error: "Failed to save document" }, { status: 500 })
  }
}
