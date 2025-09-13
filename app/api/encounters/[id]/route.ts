import { type NextRequest, NextResponse } from "next/server"
import { EncounterService } from "@/lib/encounter-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const encounter = await EncounterService.getEncounter(params.id)

    if (!encounter) {
      return NextResponse.json({ error: "Encounter not found" }, { status: 404 })
    }

    return NextResponse.json({ encounter })
  } catch (error) {
    console.error("Failed to get encounter:", error)
    return NextResponse.json({ error: "Failed to get encounter" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()
    const encounter = await EncounterService.updateEncounter(params.id, updates)

    if (!encounter) {
      return NextResponse.json({ error: "Encounter not found" }, { status: 404 })
    }

    return NextResponse.json({ encounter })
  } catch (error) {
    console.error("Failed to update encounter:", error)
    return NextResponse.json({ error: "Failed to update encounter" }, { status: 500 })
  }
}
