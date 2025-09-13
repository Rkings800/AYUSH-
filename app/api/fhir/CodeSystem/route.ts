import { NextResponse } from "next/server"
import { TerminologyService } from "@/lib/terminology-service"

export async function GET() {
  try {
    const codeSystem = TerminologyService.generateFHIRCodeSystem()

    return NextResponse.json(codeSystem, {
      headers: {
        "Content-Type": "application/fhir+json",
      },
    })
  } catch (error) {
    console.error("FHIR CodeSystem error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
