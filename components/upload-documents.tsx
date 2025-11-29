"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, FileText, X, CheckCircle2, ArrowLeft, Shield, Zap, FileCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface Document {
  type: "prescription" | "invoice" | "lab" | "policy"
  file: File | null
  pageCount?: number
}

interface UploadDocumentsProps {
  onComplete: (documents: Document[]) => void
  onBack?: () => void
}

export function UploadDocuments({ onComplete, onBack }: UploadDocumentsProps) {
  const [documents, setDocuments] = useState<Document[]>([
    { type: "prescription", file: null },
    { type: "invoice", file: null },
    { type: "lab", file: null },
    { type: "policy", file: null },
  ])

  const documentInfo = {
    prescription: {
      title: "Prescription",
      required: true,
      description: "Doctor's prescription document",
    },
    invoice: {
      title: "Invoice / Bill",
      required: true,
      description: "Hospital bill or invoice",
    },
    lab: {
      title: "Lab Report",
      required: false,
      description: "Skip if not applicable",
    },
    policy: {
      title: "Policy Document",
      required: true,
      description: "Insurance policy document",
    },
  }

  const handleFileChange = (type: Document["type"], file: File | null) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.type === type
          ? {
              ...doc,
              file,
              pageCount: file ? Math.floor(Math.random() * 5) + 1 : undefined, // Dummy page count
            }
          : doc,
      ),
    )
  }

  const handleRemoveFile = (type: Document["type"]) => {
    handleFileChange(type, null)
  }

  const allRequiredUploaded = documents
    .filter((doc) => documentInfo[doc.type].required)
    .every((doc) => doc.file !== null)

  const handleRunSmartReview = () => {
    // TODO: In production, send documents to backend API for processing
    // const formData = new FormData()
    // documents.forEach(doc => {
    //   if (doc.file) formData.append(doc.type, doc.file)
    // })
    // await fetch('/api/process-claim', { method: 'POST', body: formData })

    onComplete(documents)
  }

  const uploadedCount = documents.filter((doc) => doc.file !== null).length
  const totalCount = documents.length
  const requiredCount = documents.filter((doc) => documentInfo[doc.type].required).length
  const uploadedRequiredCount = documents.filter(
    (doc) => documentInfo[doc.type].required && doc.file !== null,
  ).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Gradient Orbs Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 -right-4 w-72 h-72 bg-secondary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                variant="outline"
                size="icon"
                onClick={onBack}
                className="border-2 hover:border-primary/50 hover:bg-primary/5"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                  <span className="text-xs font-semibold text-primary">STEP 1 OF 3</span>
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-xs">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: "33%" }}></div>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-2">
                Upload Medical Documents
              </h1>
              <p className="text-lg text-muted-foreground">
                Upload required documents to begin AI-powered claim analysis
              </p>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-2 border-primary/20">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">HIPAA Compliant</p>
                  <p className="text-xs text-muted-foreground">Secure encryption</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-2 border-secondary/20">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-secondary/10 p-2">
                  <Zap className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Instant Processing</p>
                  <p className="text-xs text-muted-foreground">Results in seconds</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-2 border-accent/20">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-accent/10 p-2">
                  <FileCheck className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold">95% OCR Accuracy</p>
                  <p className="text-xs text-muted-foreground">AI data extraction</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Upload Progress */}
          <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-2 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Upload Progress</p>
                <p className="text-2xl font-bold text-primary">
                  {uploadedRequiredCount} / {requiredCount} Required Documents
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total: {uploadedCount} / {totalCount}</p>
                <div className="flex items-center gap-2 mt-1">
                  {allRequiredUploaded && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                      Ready to Process
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Document Upload Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {documents.map((doc) => (
              <Card
                key={doc.type}
                className={cn(
                  "p-6 border-2 transition-all duration-300 bg-card/50 backdrop-blur-sm hover:shadow-lg",
                  doc.file && "border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10 shadow-md",
                  !doc.file && "hover:border-primary/30",
                )}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{documentInfo[doc.type].title}</h3>
                        {documentInfo[doc.type].required ? (
                          <span className="text-xs bg-destructive/10 text-destructive font-semibold px-2 py-1 rounded border border-destructive/20">
                            Required
                          </span>
                        ) : (
                          <span className="text-xs bg-muted text-muted-foreground font-semibold px-2 py-1 rounded">
                            Optional
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{documentInfo[doc.type].description}</p>
                    </div>
                    {doc.file && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(doc.type)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {!doc.file ? (
                    <label className="block cursor-pointer group">
                      <div className="border-2 border-dashed rounded-xl p-10 text-center hover:border-primary hover:bg-primary/5 transition-all duration-300 group-hover:scale-[1.02]">
                        <div className="rounded-full bg-primary/10 p-3 w-fit mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                          <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-sm font-semibold mb-1">Click to upload</p>
                        <p className="text-xs text-muted-foreground">PDF, PNG, or JPG</p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          handleFileChange(doc.type, file)
                        }}
                      />
                    </label>
                  ) : (
                    <div className="flex items-center gap-4 p-4 bg-background/80 backdrop-blur-sm rounded-xl border-2 border-primary/30 shadow-sm">
                      <div className="rounded-lg bg-primary/10 p-3">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate mb-1">{doc.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(doc.file.size / 1024).toFixed(1)} KB • {doc.pageCount} page{doc.pageCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Footer Actions */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-2">
            <div className="flex flex-col items-center gap-6">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>All documents are encrypted and processed securely</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Demo mode: Files are used only for demonstration. Your data is never stored permanently.
                </p>
              </div>
              <Button
                size="lg"
                disabled={!allRequiredUploaded}
                onClick={handleRunSmartReview}
                className="text-lg px-10 py-7 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {allRequiredUploaded ? (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Run Smart AI Review
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5 mr-2" />
                    Upload {requiredCount - uploadedRequiredCount} More Required Document{requiredCount - uploadedRequiredCount !== 1 ? "s" : ""}
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default UploadDocuments
