import { type NextRequest, NextResponse } from "next/server"
import { DiagnosisService } from "@/lib/diagnosis-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const diagnosis = DiagnosisService.getById(params.id)

    if (!diagnosis) {
      return NextResponse.json({ error: "Diagnosis not found" }, { status: 404 })
    }

    return NextResponse.json(diagnosis)
  } catch (error) {
    console.error("Diagnosis fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()
    const diagnosis = await DiagnosisService.update(params.id, updates)

    if (!diagnosis) {
      return NextResponse.json({ error: "Diagnosis not found" }, { status: 404 })
    }

    return NextResponse.json(diagnosis)
  } catch (error) {
    console.error("Diagnosis update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
