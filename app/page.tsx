"use client"

import { useState, useEffect } from "react"
import { Shield, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthForm } from "@/components/auth-form"
import { DocumentUpload } from "@/components/document-upload"
import { DocumentVerify } from "@/components/document-verify"
import { AuditLogs } from "@/components/audit-logs"
import { DocumentList } from "@/components/document-list"
import type { DocumentRecord, AuditLog, User } from "@/lib/types"

export default function Page() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [documents, setDocuments] = useState<DocumentRecord[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshData = async () => {
    try {
      const [docsResponse, logsResponse] = await Promise.all([fetch("/api/documents"), fetch("/api/audit-logs")])

      const docs = await docsResponse.json()
      const logs = await logsResponse.json()

      setDocuments(docs)
      setAuditLogs(logs)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      refreshData()
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm onSuccess={checkAuth} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with user info and logout */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Document Verification System</h1>
              <p className="text-sm text-muted-foreground">
                Welcome, {user.name} ({user.role})
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {user.role === "admin" ? (
          <>
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <DocumentUpload onUploadComplete={refreshData} />
              <DocumentVerify onVerifyComplete={refreshData} />
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <DocumentList documents={documents} />
              <AuditLogs logs={auditLogs} />
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <DocumentVerify onVerifyComplete={refreshData} />
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <DocumentList documents={documents} />
              <AuditLogs logs={auditLogs} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
