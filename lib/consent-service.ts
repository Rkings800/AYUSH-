import { mockConsents, mockAuditEvents, type Consent, type AuditEvent } from "./consent-data"

export class ConsentService {
  // Get consents for a patient
  static getByPatient(patientId: string): Consent[] {
    return mockConsents.filter((consent) => consent.patientId === patientId)
  }

  // Get consent by ID
  static getById(id: string): Consent | null {
    return mockConsents.find((consent) => consent.id === id) || null
  }

  // Check if patient has active consent for a specific purpose
  static hasActiveConsent(patientId: string, purpose: string): boolean {
    const consents = this.getByPatient(patientId)
    return consents.some(
      (consent) =>
        consent.status === "active" &&
        consent.provision.type === "permit" &&
        consent.provision.purpose.some((p) => p.code === purpose) &&
        this.isConsentValid(consent),
    )
  }

  // Check if consent is still valid (not expired)
  static isConsentValid(consent: Consent): boolean {
    if (!consent.provision.period?.end) return true
    return new Date(consent.provision.period.end) > new Date()
  }

  // Create new consent
  static async create(consentData: Omit<Consent, "id" | "dateTime">): Promise<Consent> {
    const newConsent: Consent = {
      ...consentData,
      id: `consent-${Date.now()}`,
      dateTime: new Date().toISOString(),
    }

    // In real implementation, this would save to database
    mockConsents.push(newConsent)

    // Create audit event for consent creation
    await this.createAuditEvent({
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
      outcome: "0",
      agent: [
        {
          who: {
            reference: `Practitioner/${consentData.practitionerId}`,
            display: "Practitioner",
          },
          requestor: true,
        },
      ],
      entity: [
        {
          what: {
            reference: `Consent/${newConsent.id}`,
          },
          type: {
            system: "http://terminology.hl7.org/CodeSystem/audit-entity-type",
            code: "2",
            display: "System Object",
          },
          name: "Patient Consent",
          description: `Created consent for ${consentData.scope}`,
        },
      ],
    })

    return newConsent
  }

  // Update consent status
  static async updateStatus(id: string, status: Consent["status"], practitionerId: string): Promise<Consent | null> {
    const consentIndex = mockConsents.findIndex((c) => c.id === id)
    if (consentIndex === -1) return null

    const oldStatus = mockConsents[consentIndex].status
    mockConsents[consentIndex].status = status

    // Create audit event for consent update
    await this.createAuditEvent({
      type: {
        system: "http://terminology.hl7.org/CodeSystem/audit-event-type",
        code: "rest",
        display: "RESTful Operation",
      },
      subtype: [
        {
          system: "http://hl7.org/fhir/restful-interaction",
          code: "update",
          display: "update",
        },
      ],
      action: "U",
      outcome: "0",
      agent: [
        {
          who: {
            reference: `Practitioner/${practitionerId}`,
            display: "Practitioner",
          },
          requestor: true,
        },
      ],
      entity: [
        {
          what: {
            reference: `Consent/${id}`,
          },
          type: {
            system: "http://terminology.hl7.org/CodeSystem/audit-entity-type",
            code: "2",
            display: "System Object",
          },
          name: "Patient Consent",
          description: `Updated consent status from ${oldStatus} to ${status}`,
        },
      ],
    })

    return mockConsents[consentIndex]
  }

  // Generate FHIR Consent resource
  static toFHIRConsent(consent: Consent) {
    return {
      resourceType: "Consent",
      id: consent.id,
      status: consent.status,
      scope: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/consentscope",
            code: consent.scope,
            display: consent.scope,
          },
        ],
      },
      category: consent.category.map((cat) => ({
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/consentcategorycodes",
            code: cat,
            display: cat,
          },
        ],
      })),
      patient: {
        reference: `Patient/${consent.patientId}`,
      },
      dateTime: consent.dateTime,
      performer: consent.performer,
      policyRule: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
            code: consent.policyRule.split("#")[1],
            display: consent.policyRule.split("#")[1],
          },
        ],
      },
      provision: {
        type: consent.provision.type,
        period: consent.provision.period,
        purpose: consent.provision.purpose.map((purpose) => ({
          system: purpose.system,
          code: purpose.code,
          display: purpose.display,
        })),
        data: consent.provision.data,
      },
      verification: consent.verification,
      sourceAttachment: consent.sourceAttachment,
    }
  }

  // Create audit event
  static async createAuditEvent(auditData: Omit<AuditEvent, "id" | "recorded" | "source">): Promise<AuditEvent> {
    const newAuditEvent: AuditEvent = {
      ...auditData,
      id: `audit-${Date.now()}`,
      recorded: new Date().toISOString(),
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
    }

    // In real implementation, this would save to database
    mockAuditEvents.push(newAuditEvent)
    return newAuditEvent
  }

  // Get audit events for a patient
  static getAuditEvents(patientId?: string, limit = 50): AuditEvent[] {
    let events = mockAuditEvents

    if (patientId) {
      events = events.filter((event) => event.entity?.some((entity) => entity.what?.reference.includes(patientId)))
    }

    return events.sort((a, b) => new Date(b.recorded).getTime() - new Date(a.recorded).getTime()).slice(0, limit)
  }

  // Log data access
  static async logDataAccess(
    practitionerId: string,
    patientId: string,
    resourceType: string,
    resourceId: string,
    action: "read" | "create" | "update" | "delete",
  ): Promise<void> {
    await this.createAuditEvent({
      type: {
        system: "http://terminology.hl7.org/CodeSystem/audit-event-type",
        code: "rest",
        display: "RESTful Operation",
      },
      subtype: [
        {
          system: "http://hl7.org/fhir/restful-interaction",
          code: action,
          display: action,
        },
      ],
      action: action === "read" ? "R" : action === "create" ? "C" : action === "update" ? "U" : "D",
      outcome: "0",
      agent: [
        {
          who: {
            reference: `Practitioner/${practitionerId}`,
            display: "Practitioner",
          },
          requestor: true,
          network: {
            address: "192.168.1.100", // In real app, get from request
            type: "2",
          },
        },
      ],
      entity: [
        {
          what: {
            reference: `${resourceType}/${resourceId}`,
          },
          type: {
            system: "http://terminology.hl7.org/CodeSystem/audit-entity-type",
            code: "2",
            display: "System Object",
          },
          name: `${resourceType} Resource`,
          description: `${action} operation on ${resourceType} for patient ${patientId}`,
        },
      ],
    })
  }
}
