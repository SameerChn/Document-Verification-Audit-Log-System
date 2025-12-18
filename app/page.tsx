"use client"

import { useState, useEffect } from "react"
import { Shield, FileCheck } from "lucide-react"
import { DocumentUpload } from "@/components/document-upload"
import { DocumentVerify } from "@/components/document-verify"
import { AuditLogs } from "@/components/audit-logs"
import { DocumentList } from "@/components/document-list"
import type { DocumentRecord, AuditLog } from "@/lib/types"

export default function Page() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])

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

  useEffect(() => {
    refreshData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 text-balance">Document Verification System</h1>
          <p className="text-muted-foreground text-lg text-balance max-w-2xl mx-auto">
            Ensure document integrity with cryptographic hash verification and comprehensive audit trails
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <DocumentUpload onUploadComplete={refreshData} />
          <DocumentVerify onVerifyComplete={refreshData} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <DocumentList documents={documents} />
          <AuditLogs logs={auditLogs} />
        </div>

        {/* Info Footer */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg border">
          <div className="flex items-start gap-3">
            <FileCheck className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium mb-1">How It Works</p>
              <p className="text-xs text-muted-foreground">
                Each document generates a unique SHA-256 cryptographic hash. This hash acts as a digital fingerprint -
                even the smallest change to the document will produce a completely different hash, making tampering
                immediately detectable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
