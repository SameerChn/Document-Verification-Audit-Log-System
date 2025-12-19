export interface DocumentRecord {
  _id?: string
  id: string
  name: string
  size: number
  type: string
  hash: string
  uploadedAt: string
  uploadedBy?: {
    email: string
    name: string
  }
}

export interface AuditLog {
  id: string
  action: "upload" | "verify_success" | "verify_fail"
  documentName: string
  hash: string
  timestamp: string
  status: "success" | "warning" | "error"
  message: string
  user?: {
    email: string
    name: string
    role: "admin" | "user"
  }
}

export interface User {
  _id?: string
  email: string
  password?: string
  name: string
  role: "admin" | "user"
  createdAt: string
}
