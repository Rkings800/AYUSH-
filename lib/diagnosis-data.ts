export interface Diagnosis {
  id: string
  patientId: string
  practitionerId: string
  codes: DiagnosisCode[]
  clinicalStatus: "active" | "recurrence" | "relapse" | "inactive" | "remission" | "resolved"
  verificationStatus: "unconfirmed" | "provisional" | "differential" | "confirmed" | "refuted" | "entered-in-error"
  severity?: "mild" | "moderate" | "severe"
  onsetDate?: string
  recordedDate: string
  notes?: string
  consentId?: string
  encounterId?: string
}

export interface DiagnosisCode {
  system: string
  code: string
  display: string
  primary?: boolean
}

export interface ProblemListEntry {
  id: string
  patientId: string
  diagnosis: Diagnosis
  status: "active" | "inactive" | "resolved"
  priority: "high" | "medium" | "low"
  lastUpdated: string
}

// Mock diagnosis data
export const mockDiagnoses: Diagnosis[] = [
  {
    id: "diag-001",
    patientId: "pat-001",
    practitionerId: "prac-001",
    codes: [
      {
        system: "NAMASTE-Ayurveda",
        code: "AYU001",
        display: "Amavata",
        primary: true,
      },
      {
        system: "ICD-11-TM2",
        code: "TM2-123",
        display: "Amavata (Traditional Medicine)",
      },
      {
        system: "ICD-11-Biomedicine",
        code: "M06.9",
        display: "Rheumatoid arthritis, unspecified",
      },
    ],
    clinicalStatus: "active",
    verificationStatus: "confirmed",
    severity: "moderate",
    onsetDate: "2024-08-15",
    recordedDate: "2024-09-01T14:20:00Z",
    notes: "Patient presents with joint pain and stiffness, consistent with Amavata. Recommended Panchakarma therapy.",
    consentId: "consent-001",
    encounterId: "enc-001",
  },
  {
    id: "diag-002",
    patientId: "pat-002",
    practitionerId: "prac-001",
    codes: [
      {
        system: "NAMASTE-Ayurveda",
        code: "AYU003",
        display: "Prameha",
        primary: true,
      },
      {
        system: "ICD-11-TM2",
        code: "TM2-125",
        display: "Prameha (Traditional Medicine)",
      },
      {
        system: "ICD-11-Biomedicine",
        code: "E14.9",
        display: "Unspecified diabetes mellitus without complications",
      },
    ],
    clinicalStatus: "active",
    verificationStatus: "confirmed",
    severity: "mild",
    onsetDate: "2024-07-20",
    recordedDate: "2024-08-28T11:45:00Z",
    notes: "Diabetes management with traditional Ayurvedic approach. Patient responding well to dietary modifications.",
    consentId: "consent-002",
    encounterId: "enc-002",
  },
]

export const mockProblemList: ProblemListEntry[] = mockDiagnoses.map((diagnosis, index) => ({
  id: `problem-${index + 1}`,
  patientId: diagnosis.patientId,
  diagnosis,
  status: diagnosis.clinicalStatus === "active" ? "active" : "inactive",
  priority: index === 0 ? "high" : "medium",
  lastUpdated: diagnosis.recordedDate,
}))
