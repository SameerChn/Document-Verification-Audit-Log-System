import type { DocumentRecord, AuditLog } from "./types"

const DOCUMENTS_KEY = "doc_verification_documents"
const AUDIT_LOGS_KEY = "doc_verification_audit_logs"

export function getStoredDocuments(): DocumentRecord[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(DOCUMENTS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveDocument(doc: DocumentRecord): void {
  const docs = getStoredDocuments()
  docs.push(doc)
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(docs))
}

export function getAuditLogs(): AuditLog[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(AUDIT_LOGS_KEY)
  return data ? JSON.parse(data) : []
}

export function addAuditLog(log: AuditLog): void {
  const logs = getAuditLogs()
  logs.unshift(log) // Add to beginning for most recent first
  localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(logs))
}
