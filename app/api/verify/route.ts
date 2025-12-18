import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const { hash } = await request.json()
    const { db } = await connectToDatabase()

    const document = await db.collection("documents").findOne({ hash })

    if (document) {
      return NextResponse.json({
        verified: true,
        document: {
          id: document.id,
          name: document.name,
          uploadedAt: document.uploadedAt,
        },
      })
    }

    return NextResponse.json({ verified: false })
  } catch (error) {
    console.error("Error verifying document:", error)
    return NextResponse.json({ error: "Failed to verify document" }, { status: 500 })
  }
}
