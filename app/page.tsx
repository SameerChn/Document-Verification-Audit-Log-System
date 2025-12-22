"use client"

import { useState, useEffect } from "react"
import { Shield, LogOut, Check, ArrowRight, Upload, Lock, Clock, FileText, Database, ChevronDown, Fingerprint, ArrowLeft } from "lucide-react"
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
  const [showLanding, setShowLanding] = useState(true)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [documents, setDocuments] = useState<DocumentRecord[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setShowLanding(false)
        return true
      }
      return false
    } catch (error) {
      console.error("Auth check failed:", error)
      return false
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
      setShowLanding(true)
      setIsLoginMode(true)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleBackToHome = () => {
    setUser(null)
    setShowLanding(true)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  // Re-check auth when navigating away from landing page if user is not set
  useEffect(() => {
    if (!showLanding && !user) {
      // Only check if we're not already loading
      if (!isLoading) {
        checkAuth()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLanding])

  useEffect(() => {
    if (user) {
      refreshData()
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 rounded-full border-2 border-black border-t-transparent animate-spin" />
      </div>
    )
  }

  // Landing Page
  if (showLanding && !user) {
    return (
      <div className="min-h-screen bg-white text-black font-sans selection:bg-emerald-100">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-8 flex items-center justify-between z-50 relative">
          <div className="flex items-center gap-2">
            <div className="bg-black text-white p-1.5 rounded-lg">
              <Shield className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">SecureVerify.</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={async () => {
                // Check if user is already authenticated before showing login
                const isAuthenticated = await checkAuth()
                if (!isAuthenticated) {
                  setIsLoginMode(true)
                  setShowLanding(false)
                }
              }}
              className="text-gray-500 hover:text-black hover:bg-transparent text-sm font-medium"
            >
              Log in
            </Button>
            <Button
              onClick={async () => {
                // Check if user is already authenticated before showing signup
                const isAuthenticated = await checkAuth()
                if (!isAuthenticated) {
                  setIsLoginMode(false)
                  setShowLanding(false)
                }
              }}
              className="bg-black text-white hover:bg-gray-800 rounded-full px-6 transition-transform active:scale-95"
            >
              Sign up
            </Button>
          </div>
        </nav>

        {/* Hero Section */}
        <main>
          <div className="container mx-auto px-6 pt-12 pb-24">
            <div className="max-w-4xl mx-auto text-center relative">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-10 w-20 h-20 bg-emerald-100 rounded-full blur-3xl opacity-50 -z-10" />
              <div className="absolute bottom-0 right-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10" />

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 text-sm font-medium text-gray-600 mb-8">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                New Standard for Verification
              </div>

              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.95]">
                Verify.<br />
                Secure.<br />
                <span className="text-emerald-600">Trust.</span>
              </h1>

              <p className="text-xl text-gray-500 max-w-lg mx-auto mb-12 leading-relaxed">
                The simplest way to secure your business documents. Drag, drop, and done.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={async () => {
                    // Check if user is already authenticated before showing login
                    const isAuthenticated = await checkAuth()
                    if (!isAuthenticated) {
                      setIsLoginMode(true)
                      setShowLanding(false)
                    }
                  }}
                  className="h-14 px-8 rounded-full bg-black text-white hover:bg-gray-800 text-lg shadow-xl shadow-black/5"
                >
                  Start Verifying
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Visual Showcase */}
            <div className="mt-24 max-w-5xl mx-auto">
              <div className="bg-gray-50 rounded-[2.5rem] p-12 md:p-20 border border-gray-100 overflow-hidden relative">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-50 rounded-full blur-3xl" />

                <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
                  <div className="space-y-8">
                    <h3 className="text-3xl font-bold tracking-tight">Built for speed & <br />security.</h3>
                    <div className="space-y-6">
                      {[
                        { icon: Upload, title: "Drag & Drop", desc: "Upload any file instantly." },
                        { icon: Lock, title: "SHA-256 Hashing", desc: "Military-grade encryption." },
                        { icon: Clock, title: "Real-time Log", desc: "Track every action." }
                      ].map((item, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm shrink-0">
                            <item.icon className="h-5 w-5 text-black" />
                          </div>
                          <div>
                            <div className="font-bold">{item.title}</div>
                            <div className="text-sm text-gray-500">{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mock Card */}
                  <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-gray-200/50 border border-gray-100 rotate-2 hover:rotate-0 transition-transform duration-500">
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
                          <Check className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm">Document Verified</div>
                          <div className="text-xs text-emerald-600 font-medium">Authenticity Confirmed</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 font-mono">ID: 8F92...</div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 bg-gray-100 rounded-full w-full" />
                      <div className="h-2 bg-gray-100 rounded-full w-3/4" />
                      <div className="h-2 bg-gray-100 rounded-full w-5/6" />
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center">
                      <div className="text-xs text-gray-400">Timestamp</div>
                      <div className="text-xs font-mono">2025-12-18 10:42:00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <section className="py-24 bg-white">
            <div className="container mx-auto px-6 max-w-6xl">
              <div className="text-center mb-16">
                <span className="text-emerald-600 font-medium text-sm tracking-widest uppercase">Process</span>
                <h2 className="text-4xl md:text-5xl font-bold mt-3 tracking-tight">How it works.</h2>
              </div>

              <div className="grid md:grid-cols-4 gap-8 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-100 -z-10" />

                {[
                  {
                    step: "01",
                    title: "Upload",
                    desc: "Upload any document type to our encrypted server.",
                    icon: FileText
                  },
                  {
                    step: "02",
                    title: "Hash",
                    desc: "We generate a unique SHA-256 cryptographic fingerprint.",
                    icon: Fingerprint
                  },
                  {
                    step: "03",
                    title: "Verify",
                    desc: "Instant matching against the immutable ledger.",
                    icon: Shield
                  },
                  {
                    step: "04",
                    title: "Audit",
                    desc: "Track every access attempt in real-time.",
                    icon: Database
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-white pt-4">
                    <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center text-xl font-bold mb-6 mx-auto shadow-xl shadow-black/10">
                      {item.step}
                    </div>
                    <div className="text-center px-4">
                      <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                      <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-24 bg-gray-50 border-t border-gray-100">
            <div className="container mx-auto px-6 max-w-3xl">
              <div className="text-center mb-16">
                <span className="text-emerald-600 font-medium text-sm tracking-widest uppercase">Support</span>
                <h2 className="text-4xl md:text-5xl font-bold mt-3 tracking-tight">Common questions.</h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q: "Is my document content stored?",
                    a: "We only store the cryptographic hash (fingerprint) of your document. The actual file content remains on your device unless you explicitly opt for cloud storage."
                  },
                  {
                    q: "Which file formats are supported?",
                    a: "SecureVerify supports all major file formats including PDF, DOCX, JPG, and PNG. The hashing algorithm works on the binary data level."
                  },
                  {
                    q: "Is this legally binding?",
                    a: "Our audit logs provide a mathematically provable chain of custody, which is widely accepted for compliance (SOC2, ISO) and legal verification purposes."
                  },
                  {
                    q: "Is my data secure?",
                    a: "Absolutely. We use industry-standard encryption and immutable audit logs to ensure your data's integrity and confidentiality."
                  }
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer hover:border-black/50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <button className="w-full flex items-center justify-between p-6 text-left">
                      <span className="font-bold text-lg">{item.q}</span>
                      <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    <div
                      className={`px-6 text-gray-500 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                    >
                      {item.a}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-gray-200 bg-white">
          <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="bg-black text-white p-1 rounded">
                <Shield className="h-3 w-3" />
              </div>
              <span className="font-bold text-black tracking-tight">SecureVerify.</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-black transition-colors">Contact Support</a>
            </div>
            <div className="mt-4 md:mt-0">
              © 2025 SecureVerify Inc.
            </div>
          </div>
        </footer>
      </div>
    )
  }

  if (!user && !isLoading) {
    return <AuthForm onSuccess={checkAuth} defaultIsLogin={isLoginMode} onBack={() => setShowLanding(true)} />
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with user info and logout */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToHome}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
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
              <DocumentList 
                documents={documents} 
                isAdmin={true}
                onDelete={async (id) => {
                  try {
                    await fetch(`/api/documents/${id}`, { method: "DELETE" })
                    refreshData()
                  } catch (error) {
                    console.error("Failed to delete document", error)
                  }
                }}
              />
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
