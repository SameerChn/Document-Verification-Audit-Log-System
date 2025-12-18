"use client"

import { FileText, Calendar, User } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { DocumentRecord } from "@/lib/types"
import { formatFileSize } from "@/lib/crypto-utils"

interface DocumentListProps {
  documents: DocumentRecord[]
}

export function DocumentList({ documents }: DocumentListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-1">Stored Documents</h2>
        <p className="text-sm text-muted-foreground">
          {documents.length} {documents.length === 1 ? "document" : "documents"} in the registry
        </p>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No documents stored yet</p>
          <p className="text-xs text-muted-foreground mt-1">Upload a document to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{formatFileSize(doc.size)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(doc.uploadedAt)}</span>
                  </div>
                  {doc.uploadedBy && (
                    <div className="flex items-center gap-2 text-xs bg-muted/50 rounded-md px-2 py-1.5 mb-2">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Uploaded by {doc.uploadedBy.name} ({doc.uploadedBy.email})
                      </span>
                    </div>
                  )}
                  <div className="bg-muted/50 p-2 rounded">
                    <p className="text-xs text-muted-foreground">Document hash stored securely</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
