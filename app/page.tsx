"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
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
  const searchParams = useSearchParams()
  const router = useRouter()
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing")
  const [claimData, setClaimData] = useState<ClaimData | null>(null)

  // Sync URL with current screen
  useEffect(() => {
    const step = searchParams.get("step") as Screen | null
    if (step && ["landing", "upload", "processing", "review", "success"].includes(step)) {
      setCurrentScreen(step)
    }
  }, [searchParams])

  const navigateToStep = (step: Screen) => {
    setCurrentScreen(step)
    const params = new URLSearchParams(searchParams.toString())
    if (step === "landing") {
      params.delete("step")
    } else {
      params.set("step", step)
    }
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const handleStartNewClaim = () => {
    setClaimData(null)
    navigateToStep("upload")
  }

  const handleDocumentsUploaded = (documents: any) => {
    setClaimData({ documents })
    navigateToStep("processing")
  }

  const handleProcessingComplete = (processedData: any) => {
    setClaimData((prev) => ({ ...prev, ...processedData }))
    navigateToStep("review")
  }

  const handleClaimSubmitted = (finalDecision: ClaimData) => {
    setClaimData(finalDecision)
    navigateToStep("success")
  }

  const handleBackToHome = () => {
    setClaimData(null)
    navigateToStep("landing")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {currentScreen === "landing" && (
        <div className="relative">
          {/* Gradient Orbs Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          <div className="container mx-auto px-4 py-16 relative">
            <div className="max-w-7xl mx-auto">
              {/* Header Badge */}
              <div className="text-center mb-12 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-sm font-medium text-primary">Powered by Agentic AI • MumbaiHacks 2025</span>
                </div>
              </div>

              {/* Hero Section */}
              <div className="text-center mb-16 space-y-6 animate-fade-in-up">
                <h1 className="text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                  ClaimAdjudicate.ai
                </h1>
                <p className="text-2xl md:text-3xl font-semibold text-muted-foreground max-w-3xl mx-auto">
                  AI-Powered Health Insurance Claims Adjudication
                </p>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Transform hours of manual review into seconds. Leverage advanced AI agents to analyze medical claims with 
                  precision while keeping human expertise in control.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button size="lg" className="text-lg px-10 py-7 shadow-lg hover:shadow-xl transition-all" onClick={handleStartNewClaim}>
                    <Upload className="h-5 w-5 mr-2" />
                    Start New Claim Review
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2">
                    <FileText className="h-5 w-5 mr-2" />
                    View Demo
                  </Button>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                <Card className="p-6 text-center bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <p className="text-4xl font-bold text-primary mb-2">95%</p>
                  <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                </Card>
                <Card className="p-6 text-center bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <p className="text-4xl font-bold text-primary mb-2">50x</p>
                  <p className="text-sm text-muted-foreground">Faster Processing</p>
                </Card>
                <Card className="p-6 text-center bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <p className="text-4xl font-bold text-primary mb-2">100%</p>
                  <p className="text-sm text-muted-foreground">Audit Trail</p>
                </Card>
                <Card className="p-6 text-center bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <p className="text-4xl font-bold text-primary mb-2">24/7</p>
                  <p className="text-sm text-muted-foreground">Availability</p>
                </Card>
              </div>

              {/* Features Grid */}
              <div className="grid lg:grid-cols-3 gap-8 mb-16">
                {/* Process Steps */}
                <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl">
                  <div className="rounded-full bg-primary/20 p-3 w-fit mb-4">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Intelligent Document Upload</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload prescriptions, invoices, lab reports, and policy documents. Our AI agents automatically extract and validate data.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>OCR with 95% accuracy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Automated data validation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Multi-format support</span>
                    </li>
                  </ul>
                </Card>

                <Card className="p-8 bg-gradient-to-br from-secondary/5 to-secondary/10 border-2 border-secondary/20 hover:border-secondary/40 transition-all hover:shadow-xl">
                  <div className="rounded-full bg-secondary/20 p-3 w-fit mb-4">
                    <FileText className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Agentic AI Analysis</h3>
                  <p className="text-muted-foreground mb-4">
                    Multi-agent system performs comprehensive checks for medical necessity, policy compliance, and fraud detection.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Cross-document consistency checks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Real-time policy verification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Anomaly detection</span>
                    </li>
                  </ul>
                </Card>

                <Card className="p-8 bg-gradient-to-br from-accent/5 to-accent/10 border-2 border-accent/20 hover:border-accent/40 transition-all hover:shadow-xl">
                  <div className="rounded-full bg-accent/20 p-3 w-fit mb-4">
                    <CheckCircle2 className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Human-in-the-Loop</h3>
                  <p className="text-muted-foreground mb-4">
                    Expert reviewers maintain final authority with AI-generated insights and recommendations for informed decisions.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Explainable AI decisions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Override capabilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Complete audit trail</span>
                    </li>
                  </ul>
                </Card>
              </div>

              {/* Technology Stack */}
              <Card className="p-8 bg-card/50 backdrop-blur-sm border-2">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2">Built for Healthcare Excellence</h2>
                  <p className="text-muted-foreground">Enterprise-grade AI technology meets regulatory compliance</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      <FileCheck className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">HIPAA Compliant</h4>
                    <p className="text-sm text-muted-foreground">
                      End-to-end encryption and secure data handling
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">Multi-Agent Architecture</h4>
                    <p className="text-sm text-muted-foreground">
                      Specialized AI agents for different validation tasks
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      <CheckCircle2 className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">Real-Time Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      Instant feedback and decision support
                    </p>
                  </div>
                </div>
              </Card>

              {/* Footer */}
              <div className="text-center mt-16 text-sm text-muted-foreground">
                <p>Built for <a href="https://mumbaihacks.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">MumbaiHacks 2025</a> - The Largest Agentic AI Hackathon</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentScreen === "upload" && <UploadDocuments onComplete={handleDocumentsUploaded} onBack={handleBackToHome} />}

      {currentScreen === "processing" && (
        <ProcessingTimeline documents={claimData?.documents} onComplete={handleProcessingComplete} />
      )}

      {currentScreen === "review" && claimData && claimData.patient && claimData.items && (
        <ClaimReview data={claimData as any} onSubmit={handleClaimSubmitted} />
      )}

      {currentScreen === "success" && claimData && <SuccessScreen data={claimData} onStartNew={handleStartNewClaim} />}
    </main>
  )
}
