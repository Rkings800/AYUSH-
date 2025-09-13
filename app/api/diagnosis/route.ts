import { type NextRequest, NextResponse } from "next/server"
import { DiagnosisService } from "@/lib/diagnosis-service"

export async function POST(request: NextRequest) {
  try {
    const diagnosisData = await request.json()

    // Validate dual coding
    const validation = DiagnosisService.validateDualCoding(diagnosisData.codes || [])
    if (!validation.isValid) {
      return NextResponse.json({ error: "Validation failed", details: validation.errors }, { status: 400 })
    }

    const diagnosis = await DiagnosisService.create(diagnosisData)

    return NextResponse.json(diagnosis, { status: 201 })
  } catch (error) {
    console.error("Diagnosis creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
