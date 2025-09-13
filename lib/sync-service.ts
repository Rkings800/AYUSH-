import { FHIRClient } from "./fhir-client"

export interface SyncStatus {
  lastSync: string | null
  status: "idle" | "syncing" | "error" | "success"
  resourceType: string
  totalRecords: number
  syncedRecords: number
  errors: string[]
}

export interface SyncResult {
  success: boolean
  resourceType: string
  created: number
  updated: number
  errors: string[]
}

export class SyncService {
  private fhirClient: FHIRClient
  private syncStatuses: Map<string, SyncStatus> = new Map()

  constructor() {
    this.fhirClient = new FHIRClient()
  }

  async syncPatients(): Promise<SyncResult> {
    const resourceType = "Patient"
    this.updateSyncStatus(resourceType, { status: "syncing", errors: [] })

    try {
      // Get local patients that need syncing
      const localPatients = await this.getLocalPatientsForSync()
      let created = 0
      let updated = 0
      const errors: string[] = []

      for (const patient of localPatients) {
        try {
          if (patient.fhirId) {
            // Update existing resource
            await this.fhirClient.update(patient.fhirResource)
            updated++
          } else {
            // Create new resource
            const result = await this.fhirClient.create(patient.fhirResource)
            // Update local record with FHIR ID
            await this.updateLocalPatientFhirId(patient.id, result.id!)
            created++
          }
        } catch (error) {
          errors.push(`Patient ${patient.id}: ${error}`)
        }
      }

      this.updateSyncStatus(resourceType, {
        status: "success",
        syncedRecords: created + updated,
        errors,
      })

      return { success: true, resourceType, created, updated, errors }
    } catch (error) {
      this.updateSyncStatus(resourceType, {
        status: "error",
        errors: [error instanceof Error ? error.message : String(error)],
      })
      throw error
    }
  }

  async syncEncounters(): Promise<SyncResult> {
    const resourceType = "Encounter"
    this.updateSyncStatus(resourceType, { status: "syncing", errors: [] })

    try {
      const localEncounters = await this.getLocalEncountersForSync()
      let created = 0
      let updated = 0
      const errors: string[] = []

      for (const encounter of localEncounters) {
        try {
          if (encounter.fhirId) {
            await this.fhirClient.update(encounter.fhirResource)
            updated++
          } else {
            const result = await this.fhirClient.create(encounter.fhirResource)
            await this.updateLocalEncounterFhirId(encounter.id, result.id!)
            created++
          }
        } catch (error) {
          errors.push(`Encounter ${encounter.id}: ${error}`)
        }
      }

      this.updateSyncStatus(resourceType, {
        status: "success",
        syncedRecords: created + updated,
        errors,
      })

      return { success: true, resourceType, created, updated, errors }
    } catch (error) {
      this.updateSyncStatus(resourceType, {
        status: "error",
        errors: [error instanceof Error ? error.message : String(error)],
      })
      throw error
    }
  }

  async syncConditions(): Promise<SyncResult> {
    const resourceType = "Condition"
    this.updateSyncStatus(resourceType, { status: "syncing", errors: [] })

    try {
      const localConditions = await this.getLocalConditionsForSync()
      let created = 0
      let updated = 0
      const errors: string[] = []

      for (const condition of localConditions) {
        try {
          if (condition.fhirId) {
            await this.fhirClient.update(condition.fhirResource)
            updated++
          } else {
            const result = await this.fhirClient.create(condition.fhirResource)
            await this.updateLocalConditionFhirId(condition.id, result.id!)
            created++
          }
        } catch (error) {
          errors.push(`Condition ${condition.id}: ${error}`)
        }
      }

      this.updateSyncStatus(resourceType, {
        status: "success",
        syncedRecords: created + updated,
        errors,
      })

      return { success: true, resourceType, created, updated, errors }
    } catch (error) {
      this.updateSyncStatus(resourceType, {
        status: "error",
        errors: [error instanceof Error ? error.message : String(error)],
      })
      throw error
    }
  }

  async fullSync(): Promise<SyncResult[]> {
    const results: SyncResult[] = []

    try {
      results.push(await this.syncPatients())
      results.push(await this.syncEncounters())
      results.push(await this.syncConditions())
    } catch (error) {
      console.error("Full sync failed:", error)
    }

    return results
  }

  getSyncStatus(resourceType: string): SyncStatus | null {
    return this.syncStatuses.get(resourceType) || null
  }

  getAllSyncStatuses(): SyncStatus[] {
    return Array.from(this.syncStatuses.values())
  }

  private updateSyncStatus(resourceType: string, updates: Partial<SyncStatus>) {
    const current = this.syncStatuses.get(resourceType) || {
      lastSync: null,
      status: "idle" as const,
      resourceType,
      totalRecords: 0,
      syncedRecords: 0,
      errors: [],
    }

    this.syncStatuses.set(resourceType, {
      ...current,
      ...updates,
      lastSync: updates.status === "success" ? new Date().toISOString() : current.lastSync,
    })
  }

  // Mock methods - in real implementation, these would query the actual database
  private async getLocalPatientsForSync(): Promise<any[]> {
    // Return patients that have been modified since last sync
    return []
  }

  private async getLocalEncountersForSync(): Promise<any[]> {
    return []
  }

  private async getLocalConditionsForSync(): Promise<any[]> {
    return []
  }

  private async updateLocalPatientFhirId(localId: string, fhirId: string): Promise<void> {
    // Update local database with FHIR ID
  }

  private async updateLocalEncounterFhirId(localId: string, fhirId: string): Promise<void> {
    // Update local database with FHIR ID
  }

  private async updateLocalConditionFhirId(localId: string, fhirId: string): Promise<void> {
    // Update local database with FHIR ID
  }
}
