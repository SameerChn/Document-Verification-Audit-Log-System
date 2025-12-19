import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { requireAdmin } from "@/lib/auth-middleware"
import { ObjectId } from "mongodb"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    
    // Await params specifically in Next.js 15+ if needed, but good practice now
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("documents").deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Document deleted successfully" })
  } catch (error) {
    console.error("Error deleting document:", error)
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 })
  }
}
