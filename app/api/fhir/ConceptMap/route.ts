import { NextResponse } from "next/server"
import { TerminologyService } from "@/lib/terminology-service"

export async function GET() {
  try {
    const conceptMap = TerminologyService.generateFHIRConceptMap()

    return NextResponse.json(conceptMap, {
      headers: {
        "Content-Type": "application/fhir+json",
      },
    })
  } catch (error) {
    console.error("FHIR ConceptMap error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
