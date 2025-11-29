import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

interface ClaimData {
  patient?: { name: string; age: number; policyId: string }
  totalClaimed?: number
  totalApproved?: number
  approvedCount?: number
  partialCount?: number
  rejectedCount?: number
  items?: any[]
}

export function generateClaimPDF(data: ClaimData): void {
  const patient = data?.patient || { name: "Unknown", age: 0, policyId: "N/A" }
  const totalClaimed = data?.totalClaimed || 0
  const totalApproved = data?.totalApproved || 0
  const approvedCount = data?.approvedCount || 0
  const partialCount = data?.partialCount || 0
  const rejectedCount = data?.rejectedCount || 0
  const items = data?.items || []

  // Create new PDF document
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  let yPosition = 20

  // Colors
  const primaryColor: [number, number, number] = [95, 99, 242] // Purple/Blue
  const textColor: [number, number, number] = [51, 51, 51]
  const lightGray: [number, number, number] = [245, 245, 245]

  // ===== HEADER =====
  // Logo placeholder (text-based)
  doc.setFillColor(...primaryColor)
  doc.rect(margin, yPosition, 10, 10, "F")
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...primaryColor)
  doc.text("ClaimAdjudicate.ai", margin + 15, yPosition + 7)

  // Header right side - Document info
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...textColor)
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const timeStr = new Date().toLocaleTimeString("en-US")
  doc.text(`Generated: ${dateStr}`, pageWidth - margin, yPosition, { align: "right" })
  doc.text(`Time: ${timeStr}`, pageWidth - margin, yPosition + 5, { align: "right" })

  yPosition += 20

  // Horizontal line
  doc.setDrawColor(200, 200, 200)
  doc.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 15

  // ===== TITLE =====
  doc.setFontSize(22)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...textColor)
  doc.text("CLAIM ADJUDICATION REPORT", pageWidth / 2, yPosition, { align: "center" })
  yPosition += 8

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(100, 100, 100)
  doc.text("Official Claims Processing Summary", pageWidth / 2, yPosition, { align: "center" })
  yPosition += 15

  // ===== REFERENCE ID BOX =====
  const refId = `CLM-${Date.now().toString(36).toUpperCase()}`
  doc.setFillColor(...lightGray)
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 15, 3, 3, "F")
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...textColor)
  doc.text("Reference ID:", margin + 5, yPosition + 6)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...primaryColor)
  doc.text(refId, margin + 35, yPosition + 6)
  doc.setTextColor(...textColor)
  doc.setFontSize(8)
  doc.text("Status: APPROVED", pageWidth - margin - 5, yPosition + 6, { align: "right" })
  doc.setFillColor(34, 197, 94)
  doc.circle(pageWidth - margin - 30, yPosition + 5, 2, "F")
  yPosition += 25

  // ===== FINANCIAL SUMMARY BOX =====
  doc.setFillColor(...primaryColor)
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 30, 3, 3, "F")

  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(255, 255, 255)
  doc.text("APPROVED AMOUNT", pageWidth / 2, yPosition + 8, { align: "center" })

  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text(`INR ${totalApproved.toLocaleString()}`, pageWidth / 2, yPosition + 19, { align: "center" })

  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  const approvalRate = ((totalApproved / totalClaimed) * 100).toFixed(1)
  doc.text(
    `of INR ${totalClaimed.toLocaleString()} claimed (${approvalRate}% approval rate)`,
    pageWidth / 2,
    yPosition + 26,
    { align: "center" },
  )
  yPosition += 40

  // ===== CLAIM STATISTICS =====
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...textColor)
  doc.text("Claim Statistics", margin, yPosition)
  yPosition += 10

  const statsBoxHeight = 20
  const statsBoxWidth = (pageWidth - 2 * margin - 10) / 3

  // Approved box
  doc.setFillColor(220, 252, 231)
  doc.roundedRect(margin, yPosition, statsBoxWidth, statsBoxHeight, 2, 2, "F")
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(34, 197, 94)
  doc.text(approvedCount.toString(), margin + statsBoxWidth / 2, yPosition + 10, { align: "center" })
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...textColor)
  doc.text("Approved", margin + statsBoxWidth / 2, yPosition + 16, { align: "center" })

  // Partial box
  doc.setFillColor(254, 243, 199)
  doc.roundedRect(margin + statsBoxWidth + 5, yPosition, statsBoxWidth, statsBoxHeight, 2, 2, "F")
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(245, 158, 11)
  doc.text(partialCount.toString(), margin + statsBoxWidth * 1.5 + 5, yPosition + 10, { align: "center" })
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...textColor)
  doc.text("Partial", margin + statsBoxWidth * 1.5 + 5, yPosition + 16, { align: "center" })

  // Rejected box
  doc.setFillColor(254, 226, 226)
  doc.roundedRect(margin + 2 * statsBoxWidth + 10, yPosition, statsBoxWidth, statsBoxHeight, 2, 2, "F")
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(239, 68, 68)
  doc.text(rejectedCount.toString(), margin + statsBoxWidth * 2.5 + 10, yPosition + 10, { align: "center" })
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...textColor)
  doc.text("Rejected", margin + statsBoxWidth * 2.5 + 10, yPosition + 16, { align: "center" })
  yPosition += statsBoxHeight + 15

  // ===== PATIENT INFORMATION =====
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...textColor)
  doc.text("Patient & Policy Information", margin, yPosition)
  yPosition += 2

  // Patient info table
  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: [
      ["Patient Name", patient.name],
      ["Patient Age", `${patient.age} years`],
      ["Policy ID", patient.policyId],
      ["Processed On", new Date().toLocaleString()],
      ["Processing Method", "AI-Powered Adjudication with Human Oversight"],
    ],
    theme: "plain",
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60, textColor: [100, 100, 100] },
      1: { cellWidth: "auto", textColor: textColor },
    },
    margin: { left: margin, right: margin },
  })

  yPosition = (doc as any).lastAutoTable.finalY + 15

  // ===== DETAILED ITEM BREAKDOWN =====
  if (yPosition > pageHeight - 80) {
    doc.addPage()
    yPosition = 20
  }

  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...textColor)
  doc.text("Detailed Item Breakdown", margin, yPosition)
  yPosition += 5

  // Items table
  const tableData = items.map((item: any, index: number) => [
    (index + 1).toString(),
    item.item || "N/A",
    item.category || "N/A",
    `INR ${(item.claimed || 0).toLocaleString()}`,
    `INR ${(item.approved || 0).toLocaleString()}`,
    item.status || "N/A",
    item.reason || "N/A",
  ])

  autoTable(doc, {
    startY: yPosition,
    head: [["#", "Item", "Category", "Claimed", "Approved", "Status", "Reason"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 35 },
      2: { cellWidth: 25 },
      3: { cellWidth: 22, halign: "right" },
      4: { cellWidth: 22, halign: "right" },
      5: { cellWidth: 20, halign: "center" },
      6: { cellWidth: "auto" },
    },
    margin: { left: margin, right: margin },
    didParseCell: function (data) {
      if (data.section === "body" && data.column.index === 5) {
        const status = data.cell.raw as string
        if (status === "Approved") {
          data.cell.styles.textColor = [34, 197, 94]
          data.cell.styles.fontStyle = "bold"
        } else if (status === "Partial") {
          data.cell.styles.textColor = [245, 158, 11]
          data.cell.styles.fontStyle = "bold"
        } else if (status === "Rejected") {
          data.cell.styles.textColor = [239, 68, 68]
          data.cell.styles.fontStyle = "bold"
        }
      }
    },
  })

  yPosition = (doc as any).lastAutoTable.finalY + 15

  // ===== FOOTER SECTION =====
  if (yPosition > pageHeight - 50) {
    doc.addPage()
    yPosition = 20
  }

  // Important notes
  doc.setFillColor(255, 251, 235)
  doc.setDrawColor(245, 158, 11)
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 30, 2, 2, "FD")
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(120, 53, 15)
  doc.text("Important Information", margin + 5, yPosition + 6)
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(80, 40, 10)
  doc.text("• This document is an official record of the claim adjudication process.", margin + 5, yPosition + 12)
  doc.text(
    "• All decisions comply with HIPAA regulations and are securely stored for audit purposes.",
    margin + 5,
    yPosition + 17,
  )
  doc.text(
    "• This adjudication was performed using AI-powered analysis with human verification.",
    margin + 5,
    yPosition + 22,
  )
  doc.text(
    `• For queries or appeals, please contact: claims@claimadjudicate.ai (Ref: ${refId})`,
    margin + 5,
    yPosition + 27,
  )
  yPosition += 40

  // Final footer
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text(
    "This is a computer-generated document and does not require a physical signature.",
    pageWidth / 2,
    yPosition,
    { align: "center" },
  )
  yPosition += 5
  doc.text(
    "Powered by ClaimAdjudicate.ai - Transforming Healthcare Claims with Agentic AI",
    pageWidth / 2,
    yPosition,
    { align: "center" },
  )

  // Page numbers on all pages
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: "right" })
    doc.text("CONFIDENTIAL - For Authorized Use Only", margin, pageHeight - 10)
  }

  // Open PDF in new tab
  const pdfBlob = doc.output("blob")
  const pdfUrl = URL.createObjectURL(pdfBlob)
  window.open(pdfUrl, "_blank")

  // Clean up the URL after a delay
  setTimeout(() => URL.revokeObjectURL(pdfUrl), 100)
}

