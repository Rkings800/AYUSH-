import { type NextRequest, NextResponse } from "next/server"
import { DiagnosisService } from "@/lib/diagnosis-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const diagnosis = DiagnosisService.getById(params.id)

    if (!diagnosis) {
      return NextResponse.json({ error: "Condition not found" }, { status: 404 })
    }

    const fhirCondition = DiagnosisService.toFHIRCondition(diagnosis)

    return NextResponse.json(fhirCondition, {
      headers: {
        "Content-Type": "application/fhir+json",
      },
    })
  } catch (error) {
    console.error("FHIR Condition fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
