"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  CheckCircle2,
  Loader2,
  FileSearch,
  Stethoscope,
  FileCheck,
  ClipboardCheck,
  FileText,
  Receipt,
  TestTube,
  Shield,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ProcessingStep {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  status: "pending" | "processing" | "complete"
  summary?: string[]
  details?: any
}

interface ProcessingTimelineProps {
  documents: any
  onComplete: (data: any) => void
}

export default function ProcessingTimeline({ documents, onComplete }: ProcessingTimelineProps) {
  const [steps, setSteps] = useState<ProcessingStep[]>([
    {
      id: 1,
      title: "Document Reading & Extraction",
      description: "Extracting information from uploaded documents",
      icon: <FileSearch className="h-5 w-5" />,
      status: "pending",
    },
    {
      id: 2,
      title: "Medical Consistency Check",
      description: "Verifying prescription vs invoice vs lab report",
      icon: <Stethoscope className="h-5 w-5" />,
      status: "pending",
    },
    {
      id: 3,
      title: "Policy Rules Check",
      description: "Applying coverage rules and exclusions",
      icon: <FileCheck className="h-5 w-5" />,
      status: "pending",
    },
    {
      id: 4,
      title: "Draft Decision Preparation",
      description: "Preparing item-level adjudication",
      icon: <ClipboardCheck className="h-5 w-5" />,
      status: "pending",
    },
  ])

  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [allComplete, setAllComplete] = useState(false)
  const [pipelineStats, setPipelineStats] = useState({
    documentsScanned: 0,
    itemsExtracted: 0,
    itemsValidated: 0,
    itemsAdjudicated: 0,
    totalItems: 7, // Total claim items to process
  })

  const dummyStepResults = {
    1: {
      summary: ["Patient: Raj Kumar, Age: 45", "5 invoice items extracted", "Policy ID: HLT-2024-78542"],
      details: {
        patient: { name: "Raj Kumar", age: 45, policyId: "HLT-2024-78542" },
        invoiceItems: 5,
        prescriptionItems: 4,
        labTests: 2,
      },
    },
    2: {
      summary: ["4 items matched with prescription", "1 item flagged for review"],
      details: {
        matchedItems: 4,
        flaggedItems: 1,
        labCorrelation: "Consistent",
      },
    },
    3: {
      summary: ["Room rent: Within daily limit", "Medicine cap: Applicable", "2 items partially covered"],
      details: {
        roomRentStatus: "Within limit",
        medicineCap: true,
        partialCoverage: 2,
      },
    },
    4: {
      summary: ["Draft ready for review", "Suggested approval: ₹24,500 of ₹32,000"],
      details: {
        totalClaimed: 32000,
        suggestedApproval: 24500,
        itemsApproved: 4,
        itemsPartial: 1,
        itemsRejected: 0,
        itemsAttention: 1,
      },
    },
  }

  useEffect(() => {
    const processSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        setSteps((prev) => prev.map((step, index) => (index === i ? { ...step, status: "processing" } : step)))
        setActiveStep(i + 1)

        const statsInterval = setInterval(() => {
          setPipelineStats((prev) => ({
            ...prev,
            documentsScanned: Math.min(prev.documentsScanned + (i === 0 ? 1 : 0), 4),
            itemsExtracted: Math.min(prev.itemsExtracted + (i === 0 ? 1 : 0), 7),
            itemsValidated: Math.min(prev.itemsValidated + (i === 1 || i === 2 ? 1 : 0), 7),
            itemsAdjudicated: Math.min(prev.itemsAdjudicated + (i === 3 ? 1 : 0), 7),
          }))
        }, 350)

        await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1500))
        clearInterval(statsInterval)

        if (i === 0) setPipelineStats((prev) => ({ ...prev, documentsScanned: 4, itemsExtracted: 7 }))
        if (i === 1) setPipelineStats((prev) => ({ ...prev, itemsValidated: 4 }))
        if (i === 2) setPipelineStats((prev) => ({ ...prev, itemsValidated: 7 }))
        if (i === 3) setPipelineStats((prev) => ({ ...prev, itemsAdjudicated: 7 }))

        const stepResults = dummyStepResults[(i + 1) as keyof typeof dummyStepResults]
        setSteps((prev) =>
          prev.map((step, index) =>
            index === i
              ? {
                  ...step,
                  status: "complete",
                  summary: stepResults.summary,
                  details: stepResults.details,
                }
              : step,
          ),
        )
      }

      setAllComplete(true)
    }

    processSteps()
  }, [])

  const completedSteps = steps.filter((s) => s.status === "complete").length
  const progressPercent = (completedSteps / steps.length) * 100

  const handleReviewDraft = () => {
    const claimData = {
      patient: { name: "Raj Kumar", age: 45, policyId: "HLT-2024-78542" },
      totalClaimed: 32000,
      suggestedApproval: 24500,
      items: [
        {
          id: 1,
          item: "Consultation Fee",
          category: "OPD",
          claimed: 1500,
          approved: 1500,
          reason: "Within policy limits",
          status: "approved",
          confirmed: false,
        },
        {
          id: 2,
          item: "Blood Test - CBC",
          category: "Diagnostics",
          claimed: 800,
          approved: 800,
          reason: "Medically necessary, matches prescription",
          status: "approved",
          confirmed: false,
        },
        {
          id: 3,
          item: "X-Ray Chest",
          category: "Diagnostics",
          claimed: 2200,
          approved: 2200,
          reason: "Prescribed by doctor",
          status: "approved",
          confirmed: false,
        },
        {
          id: 4,
          item: "Medicines (Antibiotics)",
          category: "Pharmacy",
          claimed: 4500,
          approved: 3500,
          reason: "Cap of ₹3,500 per prescription applied",
          status: "partial",
          confirmed: false,
        },
        {
          id: 5,
          item: "Room Charges (2 days)",
          category: "Accommodation",
          claimed: 12000,
          approved: 10000,
          reason: "Daily limit of ₹5,000 applied",
          status: "partial",
          confirmed: false,
        },
        {
          id: 6,
          item: "Nursing Charges",
          category: "Services",
          claimed: 6000,
          approved: 6000,
          reason: "Standard nursing care covered",
          status: "approved",
          confirmed: false,
        },
        {
          id: 7,
          item: "Vitamin Supplements",
          category: "Pharmacy",
          claimed: 5000,
          approved: 500,
          reason: "Not in prescription, partial discretionary coverage",
          status: "attention",
          confirmed: false,
        },
      ],
      documents,
    }

    onComplete(claimData)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Smart Processing</h1>
            <p className="text-sm text-muted-foreground">AI is analyzing your documents</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Progress</p>
              <p className="font-semibold">
                {completedSteps} of {steps.length} steps
              </p>
            </div>
            <div className="h-12 w-12 rounded-full border-4 border-muted flex items-center justify-center relative">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-primary"
                  strokeDasharray={`${progressPercent * 1.256} 125.6`}
                />
              </svg>
              <span className="text-sm font-bold">{Math.round(progressPercent)}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {steps.map((step, index) => (
            <Card
              key={step.id}
              className={cn(
                "p-4 cursor-pointer transition-all border-2 relative overflow-hidden",
                step.status === "pending" && "opacity-50",
                step.status === "processing" && "border-primary bg-primary/5",
                step.status === "complete" && "border-primary/50 bg-primary/5 hover:border-primary",
              )}
              onClick={() => step.status === "complete" && setActiveStep(step.id)}
            >
              {step.status === "processing" && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer"
                  style={{ backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }}
                />
              )}

              <div className="flex items-center gap-3 relative">
                <div
                  className={cn(
                    "rounded-full p-2 flex-shrink-0 transition-all",
                    step.status === "pending" && "bg-muted text-muted-foreground",
                    step.status === "processing" && "bg-primary/20 text-primary",
                    step.status === "complete" && "bg-primary text-primary-foreground",
                  )}
                >
                  {step.status === "processing" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : step.status === "complete" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <span className="h-4 w-4 flex items-center justify-center text-xs font-bold">{step.id}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{step.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">{step.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="p-5 lg:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Live Activity</h3>
            </div>

            <div className="grid grid-cols-4 gap-1.5 mb-6">
              {[
                { icon: FileText, label: "Rx", scanned: pipelineStats.documentsScanned >= 1 },
                { icon: Receipt, label: "Bill", scanned: pipelineStats.documentsScanned >= 2 },
                { icon: TestTube, label: "Lab", scanned: pipelineStats.documentsScanned >= 3 },
                { icon: Shield, label: "Policy", scanned: pipelineStats.documentsScanned >= 4 },
              ].map((doc, i) => (
                <div
                  key={i}
                  className={cn(
                    "p-2 rounded-lg border transition-all flex flex-col items-center gap-1",
                    doc.scanned ? "border-primary/50 bg-primary/10" : "border-dashed border-muted-foreground/30",
                  )}
                >
                  <doc.icon className={cn("h-4 w-4", doc.scanned ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-[10px] text-muted-foreground">{doc.label}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground mb-3 font-medium">Claim Items Pipeline</p>

              <div className="flex items-center gap-3">
                <div className="w-20 text-xs text-muted-foreground">Extracted</div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                    style={{ width: `${(pipelineStats.itemsExtracted / pipelineStats.totalItems) * 100}%` }}
                  />
                </div>
                <div className="w-8 text-right">
                  <span className="text-sm font-bold text-blue-500">{pipelineStats.itemsExtracted}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-20" />
                <div className="flex-1 flex justify-center">
                  <div className="w-0.5 h-3 bg-muted-foreground/20" />
                </div>
                <div className="w-8" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-20 text-xs text-muted-foreground">Validated</div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300 rounded-full"
                    style={{ width: `${(pipelineStats.itemsValidated / pipelineStats.totalItems) * 100}%` }}
                  />
                </div>
                <div className="w-8 text-right">
                  <span className="text-sm font-bold text-amber-500">{pipelineStats.itemsValidated}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-20" />
                <div className="flex-1 flex justify-center">
                  <div className="w-0.5 h-3 bg-muted-foreground/20" />
                </div>
                <div className="w-8" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-20 text-xs text-muted-foreground">Adjudicated</div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 rounded-full"
                    style={{ width: `${(pipelineStats.itemsAdjudicated / pipelineStats.totalItems) * 100}%` }}
                  />
                </div>
                <div className="w-8 text-right">
                  <span className="text-sm font-bold text-primary">{pipelineStats.itemsAdjudicated}</span>
                </div>
              </div>
            </div>

            {activeStep && !allComplete && (
              <div className="mt-5 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  <span className="text-xs font-medium">{steps[activeStep - 1]?.title}</span>
                </div>
              </div>
            )}

            {allComplete && (
              <div className="mt-5 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">All {pipelineStats.totalItems} items processed</span>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-5 lg:col-span-2">
            {activeStep && steps[activeStep - 1]?.status === "complete" ? (
              <StepDetails step={steps[activeStep - 1]} />
            ) : activeStep && steps[activeStep - 1]?.status === "processing" ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-muted" />
                  <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                </div>
                <div className="text-center">
                  <p className="font-medium">{steps[activeStep - 1]?.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{steps[activeStep - 1]?.description}</p>
                </div>
              </div>
            ) : allComplete ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Processing Complete</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">Click any step above to review details</p>
                <Button onClick={handleReviewDraft}>Review Draft Decision</Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <FileSearch className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Processing will begin shortly...</p>
              </div>
            )}
          </Card>
        </div>

        {allComplete && activeStep && steps[activeStep - 1]?.status === "complete" && (
          <div className="flex justify-center pt-4">
            <Button size="lg" onClick={handleReviewDraft} className="px-8">
              Review Draft Decision
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function StepDetails({ step }: { step: ProcessingStep }) {
  const renderDetails = () => {
    switch (step.id) {
      case 1:
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Extracted Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Patient Name</p>
                <p className="font-semibold">{step.details?.patient?.name}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Age</p>
                <p className="font-semibold">{step.details?.patient?.age} years</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Policy ID</p>
                <p className="font-semibold">{step.details?.patient?.policyId}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Invoice Items</p>
                <p className="font-semibold">{step.details?.invoiceItems} items</p>
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Medical Consistency Results</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                <span>Items matched with prescription</span>
                <span className="font-bold text-primary">{step.details?.matchedItems}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                <span>Items flagged for review</span>
                <span className="font-bold text-accent">{step.details?.flaggedItems}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span>Lab correlation status</span>
                <span className="font-bold">{step.details?.labCorrelation}</span>
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Policy Rules Applied</h4>
            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Room Rent Limit</span>
                  <span className="text-sm px-2 py-0.5 bg-primary/10 text-primary rounded">
                    {step.details?.roomRentStatus}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Daily limit of ₹5,000 per day applied</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Medicine Cap</span>
                  <span className="text-sm px-2 py-0.5 bg-accent/10 text-accent rounded">
                    {step.details?.medicineCap ? "Applied" : "Not Applied"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">₹3,500 limit per prescription</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Partial Coverage Items</span>
                  <span className="font-bold">{step.details?.partialCoverage}</span>
                </div>
              </div>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Draft Decision Summary</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Total Claimed</p>
                <p className="text-2xl font-bold">₹{step.details?.totalClaimed?.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-xs text-muted-foreground">Suggested Approval</p>
                <p className="text-2xl font-bold text-primary">₹{step.details?.suggestedApproval?.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-medium">
                {step.details?.itemsApproved} Approved
              </span>
              <span className="px-3 py-1.5 bg-accent/20 text-accent rounded-full text-sm font-medium">
                {step.details?.itemsPartial} Partial
              </span>
              <span className="px-3 py-1.5 bg-destructive/20 text-destructive rounded-full text-sm font-medium">
                {step.details?.itemsRejected} Rejected
              </span>
              <span className="px-3 py-1.5 bg-secondary/20 text-secondary rounded-full text-sm font-medium">
                {step.details?.itemsAttention} Needs Attention
              </span>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 pb-4 border-b">
        <div className="rounded-full p-2 bg-primary text-primary-foreground">{step.icon}</div>
        <div>
          <h3 className="font-semibold">{step.title}</h3>
          <p className="text-sm text-muted-foreground">{step.description}</p>
        </div>
      </div>
      {renderDetails()}
    </div>
  )
}
