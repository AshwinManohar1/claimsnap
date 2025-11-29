declare module "jspdf-autotable" {
  import { jsPDF } from "jspdf"

  interface ColumnInput {
    header?: string
    dataKey?: string
    cellWidth?: number | "auto" | "wrap"
    halign?: "left" | "center" | "right"
    valign?: "top" | "middle" | "bottom"
    fontStyle?: "normal" | "bold" | "italic" | "bolditalic"
    textColor?: number | number[]
    fillColor?: number | number[]
  }

  interface UserOptions {
    head?: any[][]
    body?: any[][]
    foot?: any[][]
    columns?: ColumnInput[]
    theme?: "striped" | "grid" | "plain"
    styles?: any
    headStyles?: any
    bodyStyles?: any
    footStyles?: any
    alternateRowStyles?: any
    columnStyles?: { [key: number]: any }
    margin?: number | { top?: number; right?: number; bottom?: number; left?: number }
    startY?: number
    didParseCell?: (data: any) => void
    didDrawCell?: (data: any) => void
    didDrawPage?: (data: any) => void
    [key: string]: any
  }

  export default function autoTable(doc: jsPDF, options: UserOptions): jsPDF
}

