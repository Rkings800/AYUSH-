import { type NextRequest, NextResponse } from "next/server"
import { TerminologyService } from "@/lib/terminology-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const system = searchParams.get("system")

    if (!code || !system) {
      return NextResponse.json({ error: "Missing required parameters: code, system" }, { status: 400 })
    }

    const mappings = TerminologyService.getMappings(code, system)
    const sourceTerm = TerminologyService.getByCode(code, system)

    return NextResponse.json({
      source: sourceTerm,
      mappings,
    })
  } catch (error) {
    console.error("Mappings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
