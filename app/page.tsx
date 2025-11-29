"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Upload, CheckCircle2, FileCheck } from "lucide-react"
import UploadDocuments from "@/components/upload-documents"
import ProcessingTimeline from "@/components/processing-timeline"
import ClaimReview from "@/components/claim-review"
import SuccessScreen from "@/components/success-screen"

type Screen = "landing" | "upload" | "processing" | "review" | "success"

interface ClaimData {
  documents?: any[]
  patient?: { name: string; age: number; policyId: string }
  totalClaimed?: number
  suggestedApproval?: number
  totalApproved?: number
  approvedCount?: number
  partialCount?: number
  rejectedCount?: number
  items?: any[]
}

export default function ClaimAdjudicateApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing")
  const [claimData, setClaimData] = useState<ClaimData | null>(null)

  const handleStartNewClaim = () => {
    setCurrentScreen("upload")
    setClaimData(null)
  }

  const handleDocumentsUploaded = (documents: any) => {
    setClaimData({ documents })
    setCurrentScreen("processing")
  }

  const handleProcessingComplete = (processedData: any) => {
    setClaimData((prev) => ({ ...prev, ...processedData }))
    setCurrentScreen("review")
  }

  const handleClaimSubmitted = (finalDecision: ClaimData) => {
    setClaimData(finalDecision)
    setCurrentScreen("success")
  }

  return (
    <main className="min-h-screen bg-background">
      {currentScreen === "landing" && (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Main CTA */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-5xl font-bold tracking-tight text-balance">ClaimAdjudicate.ai</h1>
                  <p className="text-xl text-muted-foreground">Smart Claim Review</p>
                  <p className="text-lg text-foreground/80">Upload → Smart Checks → You Approve</p>
                </div>

                <Button size="lg" className="text-lg px-8 py-6" onClick={handleStartNewClaim}>
                  Start New Claim
                </Button>

                {/* Process Steps */}
                <div className="pt-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2 mt-1">
                      <Upload className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Upload Documents</h3>
                      <p className="text-sm text-muted-foreground">Prescription, invoice, lab reports, and policy</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-secondary/10 p-2 mt-1">
                      <FileText className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">AI Smart Review</h3>
                      <p className="text-sm text-muted-foreground">
                        Automated checks for consistency and policy compliance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-accent/10 p-2 mt-1">
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Human Approval</h3>
                      <p className="text-sm text-muted-foreground">Review and confirm every decision</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Info Panel */}
              <Card className="p-8 bg-card border-2">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                    <FileCheck className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-primary">Fast. Accurate. Human in Control.</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Transparent Process</h4>
                        <p className="text-sm text-muted-foreground">
                          Every automated check is visible and explainable
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Full Control</h4>
                        <p className="text-sm text-muted-foreground">
                          You review and approve each item before submission
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Audit Ready</h4>
                        <p className="text-sm text-muted-foreground">Complete documentation and decision rationale</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {currentScreen === "upload" && <UploadDocuments onComplete={handleDocumentsUploaded} />}

      {currentScreen === "processing" && (
        <ProcessingTimeline documents={claimData?.documents} onComplete={handleProcessingComplete} />
      )}

      {currentScreen === "review" && <ClaimReview data={claimData} onSubmit={handleClaimSubmitted} />}

      {currentScreen === "success" && claimData && <SuccessScreen data={claimData} onStartNew={handleStartNewClaim} />}
    </main>
  )
}
