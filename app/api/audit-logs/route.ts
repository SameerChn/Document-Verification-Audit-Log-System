import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getCurrentUser, requireAuth } from "@/lib/auth-middleware"
import type { AuditLog } from "@/lib/types"

export async function GET() {
  try {
    const user = await requireAuth()
    const { db } = await connectToDatabase()

    // Admins can see all logs, regular users only see their own activity
    const query =
      user.role === "admin"
        ? {}
        : {
            "user.email": user.email,
          }

    const logs = await db.collection("audit_logs").find(query).sort({ timestamp: -1 }).limit(50).toArray()

    return NextResponse.json(logs)
  } catch (error) {
    if (error instanceof Error && error.message.includes("required")) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    console.error("Error fetching audit logs:", error)
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    const log: AuditLog = await request.json()
    const { db } = await connectToDatabase()

    const logWithUser = {
      ...log,
      user: user
        ? {
            email: user.email,
            name: user.name,
            role: user.role,
          }
        : undefined,
    }

    await db.collection("audit_logs").insertOne(logWithUser)

    return NextResponse.json({ success: true, log: logWithUser })
  } catch (error) {
    console.error("Error saving audit log:", error)
    return NextResponse.json({ error: "Failed to save audit log" }, { status: 500 })
  }
}
