import { type NextRequest, NextResponse } from "next/server"
import { EncounterService } from "@/lib/encounter-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId")
    const status = searchParams.get("status")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")
    const practitioner = searchParams.get("practitioner")

    const result = await EncounterService.searchEncounters({
      patientId: patientId || undefined,
      status: status || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      practitioner: practitioner || undefined,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Failed to search encounters:", error)
    return NextResponse.json({ error: "Failed to search encounters" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const encounterData = await request.json()
    const encounter = await EncounterService.createEncounter(encounterData)

    return NextResponse.json({ encounter }, { status: 201 })
  } catch (error) {
    console.error("Failed to create encounter:", error)
    return NextResponse.json({ error: "Failed to create encounter" }, { status: 500 })
  }
}
