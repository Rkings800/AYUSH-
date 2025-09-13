import { type NextRequest, NextResponse } from "next/server"
import { ConsentService } from "@/lib/consent-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const consent = ConsentService.getById(params.id)

    if (!consent) {
      return NextResponse.json({ error: "Consent not found" }, { status: 404 })
    }

    return NextResponse.json(consent)
  } catch (error) {
    console.error("Consent fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status, practitionerId } = await request.json()
    const consent = await ConsentService.updateStatus(params.id, status, practitionerId)

    if (!consent) {
      return NextResponse.json({ error: "Consent not found" }, { status: 404 })
    }

    return NextResponse.json(consent)
  } catch (error) {
    console.error("Consent update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
