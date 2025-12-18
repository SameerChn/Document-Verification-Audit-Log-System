"use client"

import type React from "react"

import { useState } from "react"
import { Shield, Upload, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { generateFileHash } from "@/lib/crypto-utils"
import type { AuditLog } from "@/lib/types"

interface DocumentVerifyProps {
  onVerifyComplete: () => void
}

export function DocumentVerify({ onVerifyComplete }: DocumentVerifyProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<{
    status: "success" | "error" | "warning"
    message: string
    fileName?: string
    uploadedBy?: { email: string; name: string }
  } | null>(null)

  const handleFileVerify = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsVerifying(true)
    setVerificationResult(null)

    try {
      const hash = await generateFileHash(file)

      const verifyResponse = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hash }),
      })

      if (!verifyResponse.ok) {
        throw new Error("Verification failed")
      }

      const { verified, document, verifiedBy } = await verifyResponse.json()

      let auditLog: AuditLog

      if (verified) {
        setVerificationResult({
          status: "success",
          message: "Document verified successfully! Hash matches the original.",
          fileName: document.name,
          uploadedBy: document.uploadedBy,
        })

        auditLog = {
          id: crypto.randomUUID(),
          action: "verify_success",
          documentName: file.name,
          hash,
          timestamp: new Date().toISOString(),
          status: "success",
          message: `Document integrity verified - matches ${document.name}`,
        }
      } else {
        setVerificationResult({
          status: "error",
          message: "Verification failed! This document is not in our records or has been modified.",
        })

        auditLog = {
          id: crypto.randomUUID(),
          action: "verify_fail",
          documentName: file.name,
          hash,
          timestamp: new Date().toISOString(),
          status: "error",
          message: "Document verification failed - hash not found in records",
        }
      }

      await fetch("/api/audit-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(auditLog),
      })

      onVerifyComplete()
    } catch (error) {
      console.error("Error verifying file:", error)
      setVerificationResult({
        status: "error",
        message: "An error occurred during verification. Please make sure you're logged in.",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-1">Verify Document</h2>
        <p className="text-sm text-muted-foreground">Upload a document to verify its integrity against stored hashes</p>
      </div>

      <div className="border-2 border-dashed rounded-lg p-12 text-center border-border hover:border-primary/50 transition-colors">
        <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-4">Select a document to verify its integrity</p>
        <Button asChild variant="default" disabled={isVerifying}>
          <label className="cursor-pointer">
            <Upload className="mr-2 h-4 w-4" />
            {isVerifying ? "Verifying..." : "Verify Document"}
            <input type="file" className="hidden" onChange={handleFileVerify} disabled={isVerifying} />
          </label>
        </Button>
      </div>

      {verificationResult && (
        <div
          className={`mt-6 p-4 rounded-lg border ${
            verificationResult.status === "success"
              ? "bg-green-500/10 border-green-500/30"
              : verificationResult.status === "error"
                ? "bg-destructive/10 border-destructive/30"
                : "bg-yellow-500/10 border-yellow-500/30"
          }`}
        >
          <div className="flex items-start gap-3">
            {verificationResult.status === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
            ) : verificationResult.status === "error" ? (
              <XCircle className="h-5 w-5 text-destructive mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium mb-1">{verificationResult.message}</p>
              {verificationResult.fileName && (
                <p className="text-sm text-muted-foreground mb-1">Original: {verificationResult.fileName}</p>
              )}
              {verificationResult.uploadedBy && (
                <p className="text-xs text-muted-foreground">
                  Uploaded by: {verificationResult.uploadedBy.name} ({verificationResult.uploadedBy.email})
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
