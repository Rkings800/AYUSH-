"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, FileText, Calendar, LogOut, Shield, Activity, Users, BookOpen, Settings } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [practitionerName, setPractitionerName] = useState("")
  const [abhaId, setAbhaId] = useState("")

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("abha_token")
    if (!token) {
      window.location.href = "/"
      return
    }

    // Load practitioner info
    const name = localStorage.getItem("practitioner_name") || "Dr. Practitioner"
    const id = localStorage.getItem("abha_id") || "ABHA-12345"
    setPractitionerName(name)
    setAbhaId(id)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">NAMASTE EMR</h1>
                <p className="text-sm text-muted-foreground">Traditional Medicine Records</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>Authenticated</span>
              </Badge>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{practitionerName}</p>
                <p className="text-xs text-muted-foreground">{abhaId}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Welcome back, {practitionerName}</h2>
            <p className="text-muted-foreground">
              Manage your traditional medicine practice with integrated NAMASTE and ICD-11 coding
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 from yesterday</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Treatments</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">48</div>
                <p className="text-xs text-muted-foreground">Ongoing care plans</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">NAMASTE Codes</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4,500+</div>
                <p className="text-xs text-muted-foreground">Available terminologies</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">100%</div>
                <p className="text-xs text-muted-foreground">FHIR R4 compliant</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/patients">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-primary" />
                    <span>Patient Management</span>
                  </CardTitle>
                  <CardDescription>Search, view, and manage patient records with ABHA integration</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Access Patients</Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/diagnosis/new">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span>Diagnosis Entry</span>
                  </CardTitle>
                  <CardDescription>Add diagnoses with NAMASTE and ICD-11 dual coding support</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">New Diagnosis</Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/encounters">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>Encounters</span>
                  </CardTitle>
                  <CardDescription>Manage patient encounters and treatment sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">View Encounters</Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/integrations">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-primary" />
                    <span>System Integration</span>
                  </CardTitle>
                  <CardDescription>Monitor FHIR sync, ABHA services, and system health</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">View Status</Button>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest patient interactions and system updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New patient registered: Priya Sharma</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Diagnosis added: Amavata (AYU001) → ICD-11 TM2</p>
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-muted rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">System sync completed with WHO ICD-API</p>
                    <p className="text-xs text-muted-foreground">6 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
