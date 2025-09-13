import { type NextRequest, NextResponse } from "next/server"
import { DiagnosisService } from "@/lib/diagnosis-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const diagnoses = DiagnosisService.getByPatient(params.id)

    return NextResponse.json({
      patientId: params.id,
      count: diagnoses.length,
      diagnoses,
    })
  } catch (error) {
    console.error("Patient diagnoses fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
