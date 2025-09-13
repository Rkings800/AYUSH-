"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProblemList } from "@/components/problem-list"
import { NavigationHeader } from "@/components/navigation-header"
import { User, Phone, Mail, MapPin, Calendar, Heart, Pill, AlertTriangle, Edit, Plus } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

interface Patient {
  id: string
  abhaId: string
  name: {
    given: string[]
    family: string
    prefix?: string[]
  }
  gender: "male" | "female" | "other"
  birthDate: string
  age: number
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
}

export default function PatientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchPatient(params.id as string)
    }
  }, [params.id])

  const fetchPatient = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/patients/${id}`)
      if (response.ok) {
        const data = await response.json()
        setPatient(data)
      }
    } catch (error) {
      console.error("Failed to fetch patient:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddDiagnosis = () => {
    router.push(`/diagnosis/new?patientId=${params.id}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader title="Patient Not Found" showBack={true} backUrl="/patients" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Patient Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested patient could not be found.</p>
            <Link href="/patients">
              <Button>Back to Patients</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getInitials = (patient: Patient) => {
    const first = patient.name.given[0]?.[0] || ""
    const last = patient.name.family[0] || ""
    return (first + last).toUpperCase()
  }

  const getFullName = (patient: Patient) => {
    const prefix = patient.name.prefix?.join(" ") || ""
    const given = patient.name.given.join(" ")
    const family = patient.name.family
    return `${prefix} ${given} ${family}`.trim()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <NavigationHeader
        title="Patient Details"
        subtitle="Complete patient information and medical history"
        showBack={true}
        backUrl="/patients"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" className="hidden sm:flex bg-transparent">
              <Edit className="w-4 h-4 mr-2" />
              Edit Patient
            </Button>
            <Button variant="outline" className="sm:hidden bg-transparent">
              <Edit className="w-4 h-4" />
            </Button>
            <Button onClick={handleAddDiagnosis} className="hidden sm:flex">
              <Plus className="w-4 h-4 mr-2" />
              Add Diagnosis
            </Button>
            <Button onClick={handleAddDiagnosis} className="sm:hidden">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        }
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="space-y-6">
          {/* Patient Header */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 mx-auto sm:mx-0">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg sm:text-xl">
                    {getInitials(patient)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 mb-3">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground break-words">
                      {getFullName(patient)}
                    </h2>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{patient.gender}</Badge>
                      <Badge variant="outline">{patient.age} years old</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground justify-center sm:justify-start">
                      <User className="h-4 w-4 flex-shrink-0" />
                      <span className="font-mono break-all">{patient.abhaId}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground justify-center sm:justify-start">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span>{new Date(patient.birthDate).toLocaleDateString()}</span>
                    </div>

                    {patient.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground justify-center sm:justify-start">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span className="break-all">{patient.phone}</span>
                      </div>
                    )}

                    {patient.email && (
                      <div className="flex items-center gap-2 text-muted-foreground justify-center sm:justify-start">
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <span className="break-all">{patient.email}</span>
                      </div>
                    )}

                    {patient.address && (
                      <div className="flex items-center gap-2 text-muted-foreground justify-center sm:justify-start">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="break-words">
                          {patient.address.city}, {patient.address.state}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Information */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="problem-list" className="text-xs sm:text-sm">
                Problems
              </TabsTrigger>
              <TabsTrigger value="medical-history" className="text-xs sm:text-sm">
                History
              </TabsTrigger>
              <TabsTrigger value="encounters" className="text-xs sm:text-sm">
                Visits
              </TabsTrigger>
              <TabsTrigger value="documents" className="text-xs sm:text-sm">
                Docs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {patient.address && (
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Address</h4>
                        <div className="text-sm text-muted-foreground break-words">
                          <p>{patient.address.line.join(", ")}</p>
                          <p>
                            {patient.address.city}, {patient.address.state} {patient.address.postalCode}
                          </p>
                          <p>{patient.address.country}</p>
                        </div>
                      </div>
                    )}

                    {patient.emergencyContact && (
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Emergency Contact</h4>
                        <div className="text-sm text-muted-foreground break-words">
                          <p className="font-medium">{patient.emergencyContact.name}</p>
                          <p>{patient.emergencyContact.relationship}</p>
                          <p className="break-all">{patient.emergencyContact.phone}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Registration Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Registration Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Registration Date</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(patient.registrationDate).toLocaleDateString()}
                      </p>
                    </div>

                    {patient.lastVisit && (
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Last Visit</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(patient.lastVisit).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="problem-list" className="space-y-4">
              <ProblemList patientId={params.id as string} onAddDiagnosis={handleAddDiagnosis} />
            </TabsContent>

            <TabsContent value="medical-history" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Allergies */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Allergies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patient.medicalHistory?.allergies?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {patient.medicalHistory.allergies.map((allergy, index) => (
                          <Badge key={index} variant="destructive" className="break-words">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No known allergies</p>
                    )}
                  </CardContent>
                </Card>

                {/* Chronic Conditions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-primary" />
                      Chronic Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patient.medicalHistory?.chronicConditions?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {patient.medicalHistory.chronicConditions.map((condition, index) => (
                          <Badge key={index} variant="secondary" className="break-words">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No chronic conditions</p>
                    )}
                  </CardContent>
                </Card>

                {/* Current Medications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Pill className="h-5 w-5 text-accent" />
                      Current Medications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patient.medicalHistory?.medications?.length ? (
                      <div className="space-y-2">
                        {patient.medicalHistory.medications.map((medication, index) => (
                          <div key={index} className="text-sm text-foreground break-words">
                            {medication}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No current medications</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="encounters">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Encounters</CardTitle>
                  <CardDescription>Patient visit history and treatment records</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No encounters recorded yet.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents & Reports</CardTitle>
                  <CardDescription>Medical reports, test results, and other documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No documents uploaded yet.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
