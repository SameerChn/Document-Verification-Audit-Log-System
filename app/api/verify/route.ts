import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { requireAuth } from "@/lib/auth-middleware"

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

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
          uploadedBy: document.uploadedBy,
        },
        verifiedBy: {
          email: user.email,
          name: user.name,
          role: user.role,
        },
      })
    }

    return NextResponse.json({
      verified: false,
      verifiedBy: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes("required")) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    console.error("Error verifying document:", error)
    return NextResponse.json({ error: "Failed to verify document" }, { status: 500 })
  }
}
