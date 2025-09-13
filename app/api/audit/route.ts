import { type NextRequest, NextResponse } from "next/server"
import { ConsentService } from "@/lib/consent-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const auditEvents = ConsentService.getAuditEvents(patientId || undefined, limit)

    return NextResponse.json({
      count: auditEvents.length,
      events: auditEvents,
    })
  } catch (error) {
    console.error("Audit events fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
