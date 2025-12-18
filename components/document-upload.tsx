"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { generateFileHash, formatFileSize } from "@/lib/crypto-utils"
import type { DocumentRecord, AuditLog } from "@/lib/types"

interface DocumentUploadProps {
  onUploadComplete: () => void
}

export function DocumentUpload({ onUploadComplete }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedDoc, setUploadedDoc] = useState<DocumentRecord | null>(null)

  const handleFile = async (file: File) => {
    setIsProcessing(true)
    setUploadedDoc(null)

    try {
      const hash = await generateFileHash(file)
      const doc: DocumentRecord = {
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        hash,
        uploadedAt: new Date().toISOString(),
      }

      const docResponse = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doc),
      })

      if (!docResponse.ok) {
        const error = await docResponse.json()
        throw new Error(error.error || "Failed to upload document")
      }

      const { document: savedDoc } = await docResponse.json()

      const auditLog: AuditLog = {
        id: crypto.randomUUID(),
        action: "upload",
        documentName: file.name,
        hash,
        timestamp: new Date().toISOString(),
        status: "success",
        message: `Document uploaded successfully by admin`,
      }

      await fetch("/api/audit-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(auditLog),
      })

      setUploadedDoc(savedDoc)
      onUploadComplete()
    } catch (error) {
      console.error("Error processing file:", error)
      alert(error instanceof Error ? error.message : "Failed to upload document")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-1">Upload Document</h2>
        <p className="text-sm text-muted-foreground">Upload a document to generate its cryptographic hash</p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        }`}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-4">Drag and drop a file here, or click to browse</p>
        <Button asChild variant="outline" disabled={isProcessing}>
          <label className="cursor-pointer">
            {isProcessing ? "Processing..." : "Select File"}
            <input type="file" className="hidden" onChange={handleFileInput} disabled={isProcessing} />
          </label>
        </Button>
      </div>

      {uploadedDoc && (
        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium mb-1">Document Uploaded Successfully</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{uploadedDoc.name}</span>
                  <span className="text-xs text-muted-foreground">({formatFileSize(uploadedDoc.size)})</span>
                </div>
                <div className="bg-background p-3 rounded border">
                  <p className="text-xs text-muted-foreground">Document hash has been securely generated and stored</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
