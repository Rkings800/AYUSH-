import { type NextRequest, NextResponse } from "next/server"
import { DiagnosisService } from "@/lib/diagnosis-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const problemList = DiagnosisService.getProblemList(params.id)

    return NextResponse.json({
      patientId: params.id,
      count: problemList.length,
      problems: problemList,
    })
  } catch (error) {
    console.error("Problem list fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
