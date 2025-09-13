import { type NextRequest, NextResponse } from "next/server"
import { SyncService } from "@/lib/sync-service"

export async function POST(request: NextRequest) {
  try {
    const { resourceType } = await request.json()
    const syncService = new SyncService()

    let result
    switch (resourceType) {
      case "Patient":
        result = await syncService.syncPatients()
        break
      case "Encounter":
        result = await syncService.syncEncounters()
        break
      case "Condition":
        result = await syncService.syncConditions()
        break
      case "all":
        result = await syncService.fullSync()
        break
      default:
        return NextResponse.json({ error: "Invalid resource type" }, { status: 400 })
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error("Sync failed:", error)
    return NextResponse.json({ error: "Sync failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const resourceType = searchParams.get("resourceType")

    const syncService = new SyncService()

    if (resourceType) {
      const status = syncService.getSyncStatus(resourceType)
      return NextResponse.json({ status })
    } else {
      const statuses = syncService.getAllSyncStatuses()
      return NextResponse.json({ statuses })
    }
  } catch (error) {
    console.error("Failed to get sync status:", error)
    return NextResponse.json({ error: "Failed to get sync status" }, { status: 500 })
  }
}
