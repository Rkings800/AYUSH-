"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Plus, User, Phone, MapPin, Activity } from "lucide-react"
import Link from "next/link"
import { NavigationHeader } from "@/components/navigation-header" // Fixed import to use named import instead of default

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
    city: string
    state: string
  }
  lastVisit?: string
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async (query = "") => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/patients/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setPatients(data.patients || [])
    } catch (error) {
      console.error("Failed to fetch patients:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    fetchPatients(query)
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

  const formatLastVisit = (lastVisit?: string) => {
    if (!lastVisit) return "No recent visits"
    const date = new Date(lastVisit)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <NavigationHeader
        title="Patient Management"
        subtitle="Search and manage patient records"
        showBack={true}
        backUrl="/dashboard"
        actions={
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Patient</span>
            <span className="sm:hidden">New</span>
          </Button>
        }
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, ABHA ID, phone number..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-background border-2 border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Patient List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading patients...</p>
              </div>
            ) : patients.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No patients found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? `No patients match "${searchQuery}"` : "No patients registered yet"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              patients.map((patient) => (
                <Card key={patient.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="flex items-start space-x-4 flex-1 min-w-0">
                        <Avatar className="h-12 w-12 flex-shrink-0">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(patient)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          {/* Better responsive layout for patient info */}
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="text-lg font-semibold text-foreground break-words">
                              {getFullName(patient)}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {patient.gender}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {patient.age} years
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 flex-shrink-0" />
                              <span className="font-mono break-all">{patient.abhaId}</span>
                            </div>

                            {patient.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 flex-shrink-0" />
                                <span className="break-all">{patient.phone}</span>
                              </div>
                            )}

                            {patient.address && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 flex-shrink-0" />
                                <span className="break-words">
                                  {patient.address.city}, {patient.address.state}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 flex-shrink-0" />
                              <span>{formatLastVisit(patient.lastVisit)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Responsive button layout for mobile */}
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Link href={`/patients/${patient.id}`} className="flex-1 sm:flex-none">
                          <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                            <span className="hidden sm:inline">View Details</span>
                            <span className="sm:hidden">View</span>
                          </Button>
                        </Link>
                        <Button size="sm" className="flex-1 sm:flex-none">
                          <span className="hidden sm:inline">New Encounter</span>
                          <span className="sm:hidden">Encounter</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
