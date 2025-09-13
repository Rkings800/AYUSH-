import { type NextRequest, NextResponse } from "next/server"
import { PatientService } from "@/lib/patient-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patient = PatientService.getById(params.id)

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    const fhirPatient = PatientService.toFHIRPatient(patient)

    return NextResponse.json(fhirPatient, {
      headers: {
        "Content-Type": "application/fhir+json",
      },
    })
  } catch (error) {
    console.error("FHIR Patient fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
