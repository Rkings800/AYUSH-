import { type NextRequest, NextResponse } from "next/server"
import { ConsentService } from "@/lib/consent-service"

export async function POST(request: NextRequest) {
  try {
    const consentData = await request.json()
    const consent = await ConsentService.create(consentData)

    return NextResponse.json(consent, { status: 201 })
  } catch (error) {
    console.error("Consent creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
