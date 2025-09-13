import { type Encounter, type ClinicalNote, mockEncounters, mockClinicalNotes } from "./encounter-data"

export class EncounterService {
  static async searchEncounters(params: {
    patientId?: string
    status?: string
    dateFrom?: string
    dateTo?: string
    practitioner?: string
  }): Promise<{ encounters: Encounter[]; total: number }> {
    let filtered = [...mockEncounters]

    if (params.patientId) {
      filtered = filtered.filter((enc) => enc.subject.reference === `Patient/${params.patientId}`)
    }

    if (params.status) {
      filtered = filtered.filter((enc) => enc.status === params.status)
    }

    if (params.dateFrom) {
      filtered = filtered.filter((enc) => new Date(enc.period.start) >= new Date(params.dateFrom!))
    }

    if (params.dateTo) {
      filtered = filtered.filter((enc) => new Date(enc.period.start) <= new Date(params.dateTo!))
    }

    if (params.practitioner) {
      filtered = filtered.filter((enc) =>
        enc.participant.some((p) => p.individual.reference === `Practitioner/${params.practitioner}`),
      )
    }

    return {
      encounters: filtered,
      total: filtered.length,
    }
  }

  static async getEncounter(id: string): Promise<Encounter | null> {
    return mockEncounters.find((enc) => enc.id === id) || null
  }

  static async createEncounter(encounterData: Partial<Encounter>): Promise<Encounter> {
    const newEncounter: Encounter = {
      id: `enc-${Date.now()}`,
      status: "planned",
      class: {
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        code: "AMB",
        display: "ambulatory",
      },
      subject: encounterData.subject!,
      participant: encounterData.participant || [],
      period: {
        start: encounterData.period?.start || new Date().toISOString(),
      },
      meta: {
        lastUpdated: new Date().toISOString(),
        versionId: "1",
      },
      ...encounterData,
    }

    mockEncounters.push(newEncounter)
    return newEncounter
  }

  static async updateEncounter(id: string, updates: Partial<Encounter>): Promise<Encounter | null> {
    const index = mockEncounters.findIndex((enc) => enc.id === id)
    if (index === -1) return null

    mockEncounters[index] = {
      ...mockEncounters[index],
      ...updates,
      meta: {
        ...mockEncounters[index].meta,
        lastUpdated: new Date().toISOString(),
        versionId: (Number.parseInt(mockEncounters[index].meta.versionId) + 1).toString(),
      },
    }

    return mockEncounters[index]
  }

  static async getClinicalNotes(encounterId: string): Promise<ClinicalNote[]> {
    return mockClinicalNotes.filter((note) => note.encounterId === encounterId)
  }

  static async addClinicalNote(noteData: Omit<ClinicalNote, "id" | "created">): Promise<ClinicalNote> {
    const newNote: ClinicalNote = {
      id: `note-${Date.now()}`,
      created: new Date().toISOString(),
      ...noteData,
    }

    mockClinicalNotes.push(newNote)
    return newNote
  }

  static async toFHIREncounter(encounter: Encounter): Promise<any> {
    return {
      resourceType: "Encounter",
      id: encounter.id,
      status: encounter.status,
      class: encounter.class,
      type: encounter.type,
      subject: encounter.subject,
      participant: encounter.participant,
      period: encounter.period,
      reasonCode: encounter.reasonCode,
      diagnosis: encounter.diagnosis,
      location: encounter.location,
      serviceProvider: encounter.serviceProvider,
      meta: encounter.meta,
    }
  }
}
