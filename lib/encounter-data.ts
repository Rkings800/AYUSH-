export interface Encounter {
  id: string
  status: "planned" | "arrived" | "triaged" | "in-progress" | "onleave" | "finished" | "cancelled"
  class: {
    system: string
    code: string
    display: string
  }
  type?: Array<{
    coding: Array<{
      system: string
      code: string
      display: string
    }>
  }>
  subject: {
    reference: string
    display: string
  }
  participant: Array<{
    type: Array<{
      coding: Array<{
        system: string
        code: string
        display: string
      }>
    }>
    individual: {
      reference: string
      display: string
    }
  }>
  period: {
    start: string
    end?: string
  }
  reasonCode?: Array<{
    coding: Array<{
      system: string
      code: string
      display: string
    }>
    text: string
  }>
  diagnosis?: Array<{
    condition: {
      reference: string
      display: string
    }
    use: {
      coding: Array<{
        system: string
        code: string
        display: string
      }>
    }
    rank: number
  }>
  location?: Array<{
    location: {
      reference: string
      display: string
    }
    status: string
    period: {
      start: string
      end?: string
    }
  }>
  serviceProvider?: {
    reference: string
    display: string
  }
  meta: {
    lastUpdated: string
    versionId: string
  }
}

export interface ClinicalNote {
  id: string
  encounterId: string
  type: "progress" | "assessment" | "plan" | "general"
  text: string
  author: {
    reference: string
    display: string
  }
  created: string
  status: "draft" | "final" | "amended"
}

// Mock encounter data
export const mockEncounters: Encounter[] = [
  {
    id: "enc-001",
    status: "finished",
    class: {
      system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
      code: "AMB",
      display: "ambulatory",
    },
    type: [
      {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: "185349003",
            display: "Encounter for check up",
          },
        ],
      },
    ],
    subject: {
      reference: "Patient/pat-001",
      display: "Rajesh Kumar",
    },
    participant: [
      {
        type: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
                code: "PPRF",
                display: "primary performer",
              },
            ],
          },
        ],
        individual: {
          reference: "Practitioner/prac-001",
          display: "Dr. Priya Sharma",
        },
      },
    ],
    period: {
      start: "2024-01-15T09:00:00Z",
      end: "2024-01-15T09:45:00Z",
    },
    reasonCode: [
      {
        coding: [
          {
            system: "http://hl7.org/fhir/sid/icd-10",
            code: "Z00.00",
            display: "General adult medical examination",
          },
        ],
        text: "Routine health checkup",
      },
    ],
    diagnosis: [
      {
        condition: {
          reference: "Condition/cond-001",
          display: "Essential hypertension",
        },
        use: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/diagnosis-role",
              code: "AD",
              display: "Admission diagnosis",
            },
          ],
        },
        rank: 1,
      },
    ],
    location: [
      {
        location: {
          reference: "Location/loc-001",
          display: "Consultation Room 1",
        },
        status: "completed",
        period: {
          start: "2024-01-15T09:00:00Z",
          end: "2024-01-15T09:45:00Z",
        },
      },
    ],
    serviceProvider: {
      reference: "Organization/org-001",
      display: "Ayurveda Wellness Center",
    },
    meta: {
      lastUpdated: "2024-01-15T09:45:00Z",
      versionId: "1",
    },
  },
  {
    id: "enc-002",
    status: "in-progress",
    class: {
      system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
      code: "AMB",
      display: "ambulatory",
    },
    type: [
      {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: "185347001",
            display: "Encounter for problem",
          },
        ],
      },
    ],
    subject: {
      reference: "Patient/pat-002",
      display: "Meera Patel",
    },
    participant: [
      {
        type: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
                code: "PPRF",
                display: "primary performer",
              },
            ],
          },
        ],
        individual: {
          reference: "Practitioner/prac-001",
          display: "Dr. Priya Sharma",
        },
      },
    ],
    period: {
      start: "2024-01-16T14:30:00Z",
    },
    reasonCode: [
      {
        coding: [
          {
            system: "http://hl7.org/fhir/sid/icd-10",
            code: "M79.3",
            display: "Panniculitis, unspecified",
          },
        ],
        text: "Joint pain and stiffness",
      },
    ],
    location: [
      {
        location: {
          reference: "Location/loc-001",
          display: "Consultation Room 1",
        },
        status: "active",
        period: {
          start: "2024-01-16T14:30:00Z",
        },
      },
    ],
    serviceProvider: {
      reference: "Organization/org-001",
      display: "Ayurveda Wellness Center",
    },
    meta: {
      lastUpdated: "2024-01-16T14:30:00Z",
      versionId: "1",
    },
  },
]

export const mockClinicalNotes: ClinicalNote[] = [
  {
    id: "note-001",
    encounterId: "enc-001",
    type: "assessment",
    text: "Patient presents with elevated blood pressure readings. Pulse examination reveals irregular rhythm. Tongue examination shows coating indicating digestive imbalance. Recommended dietary modifications and herbal treatment.",
    author: {
      reference: "Practitioner/prac-001",
      display: "Dr. Priya Sharma",
    },
    created: "2024-01-15T09:30:00Z",
    status: "final",
  },
  {
    id: "note-002",
    encounterId: "enc-001",
    type: "plan",
    text: "1. Prescribed Arjuna capsules for cardiovascular support\n2. Dietary counseling - reduce salt intake\n3. Daily pranayama practice\n4. Follow-up in 2 weeks\n5. Monitor blood pressure daily",
    author: {
      reference: "Practitioner/prac-001",
      display: "Dr. Priya Sharma",
    },
    created: "2024-01-15T09:40:00Z",
    status: "final",
  },
  {
    id: "note-003",
    encounterId: "enc-002",
    type: "progress",
    text: "Patient reports joint stiffness worse in morning. Pain scale 6/10. Examination reveals swelling in knee joints. Vata imbalance evident from pulse diagnosis.",
    author: {
      reference: "Practitioner/prac-001",
      display: "Dr. Priya Sharma",
    },
    created: "2024-01-16T14:45:00Z",
    status: "draft",
  },
]
