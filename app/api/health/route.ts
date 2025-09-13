import { NextResponse } from "next/server"
import { IntegrationHealthService } from "@/lib/integration-health"

export async function GET() {
  try {
    const healthService = new IntegrationHealthService()
    const healthChecks = await healthService.runAllHealthChecks()
    const overallHealth = healthService.getOverallHealth()

    return NextResponse.json({
      status: overallHealth,
      checks: healthChecks,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
