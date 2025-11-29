"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Download, RefreshCw } from "lucide-react"
import { generateClaimPDF } from "@/lib/pdf-generator"

interface SuccessScreenProps {
  data: {
    patient?: { name: string; age: number; policyId: string }
    totalClaimed?: number
    totalApproved?: number
    approvedCount?: number
    partialCount?: number
    rejectedCount?: number
    items?: any[]
  }
  onStartNew: () => void
}

export default function SuccessScreen({ data, onStartNew }: SuccessScreenProps) {
  const patient = data?.patient || { name: "Unknown", age: 0, policyId: "N/A" }
  const totalClaimed = data?.totalClaimed || 0
  const totalApproved = data?.totalApproved || 0
  const approvedCount = data?.approvedCount || 0
  const partialCount = data?.partialCount || 0
  const rejectedCount = data?.rejectedCount || 0
  const items = data?.items || []

  const handleDownloadSummary = () => {
    // Generate professional PDF and open in new tab
    generateClaimPDF(data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Success Icon and Message */}
          <div className="text-center space-y-4 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/30 shadow-lg">
              <CheckCircle2 className="h-14 w-14 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Claim Adjudication Complete
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your claim decision has been successfully processed and recorded with complete audit trail
            </p>
          </div>

          {/* Summary Card */}
          <Card className="p-8 space-y-6 border-2 shadow-xl bg-card/50 backdrop-blur-sm">
            <div className="text-center pb-6 border-b-2">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Final Approved Amount</p>
              <p className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                ₹{totalApproved.toLocaleString()}
              </p>
              <p className="text-base text-muted-foreground mt-2">
                of ₹{totalClaimed.toLocaleString()} claimed
                <span className="ml-2 text-sm">
                  ({((totalApproved / totalClaimed) * 100).toFixed(1)}% approval rate)
                </span>
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <p className="text-4xl font-bold text-primary mb-2">{approvedCount}</p>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <div className="mt-2 h-1 w-full bg-primary/20 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border-2 border-accent/20 hover:border-accent/40 transition-all hover:shadow-lg">
                <p className="text-4xl font-bold text-accent mb-2">{partialCount}</p>
                <p className="text-sm font-medium text-muted-foreground">Partial</p>
                <div className="mt-2 h-1 w-full bg-accent/20 rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-destructive/10 to-destructive/5 rounded-xl border-2 border-destructive/20 hover:border-destructive/40 transition-all hover:shadow-lg">
                <p className="text-4xl font-bold text-destructive mb-2">{rejectedCount}</p>
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <div className="mt-2 h-1 w-full bg-destructive/20 rounded-full overflow-hidden">
                  <div className="h-full bg-destructive rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>

            {/* Patient & Policy Info */}
            <div className="pt-6 border-t-2 space-y-4">
              <h3 className="text-lg font-semibold mb-4">Claim Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Patient Name</span>
                  <p className="text-base font-semibold mt-1">{patient.name}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Patient Age</span>
                  <p className="text-base font-semibold mt-1">{patient.age} years</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Policy ID</span>
                  <p className="text-base font-semibold mt-1 font-mono">{patient.policyId}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Processed On</span>
                  <p className="text-base font-semibold mt-1">{new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Reference ID */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Reference ID</span>
                  <p className="text-lg font-mono font-bold text-primary mt-1">CLM-{Date.now().toString(36).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
                    <CheckCircle2 className="h-3 w-3" />
                    Audit Logged
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleDownloadSummary} 
              className="gap-2 bg-transparent border-2 text-base px-8 py-6 hover:shadow-lg transition-all"
            >
              <Download className="h-5 w-5" />
              Download Summary Report
            </Button>
            <Button 
              size="lg" 
              onClick={onStartNew} 
              className="gap-2 text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all"
            >
              <RefreshCw className="h-5 w-5" />
              Process New Claim
            </Button>
          </div>

          {/* Footer Note */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Powered by <span className="font-semibold text-primary">ClaimAdjudicate.ai</span> • Agentic AI Claims Adjudication
            </p>
            <p className="text-xs text-muted-foreground">
              All decisions are HIPAA compliant and stored securely for regulatory compliance
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
