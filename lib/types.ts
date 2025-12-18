export interface DocumentRecord {
  id: string
  name: string
  size: number
  type: string
  hash: string
  uploadedAt: string
}

export interface AuditLog {
  id: string
  action: "upload" | "verify_success" | "verify_fail"
  documentName: string
  hash: string
  timestamp: string
  status: "success" | "warning" | "error"
  message: string
}
