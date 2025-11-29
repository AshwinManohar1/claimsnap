"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, FileText, X, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Document {
  type: "prescription" | "invoice" | "lab" | "policy"
  file: File | null
  pageCount?: number
}

interface UploadDocumentsProps {
  onComplete: (documents: Document[]) => void
}

export function UploadDocuments({ onComplete }: UploadDocumentsProps) {
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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Step 1: Upload Documents</h1>
          <p className="text-muted-foreground">Upload the required documents to begin the smart claim review process</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <Card
              key={doc.type}
              className={cn("p-6 border-2 transition-colors", doc.file && "border-primary bg-primary/5")}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{documentInfo[doc.type].title}</h3>
                      {documentInfo[doc.type].required ? (
                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded">Required</span>
                      ) : (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">Optional</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{documentInfo[doc.type].description}</p>
                  </div>
                  {doc.file && (
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveFile(doc.type)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {!doc.file ? (
                  <label className="block cursor-pointer">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary hover:bg-primary/5 transition-colors">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">Click to upload</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, PNG, or JPG</p>
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
                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.pageCount} page{doc.pageCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 pt-8">
          <p className="text-sm text-muted-foreground text-center">
            Files used only for demo claim. Your documents are processed securely.
          </p>
          <Button size="lg" disabled={!allRequiredUploaded} onClick={handleRunSmartReview} className="px-8">
            Run Smart Review
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UploadDocuments
