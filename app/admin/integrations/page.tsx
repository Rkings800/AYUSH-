"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { IntegrationDashboard } from "@/components/integration-dashboard"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function IntegrationsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("abha_token")
    if (!token) {
      router.push("/")
      return
    }
    setIsAuthenticated(true)
  }, [router])

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">System Integration</h1>
            <p className="text-muted-foreground">
              Monitor FHIR compliance, data synchronization, and external service health
            </p>
          </div>
        </div>

        <IntegrationDashboard />
      </div>
    </div>
  )
}
