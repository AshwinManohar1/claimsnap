"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertCircle,
  CheckCircle2,
  MinusCircle,
  XCircle,
  Eye,
  ZoomIn,
  ZoomOut,
  FileText,
  X,
  FileSearch,
  Receipt,
  FlaskConical,
  Shield,
  Pill,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ClaimItem {
  id: number
  item: string
  category: string
  claimed: number
  approved: number
  reason: string
  status: "approved" | "partial" | "rejected" | "attention"
  confirmed: boolean
}

interface ClaimReviewProps {
  data: {
    patient: { name: string; age: number; policyId: string }
    totalClaimed: number
    suggestedApproval: number
    items: ClaimItem[]
    documents: any
  }
  onSubmit: (finalDecision: any) => void
}

export default function ClaimReview({ data, onSubmit }: ClaimReviewProps) {
  const [items, setItems] = useState<ClaimItem[]>(data.items)
  const [activeDocument, setActiveDocument] = useState<"prescription" | "invoice" | "lab" | "policy">("invoice")
  const [zoomLevel, setZoomLevel] = useState(100)
  const [showReasonModal, setShowReasonModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ClaimItem | null>(null)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [isDocumentDrawerOpen, setIsDocumentDrawerOpen] = useState(false)

  const allConfirmed = items.every((item) => item.confirmed)

  const totalApproved = items.reduce((sum, item) => sum + item.approved, 0)
  const itemsNeedingAttention = items.filter((item) => item.status === "attention").length
  const confirmedCount = items.filter((item) => item.confirmed).length

  const handleAmountChange = (id: number, newAmount: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              approved: Math.min(Math.max(0, newAmount), item.claimed),
              confirmed: false, // Auto-untick when amount changes
              status: newAmount === item.claimed ? "approved" : newAmount === 0 ? "rejected" : "partial",
            }
          : item,
      ),
    )
  }

  const handleConfirmChange = (id: number, confirmed: boolean) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, confirmed } : item)))
  }

  const handleViewReason = (item: ClaimItem) => {
    setSelectedItem(item)
    setShowReasonModal(true)
  }

  const handleViewEvidence = (docType: "prescription" | "invoice" | "lab" | "policy") => {
    setActiveDocument(docType)
    setIsDocumentDrawerOpen(true)
  }

  const handleSubmit = () => {
    // TODO: Replace with real API call
    // await fetch('/api/submit-adjudication', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     claimId: data.patient.policyId,
    //     items: items,
    //     totalApproved,
    //   }),
    // })

    const finalDecision = {
      ...data,
      items,
      totalApproved,
      approvedCount: items.filter((i) => i.approved === i.claimed).length,
      partialCount: items.filter((i) => i.approved > 0 && i.approved < i.claimed).length,
      rejectedCount: items.filter((i) => i.approved === 0).length,
    }

    onSubmit(finalDecision)
  }

  const getStatusIcon = (status: ClaimItem["status"]) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-emerald-600" />
      case "partial":
        return <MinusCircle className="h-5 w-5 text-amber-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "attention":
        return <AlertCircle className="h-5 w-5 text-orange-500" />
    }
  }

  const getStatusBadge = (status: ClaimItem["status"]) => {
    const styles = {
      approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
      partial: "bg-amber-100 text-amber-700 border-amber-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
      attention: "bg-orange-100 text-orange-700 border-orange-200",
    }
    const labels = {
      approved: "Approved",
      partial: "Partial",
      rejected: "Rejected",
      attention: "Review",
    }
    return (
      <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold border", styles[status])}>
        {labels[status]}
      </span>
    )
  }

  const documentIcons = {
    prescription: Pill,
    invoice: Receipt,
    lab: FlaskConical,
    policy: Shield,
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-primary">Step 3 of 3</p>
            <h1 className="text-2xl font-bold">Review & Confirm Decision</h1>
            <p className="text-muted-foreground">
              Verify each line item, adjust amounts if needed, and confirm to proceed
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-3 bg-white border rounded-lg px-4 py-2.5 shadow-sm">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Receipt className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Claimed</p>
                <p className="text-lg font-bold">₹{data.totalClaimed.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 shadow-sm">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-emerald-600">AI Suggested</p>
                <p className="text-lg font-bold text-emerald-700">₹{totalApproved.toLocaleString()}</p>
              </div>
            </div>

            {itemsNeedingAttention > 0 && (
              <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-lg px-4 py-2.5 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-orange-600">Needs Review</p>
                  <p className="text-lg font-bold text-orange-700">{itemsNeedingAttention} items</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-muted-foreground mr-1">Quick View:</span>
              {(["prescription", "invoice", "lab", "policy"] as const).map((docType) => {
                const Icon = documentIcons[docType]
                return (
                  <button
                    key={docType}
                    onClick={() => handleViewEvidence(docType)}
                    className={cn(
                      "h-9 w-9 rounded-lg border flex items-center justify-center transition-all hover:scale-105",
                      activeDocument === docType && isDocumentDrawerOpen
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-white hover:bg-muted/50 hover:border-primary/50",
                    )}
                    title={docType.charAt(0).toUpperCase() + docType.slice(1)}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                )
              })}
            </div>
          </div>

          <div className="bg-white border rounded-lg p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Confirmation Progress</span>
              <span className="text-sm text-muted-foreground">
                {confirmedCount} of {items.length} confirmed
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${(confirmedCount / items.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <Card
                key={item.id}
                className={cn(
                  "p-4 transition-all hover:shadow-md",
                  item.status === "attention" && "ring-2 ring-orange-200 bg-orange-50/30",
                  item.confirmed && "bg-emerald-50/30 border-emerald-200",
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Status Icon & Item Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(item.status)}
                      <h3 className="font-semibold text-base truncate">{item.item}</h3>
                      {getStatusBadge(item.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="bg-muted/50 px-2 py-0.5 rounded text-xs">{item.category}</span>
                      <button
                        onClick={() => handleViewReason(item)}
                        className="text-primary hover:underline text-xs flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        View reason
                      </button>
                      <button
                        onClick={() => handleViewEvidence("invoice")}
                        className="text-muted-foreground hover:text-primary text-xs flex items-center gap-1"
                      >
                        <FileSearch className="h-3 w-3" />
                        See in document
                      </button>
                    </div>
                  </div>

                  {/* Amounts */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-0.5">Claimed</p>
                      <p className="font-medium">₹{item.claimed.toLocaleString()}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-0.5">Approved</p>
                      <Input
                        type="number"
                        value={item.approved}
                        onChange={(e) => handleAmountChange(item.id, Number.parseInt(e.target.value) || 0)}
                        className="w-28 text-right h-9 font-medium"
                        min={0}
                        max={item.claimed}
                      />
                    </div>

                    {/* Confirm Checkbox */}
                    <div className="flex flex-col items-center gap-1 pl-4 border-l">
                      <Checkbox
                        id={`confirm-${item.id}`}
                        checked={item.confirmed}
                        onCheckedChange={(checked) => handleConfirmChange(item.id, !!checked)}
                        className="h-5 w-5"
                      />
                      <label htmlFor={`confirm-${item.id}`} className="text-xs text-muted-foreground cursor-pointer">
                        Confirm
                      </label>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Submit Section */}
          <Card className="p-6 bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Ready to Submit?</h3>
                <p className="text-sm text-muted-foreground">
                  {allConfirmed
                    ? "All items confirmed. You can now submit the adjudication."
                    : `${items.length - confirmedCount} item(s) still need confirmation`}
                </p>
              </div>
              <Button size="lg" disabled={!allConfirmed} onClick={() => setShowSubmitModal(true)} className="px-8">
                Submit Adjudication
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl border-l transform transition-transform duration-300 ease-in-out z-50",
          isDocumentDrawerOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-semibold">Document Viewer</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsDocumentDrawerOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Document Tabs */}
        <div className="flex border-b">
          {(["prescription", "invoice", "lab", "policy"] as const).map((docType) => {
            const Icon = documentIcons[docType]
            return (
              <button
                key={docType}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-sm font-medium transition-colors border-b-2",
                  activeDocument === docType
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent hover:bg-muted/50 text-muted-foreground",
                )}
                onClick={() => setActiveDocument(docType)}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{docType.charAt(0).toUpperCase() + docType.slice(1)}</span>
              </button>
            )
          })}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/20">
          <span className="text-xs text-muted-foreground">Zoom</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 bg-transparent"
              onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            <span className="text-xs font-medium w-10 text-center">{zoomLevel}%</span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 bg-transparent"
              onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-auto p-4 bg-slate-50" style={{ height: "calc(100vh - 160px)" }}>
          <DocumentPreview
            type={activeDocument}
            zoomLevel={zoomLevel}
            document={data.documents?.find((d: any) => d.type === activeDocument)}
          />
        </div>
      </div>

      {/* Backdrop for drawer */}
      {isDocumentDrawerOpen && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setIsDocumentDrawerOpen(false)} />
      )}

      {/* Reason Modal */}
      <Dialog open={showReasonModal} onOpenChange={setShowReasonModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decision Rationale</DialogTitle>
            <DialogDescription>AI-generated explanation for this item</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{selectedItem.item}</span>
                  {getStatusBadge(selectedItem.status)}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Claimed:</span>
                    <span className="ml-2 font-medium">₹{selectedItem.claimed.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Approved:</span>
                    <span className="ml-2 font-medium text-emerald-600">₹{selectedItem.approved.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Reason</h4>
                <p className="text-muted-foreground">{selectedItem.reason}</p>
              </div>
              {/* TODO: In production, show specific policy clause references */}
              <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded">
                Policy Reference: Section 4.2.1 - Coverage Limits and Exclusions
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowReasonModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Confirmation Modal */}
      <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogDescription>
              You are about to submit the final decision. You can download a summary after submission.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-muted/50 rounded">
                <p className="text-muted-foreground">Total Claimed</p>
                <p className="font-bold">₹{data.totalClaimed.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
                <p className="text-muted-foreground">Final Approved</p>
                <p className="font-bold text-emerald-600">₹{totalApproved.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowSubmitModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Yes, Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Dummy document preview component
function DocumentPreview({
  type,
  zoomLevel,
  document,
}: {
  type: string
  zoomLevel: number
  document?: any
}) {
  // Dummy document data for demo
  const dummyDocuments = {
    prescription: {
      title: "Medical Prescription",
      content: `
Dr. Priya Sharma, MBBS, MD
Apollo Hospital, Delhi
Date: 15 Nov 2024

Patient: Raj Kumar, 45 years
Diagnosis: Acute Bronchitis

Rx:
1. Amoxicillin 500mg - 1 tab TID x 7 days
2. Azithromycin 250mg - 1 tab OD x 5 days  
3. Paracetamol 650mg - SOS
4. Cough syrup - 10ml TDS

Advised: CBC, Chest X-Ray

Dr. Priya Sharma
Reg. No: DMC-12345
      `,
    },
    invoice: {
      title: "Hospital Invoice",
      content: `
APOLLO HOSPITAL INVOICE
Invoice No: INV-2024-87654
Date: 17 Nov 2024

Patient: Raj Kumar
Policy ID: HLT-2024-78542

ITEM DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Consultation Fee         ₹1,500
2. Blood Test - CBC          ₹800
3. X-Ray Chest             ₹2,200
4. Medicines               ₹4,500
5. Room Charges (2 days)  ₹12,000
6. Nursing Charges         ₹6,000
7. Vitamin Supplements     ₹5,000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL:                    ₹32,000

Payment Mode: Insurance Claim
      `,
    },
    lab: {
      title: "Lab Report",
      content: `
DIAGNOSTIC LAB REPORT
Lab: Apollo Diagnostics
Report Date: 16 Nov 2024

Patient: Raj Kumar, 45/M
Ref By: Dr. Priya Sharma

COMPLETE BLOOD COUNT (CBC)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hemoglobin:     13.2 g/dL  (Normal)
WBC Count:      12,500/μL  (High)
Platelet Count: 250,000/μL (Normal)
ESR:            28 mm/hr   (High)

IMPRESSION:
Elevated WBC and ESR consistent with
acute infection. Follow up advised.

Lab Technician: R. Singh
      `,
    },
    policy: {
      title: "Policy Document",
      content: `
HEALTH INSURANCE POLICY
Policy No: HLT-2024-78542
Insured: Raj Kumar

COVERAGE SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sum Insured: ₹5,00,000
Room Rent Limit: ₹5,000/day
Medicine Cap: ₹3,500/prescription
Pre/Post Hospitalization: 30/60 days

EXCLUSIONS:
- Cosmetic treatments
- Vitamins & supplements (partial)
- Experimental treatments

COVERED SERVICES:
✓ Inpatient hospitalization
✓ Pre-hospitalization diagnostics
✓ Ambulance charges (max ₹2,000)
✓ Day care procedures
      `,
    },
  }

  const doc = dummyDocuments[type as keyof typeof dummyDocuments]

  return (
    <div
      className="bg-white border rounded-lg p-6 shadow-inner transition-transform"
      style={{
        transform: `scale(${zoomLevel / 100})`,
        transformOrigin: "top left",
        width: `${10000 / zoomLevel}%`,
      }}
    >
      <div className="flex items-center gap-2 mb-4 pb-3 border-b">
        <FileText className="h-5 w-5 text-primary" />
        <span className="font-semibold">{doc?.title || "Document"}</span>
      </div>
      <pre className="text-xs font-mono whitespace-pre-wrap text-foreground/80 leading-relaxed">
        {doc?.content || "No document uploaded"}
      </pre>
      {/* TODO: In production, render actual PDF/image with highlight overlays */}
      {/* Example: When user clicks an item row, highlight corresponding line in document */}
    </div>
  )
}
