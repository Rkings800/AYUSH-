export interface Patient {
  id: string
  abhaId: string
  name: {
    given: string[]
    family: string
    prefix?: string[]
  }
  gender: "male" | "female" | "other"
  birthDate: string
  phone?: string
  email?: string
  address?: {
    line: string[]
    city: string
    state: string
    postalCode: string
    country: string
  }
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
  medicalHistory?: {
    allergies: string[]
    chronicConditions: string[]
    medications: string[]
  }
  registrationDate: string
  lastVisit?: string
  practitionerId: string
}

export interface PatientSummary {
  totalPatients: number
  newThisMonth: number
  activePatients: number
  upcomingAppointments: number
}

// Mock patient data
export const mockPatients: Patient[] = [
  {
    id: "pat-001",
    abhaId: "ABHA-91-1234-5678-9012",
    name: {
      given: ["Priya"],
      family: "Sharma",
      prefix: ["Mrs."],
    },
    gender: "female",
    birthDate: "1985-03-15",
    phone: "+91-9876543210",
    email: "priya.sharma@email.com",
    address: {
      line: ["123 Gandhi Nagar"],
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
      country: "India",
    },
    emergencyContact: {
      name: "Raj Sharma",
      relationship: "Husband",
      phone: "+91-9876543211",
    },
    medicalHistory: {
      allergies: ["Peanuts", "Shellfish"],
      chronicConditions: ["Hypertension"],
      medications: ["Amlodipine 5mg"],
    },
    registrationDate: "2024-01-15T10:30:00Z",
    lastVisit: "2024-09-01T14:20:00Z",
    practitionerId: "prac-001",
  },
  {
    id: "pat-002",
    abhaId: "ABHA-91-2345-6789-0123",
    name: {
      given: ["Rajesh"],
      family: "Kumar",
      prefix: ["Mr."],
    },
    gender: "male",
    birthDate: "1978-07-22",
    phone: "+91-9876543212",
    email: "rajesh.kumar@email.com",
    address: {
      line: ["456 Nehru Road"],
      city: "Delhi",
      state: "Delhi",
      postalCode: "110001",
      country: "India",
    },
    emergencyContact: {
      name: "Sunita Kumar",
      relationship: "Wife",
      phone: "+91-9876543213",
    },
    medicalHistory: {
      allergies: [],
      chronicConditions: ["Diabetes Type 2", "Arthritis"],
      medications: ["Metformin 500mg", "Glucosamine"],
    },
    registrationDate: "2024-02-20T09:15:00Z",
    lastVisit: "2024-08-28T11:45:00Z",
    practitionerId: "prac-001",
  },
  {
    id: "pat-003",
    abhaId: "ABHA-91-3456-7890-1234",
    name: {
      given: ["Meera"],
      family: "Patel",
      prefix: ["Ms."],
    },
    gender: "female",
    birthDate: "1992-11-08",
    phone: "+91-9876543214",
    email: "meera.patel@email.com",
    address: {
      line: ["789 Sardar Patel Street"],
      city: "Ahmedabad",
      state: "Gujarat",
      postalCode: "380001",
      country: "India",
    },
    emergencyContact: {
      name: "Kiran Patel",
      relationship: "Mother",
      phone: "+91-9876543215",
    },
    medicalHistory: {
      allergies: ["Dust", "Pollen"],
      chronicConditions: [],
      medications: [],
    },
    registrationDate: "2024-03-10T16:00:00Z",
    lastVisit: "2024-09-05T10:30:00Z",
    practitionerId: "prac-001",
  },
  {
    id: "pat-004",
    abhaId: "ABHA-91-4567-8901-2345",
    name: {
      given: ["Arjun"],
      family: "Singh",
      prefix: ["Mr."],
    },
    gender: "male",
    birthDate: "1965-12-03",
    phone: "+91-9876543216",
    address: {
      line: ["321 Lal Bahadur Road"],
      city: "Jaipur",
      state: "Rajasthan",
      postalCode: "302001",
      country: "India",
    },
    emergencyContact: {
      name: "Kavita Singh",
      relationship: "Daughter",
      phone: "+91-9876543217",
    },
    medicalHistory: {
      allergies: ["Aspirin"],
      chronicConditions: ["Chronic Back Pain", "High Cholesterol"],
      medications: ["Atorvastatin 20mg"],
    },
    registrationDate: "2024-01-25T13:45:00Z",
    lastVisit: "2024-08-30T15:20:00Z",
    practitionerId: "prac-001",
  },
]

export const patientSummary: PatientSummary = {
  totalPatients: mockPatients.length,
  newThisMonth: 2,
  activePatients: mockPatients.filter(
    (p) => p.lastVisit && new Date(p.lastVisit) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  ).length,
  upcomingAppointments: 8,
}
