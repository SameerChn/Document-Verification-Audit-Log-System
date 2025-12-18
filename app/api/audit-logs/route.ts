import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import type { AuditLog } from "@/lib/types"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const logs = await db.collection("audit_logs").find({}).sort({ timestamp: -1 }).limit(50).toArray()

    return NextResponse.json(logs)
  } catch (error) {
    console.error("Error fetching audit logs:", error)
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const log: AuditLog = await request.json()
    const { db } = await connectToDatabase()

    await db.collection("audit_logs").insertOne(log)

    return NextResponse.json({ success: true, log })
  } catch (error) {
    console.error("Error saving audit log:", error)
    return NextResponse.json({ error: "Failed to save audit log" }, { status: 500 })
  }
}
