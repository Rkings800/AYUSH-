import { type NextRequest, NextResponse } from "next/server"
import { ConsentService } from "@/lib/consent-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const consents = ConsentService.getByPatient(params.id)

    return NextResponse.json({
      patientId: params.id,
      count: consents.length,
      consents,
    })
  } catch (error) {
    console.error("Patient consents fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
