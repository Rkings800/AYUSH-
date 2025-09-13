import { type NextRequest, NextResponse } from "next/server"
import { PatientService } from "@/lib/patient-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patient = PatientService.getById(params.id)

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    const result = {
      ...patient,
      age: PatientService.calculateAge(patient.birthDate),
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Patient fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()
    const updatedPatient = await PatientService.update(params.id, updates)

    if (!updatedPatient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    const result = {
      ...updatedPatient,
      age: PatientService.calculateAge(updatedPatient.birthDate),
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Patient update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
