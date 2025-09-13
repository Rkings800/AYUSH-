import { type NextRequest, NextResponse } from "next/server"
import { TerminologyService } from "@/lib/terminology-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const system = searchParams.get("system") || "all"

    if (!query.trim()) {
      return NextResponse.json({ results: [] })
    }

    let results = TerminologyService.search(query, limit)

    // Filter by system if specified
    if (system !== "all") {
      results = results.filter((result) => result.system.toLowerCase().includes(system.toLowerCase()))
    }

    return NextResponse.json({
      query,
      system,
      count: results.length,
      results,
    })
  } catch (error) {
    console.error("Terminology search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
