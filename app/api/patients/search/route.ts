import { type NextRequest, NextResponse } from "next/server"
import { PatientService } from "@/lib/patient-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const practitionerId = searchParams.get("practitioner") || "prac-001"

    let patients = PatientService.getByPractitioner(practitionerId)

    if (query.trim()) {
      patients = PatientService.search(query).filter((p) => p.practitionerId === practitionerId)
    }

    const results = patients.map((patient) => ({
      ...patient,
      age: PatientService.calculateAge(patient.birthDate),
    }))

    return NextResponse.json({
      query,
      count: results.length,
      patients: results,
    })
  } catch (error) {
    console.error("Patient search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
