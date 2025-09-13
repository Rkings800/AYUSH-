import { type NextRequest, NextResponse } from "next/server"
import { TerminologyService } from "@/lib/terminology-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sourceCode, sourceSystem, targetSystem } = body

    if (!sourceCode || !sourceSystem || !targetSystem) {
      return NextResponse.json(
        { error: "Missing required parameters: sourceCode, sourceSystem, targetSystem" },
        { status: 400 },
      )
    }

    const translations = TerminologyService.translate(sourceCode, sourceSystem, targetSystem)

    return NextResponse.json({
      sourceCode,
      sourceSystem,
      targetSystem,
      translations,
    })
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
