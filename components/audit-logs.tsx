"use client"

import { FileText, CheckCircle2, XCircle, Upload, User } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { AuditLog } from "@/lib/types"

interface AuditLogsProps {
  logs: AuditLog[]
}

export function AuditLogs({ logs }: AuditLogsProps) {
  const getIcon = (action: AuditLog["action"]) => {
    switch (action) {
      case "upload":
        return <Upload className="h-4 w-4" />
      case "verify_success":
        return <CheckCircle2 className="h-4 w-4" />
      case "verify_fail":
        return <XCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: AuditLog["status"]) => {
    switch (status) {
      case "success":
        return "text-green-600 dark:text-green-400 bg-green-500/10"
      case "error":
        return "text-destructive bg-destructive/10"
      case "warning":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date)
  }

  const getActionLabel = (action: AuditLog["action"]) => {
    switch (action) {
      case "upload":
        return "Uploaded"
      case "verify_success":
        return "Verified (Match)"
      case "verify_fail":
        return "Verified (No Match)"
    }
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-1">Audit Logs</h2>
        <p className="text-sm text-muted-foreground">Complete history of all document operations</p>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No audit logs yet</p>
          <p className="text-xs text-muted-foreground mt-1">Upload or verify documents to see activity here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${getStatusColor(log.status)}`}>{getIcon(log.action)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-medium">{log.documentName}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatTimestamp(log.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{log.message}</p>
                  {log.user && (
                    <div className="flex items-center gap-2 text-xs bg-muted/50 rounded-md px-2 py-1.5 mt-2">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        <span className="font-medium">{getActionLabel(log.action)}</span> by {log.user.name} (
                        {log.user.email}) • <span className="uppercase text-[10px]">{log.user.role}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
