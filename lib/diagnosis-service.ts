import { mockDiagnoses, mockProblemList, type Diagnosis, type ProblemListEntry } from "./diagnosis-data"

export class DiagnosisService {
  // Get diagnoses for a patient
  static getByPatient(patientId: string): Diagnosis[] {
    return mockDiagnoses.filter((diagnosis) => diagnosis.patientId === patientId)
  }

  // Get diagnosis by ID
  static getById(id: string): Diagnosis | null {
    return mockDiagnoses.find((diagnosis) => diagnosis.id === id) || null
  }

  // Get problem list for a patient
  static getProblemList(patientId: string): ProblemListEntry[] {
    return mockProblemList.filter((entry) => entry.patientId === patientId)
  }

  // Create new diagnosis
  static async create(diagnosisData: Omit<Diagnosis, "id" | "recordedDate">): Promise<Diagnosis> {
    const newDiagnosis: Diagnosis = {
      ...diagnosisData,
      id: `diag-${Date.now()}`,
      recordedDate: new Date().toISOString(),
    }

    // In real implementation, this would save to database
    mockDiagnoses.push(newDiagnosis)

    // Add to problem list
    const problemEntry: ProblemListEntry = {
      id: `problem-${Date.now()}`,
      patientId: newDiagnosis.patientId,
      diagnosis: newDiagnosis,
      status: newDiagnosis.clinicalStatus === "active" ? "active" : "inactive",
      priority: "medium",
      lastUpdated: newDiagnosis.recordedDate,
    }
    mockProblemList.push(problemEntry)

    return newDiagnosis
  }

  // Update diagnosis
  static async update(id: string, updates: Partial<Diagnosis>): Promise<Diagnosis | null> {
    const diagnosisIndex = mockDiagnoses.findIndex((d) => d.id === id)
    if (diagnosisIndex === -1) return null

    mockDiagnoses[diagnosisIndex] = { ...mockDiagnoses[diagnosisIndex], ...updates }

    // Update problem list entry
    const problemIndex = mockProblemList.findIndex((p) => p.diagnosis.id === id)
    if (problemIndex !== -1) {
      mockProblemList[problemIndex].diagnosis = mockDiagnoses[diagnosisIndex]
      mockProblemList[problemIndex].lastUpdated = new Date().toISOString()
    }

    return mockDiagnoses[diagnosisIndex]
  }

  // Generate FHIR Condition resource
  static toFHIRCondition(diagnosis: Diagnosis) {
    return {
      resourceType: "Condition",
      id: diagnosis.id,
      clinicalStatus: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
            code: diagnosis.clinicalStatus,
            display: diagnosis.clinicalStatus,
          },
        ],
      },
      verificationStatus: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/condition-ver-status",
            code: diagnosis.verificationStatus,
            display: diagnosis.verificationStatus,
          },
        ],
      },
      code: {
        coding: diagnosis.codes.map((code) => ({
          system: this.getSystemUrl(code.system),
          code: code.code,
          display: code.display,
        })),
      },
      subject: {
        reference: `Patient/${diagnosis.patientId}`,
      },
      encounter: diagnosis.encounterId
        ? {
            reference: `Encounter/${diagnosis.encounterId}`,
          }
        : undefined,
      onsetDateTime: diagnosis.onsetDate,
      recordedDate: diagnosis.recordedDate,
      recorder: {
        reference: `Practitioner/${diagnosis.practitionerId}`,
      },
      severity: diagnosis.severity
        ? {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: this.getSeverityCode(diagnosis.severity),
                display: diagnosis.severity,
              },
            ],
          }
        : undefined,
      note: diagnosis.notes
        ? [
            {
              text: diagnosis.notes,
            },
          ]
        : undefined,
      extension: diagnosis.consentId
        ? [
            {
              url: "http://hl7.org/fhir/StructureDefinition/consent",
              valueReference: {
                reference: `Consent/${diagnosis.consentId}`,
              },
            },
          ]
        : undefined,
    }
  }

  // Helper method to get FHIR system URLs
  private static getSystemUrl(system: string): string {
    const systemMap: { [key: string]: string } = {
      "NAMASTE-Ayurveda": "http://example.org/fhir/CodeSystem/namaste-ayurveda",
      "NAMASTE-Siddha": "http://example.org/fhir/CodeSystem/namaste-siddha",
      "NAMASTE-Unani": "http://example.org/fhir/CodeSystem/namaste-unani",
      "ICD-11-TM2": "http://id.who.int/icd/release/11/mms/tm2",
      "ICD-11-Biomedicine": "http://id.who.int/icd/release/11/mms",
      "SNOMED-CT": "http://snomed.info/sct",
    }
    return systemMap[system] || system
  }

  // Helper method to get severity codes
  private static getSeverityCode(severity: string): string {
    const severityMap: { [key: string]: string } = {
      mild: "255604002",
      moderate: "6736007",
      severe: "24484000",
    }
    return severityMap[severity] || severity
  }

  // Validate dual coding compliance
  static validateDualCoding(codes: any[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Check for at least one NAMASTE code
    const namasteCode = codes.find((code) => code.system.includes("NAMASTE"))
    if (!namasteCode) {
      errors.push("At least one NAMASTE code is required")
    }

    // Check for ICD-11 mapping
    const icd11Code = codes.find((code) => code.system.includes("ICD-11"))
    if (!icd11Code) {
      errors.push("ICD-11 mapping is required for international compliance")
    }

    // Check for primary code designation
    const primaryCode = codes.find((code) => code.primary)
    if (!primaryCode) {
      errors.push("One code must be designated as primary")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}
