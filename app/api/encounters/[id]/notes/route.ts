import { type NextRequest, NextResponse } from "next/server"
import { EncounterService } from "@/lib/encounter-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const notes = await EncounterService.getClinicalNotes(params.id)
    return NextResponse.json({ notes })
  } catch (error) {
    console.error("Failed to get clinical notes:", error)
    return NextResponse.json({ error: "Failed to get clinical notes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const noteData = await request.json()
    const note = await EncounterService.addClinicalNote({
      ...noteData,
      encounterId: params.id,
    })

    return NextResponse.json({ note }, { status: 201 })
  } catch (error) {
    console.error("Failed to add clinical note:", error)
    return NextResponse.json({ error: "Failed to add clinical note" }, { status: 500 })
  }
}
