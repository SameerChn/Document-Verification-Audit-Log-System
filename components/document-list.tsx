"use client"

import { FileText, Calendar, User, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { DocumentRecord } from "@/lib/types"
import { formatFileSize } from "@/lib/crypto-utils"
import { useState } from "react"

interface DocumentListProps {
  documents: DocumentRecord[]
  isAdmin?: boolean
  onDelete?: (id: string) => Promise<void>
}

export function DocumentList({ documents, isAdmin = false, onDelete }: DocumentListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

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

  const handleDelete = async (id: string) => {
    if (!onDelete) return
    if (!confirm("Are you sure you want to permanently delete this document?")) return

    setDeletingId(id)
    try {
      await onDelete(id)
    } catch (error) {
      console.error("Delete failed", error)
    } finally {
      setDeletingId(null)
    }
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
            <div key={doc.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors group">
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
                  <div className="flex items-center justify-between mt-2">
                    <div className="bg-muted/50 p-2 rounded inline-block">
                       <p className="text-xs text-muted-foreground">Document hash stored securely</p>
                    </div>
                    
                    {isAdmin && onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDelete(doc._id || doc.id)}
                        disabled={deletingId === (doc._id || doc.id)}
                        title="Delete document"
                      >
                         <Trash2 className="h-4 w-4" />
                         <span className="sr-only">Delete</span>
                      </Button>
                    )}
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
