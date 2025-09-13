export interface Consent {
  id: string
  patientId: string
  practitionerId: string
  status: "draft" | "proposed" | "active" | "rejected" | "inactive" | "entered-in-error"
  scope: "treatment" | "research" | "insurance" | "quality-improvement" | "public-health"
  category: string[]
  policyRule: string
  provision: {
    type: "permit" | "deny"
    period?: {
      start: string
      end?: string
    }
    purpose: Array<{
      system: string
      code: string
      display: string
    }>
    data?: Array<{
      meaning: "instance" | "related" | "dependents" | "authoredby"
      reference: {
        reference: string
      }
    }>
  }
  dateTime: string
  performer?: Array<{
    reference: string
    display: string
  }>
  sourceAttachment?: {
    contentType: string
    data: string
    title: string
  }
  verification?: Array<{
    verified: boolean
    verifiedWith: {
      reference: string
      display: string
    }
    verificationDate: string
  }>
}

export interface AuditEvent {
  id: string
  type: {
    system: string
    code: string
    display: string
  }
  subtype?: Array<{
    system: string
    code: string
    display: string
  }>
  action: "C" | "R" | "U" | "D" | "E" // Create, Read, Update, Delete, Execute
  period?: {
    start: string
    end?: string
  }
  recorded: string
  outcome: "0" | "4" | "8" | "12" // Success, Minor failure, Serious failure, Major failure
  outcomeDesc?: string
  purposeOfEvent?: Array<{
    system: string
    code: string
    display: string
  }>
  agent: Array<{
    type?: {
      system: string
      code: string
      display: string
    }
    who: {
      reference: string
      display: string
    }
    requestor: boolean
    location?: {
      reference: string
    }
    policy?: string[]
    network?: {
      address: string
      type: "1" | "2" | "3" | "4" | "5" // Machine Name, IP Address, Telephone, Email, URI
    }
  }>
  source: {
    site: string
    observer: {
      reference: string
      display: string
    }
    type: Array<{
      system: string
      code: string
      display: string
    }>
  }
  entity?: Array<{
    what?: {
      reference: string
    }
    type?: {
      system: string
      code: string
      display: string
    }
    role?: {
      system: string
      code: string
      display: string
    }
    lifecycle?: {
      system: string
      code: string
      display: string
    }
    securityLabel?: Array<{
      system: string
      code: string
      display: string
    }>
    name?: string
    description?: string
    query?: string
    detail?: Array<{
      type: string
      valueString: string
    }>
  }>
}

// Mock consent data
export const mockConsents: Consent[] = [
  {
    id: "consent-001",
    patientId: "pat-001",
    practitionerId: "prac-001",
    status: "active",
    scope: "treatment",
    category: ["INFA"],
    policyRule: "http://terminology.hl7.org/CodeSystem/v3-ActCode#INFA",
    provision: {
      type: "permit",
      period: {
        start: "2024-09-01T00:00:00Z",
        end: "2025-09-01T00:00:00Z",
      },
      purpose: [
        {
          system: "http://terminology.hl7.org/CodeSystem/v3-ActReason",
          code: "TREAT",
          display: "Treatment",
        },
      ],
    },
    dateTime: "2024-09-01T14:20:00Z",
    performer: [
      {
        reference: "Patient/pat-001",
        display: "Priya Sharma",
      },
    ],
    verification: [
      {
        verified: true,
        verifiedWith: {
          reference: "Patient/pat-001",
          display: "Priya Sharma",
        },
        verificationDate: "2024-09-01T14:20:00Z",
      },
    ],
  },
  {
    id: "consent-002",
    patientId: "pat-002",
    practitionerId: "prac-001",
    status: "active",
    scope: "treatment",
    category: ["INFA"],
    policyRule: "http://terminology.hl7.org/CodeSystem/v3-ActCode#INFA",
    provision: {
      type: "permit",
      period: {
        start: "2024-08-28T00:00:00Z",
        end: "2025-08-28T00:00:00Z",
      },
      purpose: [
        {
          system: "http://terminology.hl7.org/CodeSystem/v3-ActReason",
          code: "TREAT",
          display: "Treatment",
        },
        {
          system: "http://terminology.hl7.org/CodeSystem/v3-ActReason",
          code: "HPAYMT",
          display: "Healthcare Payment",
        },
      ],
    },
    dateTime: "2024-08-28T11:45:00Z",
    performer: [
      {
        reference: "Patient/pat-002",
        display: "Rajesh Kumar",
      },
    ],
    verification: [
      {
        verified: true,
        verifiedWith: {
          reference: "Patient/pat-002",
          display: "Rajesh Kumar",
        },
        verificationDate: "2024-08-28T11:45:00Z",
      },
    ],
  },
]

// Mock audit events
export const mockAuditEvents: AuditEvent[] = [
  {
    id: "audit-001",
    type: {
      system: "http://terminology.hl7.org/CodeSystem/audit-event-type",
      code: "rest",
      display: "RESTful Operation",
    },
    subtype: [
      {
        system: "http://hl7.org/fhir/restful-interaction",
        code: "create",
        display: "create",
      },
    ],
    action: "C",
    recorded: "2024-09-01T14:20:00Z",
    outcome: "0",
    agent: [
      {
        type: {
          system: "http://terminology.hl7.org/CodeSystem/extra-security-role-type",
          code: "humanuser",
          display: "human user",
        },
        who: {
          reference: "Practitioner/prac-001",
          display: "Dr. Rajesh Kumar",
        },
        requestor: true,
        network: {
          address: "192.168.1.100",
          type: "2",
        },
      },
    ],
    source: {
      site: "NAMASTE-EMR",
      observer: {
        reference: "Device/emr-system",
        display: "NAMASTE EMR System",
      },
      type: [
        {
          system: "http://terminology.hl7.org/CodeSystem/security-source-type",
          code: "4",
          display: "Application Server",
        },
      ],
    },
    entity: [
      {
        what: {
          reference: "Condition/diag-001",
        },
        type: {
          system: "http://terminology.hl7.org/CodeSystem/audit-entity-type",
          code: "2",
          display: "System Object",
        },
        role: {
          system: "http://terminology.hl7.org/CodeSystem/object-role",
          code: "4",
          display: "Domain Resource",
        },
        lifecycle: {
          system: "http://terminology.hl7.org/CodeSystem/dicom-audit-lifecycle",
          code: "1",
          display: "Origination / Creation",
        },
        name: "Diagnosis: Amavata",
        description: "Created new diagnosis with NAMASTE and ICD-11 dual coding",
      },
    ],
  },
]
