import { mockPatients, type Patient } from "./patient-data"

export class PatientService {
  // Search patients by various criteria
  static search(query: string): Patient[] {
    if (!query.trim()) return mockPatients

    const searchTerm = query.toLowerCase()
    return mockPatients.filter(
      (patient) =>
        patient.abhaId.toLowerCase().includes(searchTerm) ||
        patient.name.given.some((name) => name.toLowerCase().includes(searchTerm)) ||
        patient.name.family.toLowerCase().includes(searchTerm) ||
        patient.phone?.includes(searchTerm) ||
        patient.email?.toLowerCase().includes(searchTerm),
    )
  }

  // Get patient by ID
  static getById(id: string): Patient | null {
    return mockPatients.find((patient) => patient.id === id) || null
  }

  // Get patient by ABHA ID
  static getByAbhaId(abhaId: string): Patient | null {
    return mockPatients.find((patient) => patient.abhaId === abhaId) || null
  }

  // Get all patients for a practitioner
  static getByPractitioner(practitionerId: string): Patient[] {
    return mockPatients.filter((patient) => patient.practitionerId === practitionerId)
  }

  // Calculate age from birth date
  static calculateAge(birthDate: string): number {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return age
  }

  // Generate FHIR Patient resource
  static toFHIRPatient(patient: Patient) {
    return {
      resourceType: "Patient",
      id: patient.id,
      identifier: [
        {
          use: "official",
          system: "https://healthid.ndhm.gov.in",
          value: patient.abhaId,
        },
      ],
      active: true,
      name: [
        {
          use: "official",
          family: patient.name.family,
          given: patient.name.given,
          prefix: patient.name.prefix,
        },
      ],
      telecom: [
        ...(patient.phone
          ? [
              {
                system: "phone",
                value: patient.phone,
                use: "mobile",
              },
            ]
          : []),
        ...(patient.email
          ? [
              {
                system: "email",
                value: patient.email,
                use: "home",
              },
            ]
          : []),
      ],
      gender: patient.gender,
      birthDate: patient.birthDate,
      address: patient.address
        ? [
            {
              use: "home",
              line: patient.address.line,
              city: patient.address.city,
              state: patient.address.state,
              postalCode: patient.address.postalCode,
              country: patient.address.country,
            },
          ]
        : [],
      contact: patient.emergencyContact
        ? [
            {
              relationship: [
                {
                  coding: [
                    {
                      system: "http://terminology.hl7.org/CodeSystem/v2-0131",
                      code: "C",
                      display: "Emergency Contact",
                    },
                  ],
                },
              ],
              name: {
                text: patient.emergencyContact.name,
              },
              telecom: [
                {
                  system: "phone",
                  value: patient.emergencyContact.phone,
                },
              ],
            },
          ]
        : [],
      extension: [
        {
          url: "http://example.org/fhir/StructureDefinition/registration-date",
          valueDateTime: patient.registrationDate,
        },
        ...(patient.lastVisit
          ? [
              {
                url: "http://example.org/fhir/StructureDefinition/last-visit",
                valueDateTime: patient.lastVisit,
              },
            ]
          : []),
      ],
    }
  }

  // Create new patient (mock implementation)
  static async create(patientData: Omit<Patient, "id" | "registrationDate">): Promise<Patient> {
    const newPatient: Patient = {
      ...patientData,
      id: `pat-${Date.now()}`,
      registrationDate: new Date().toISOString(),
    }

    // In real implementation, this would save to database
    mockPatients.push(newPatient)
    return newPatient
  }

  // Update patient (mock implementation)
  static async update(id: string, updates: Partial<Patient>): Promise<Patient | null> {
    const patientIndex = mockPatients.findIndex((p) => p.id === id)
    if (patientIndex === -1) return null

    mockPatients[patientIndex] = { ...mockPatients[patientIndex], ...updates }
    return mockPatients[patientIndex]
  }
}
