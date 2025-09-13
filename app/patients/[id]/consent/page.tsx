"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ConsentForm } from "@/components/consent-form"
import { AuditTrail } from "@/components/audit-trail"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PatientConsentPage() {
  const params = useParams()
  const router = useRouter()
  const patientId = params.id as string
  const [showAuditTrail, setShowAuditTrail] = useState(false)

  const handleConsentGranted = () => {
    router.push(`/patients/${patientId}`)
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Patient Consent Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <ConsentForm patientId={patientId} onConsentGranted={handleConsentGranted} onCancel={handleCancel} />
        </div>

        <div>
          <AuditTrail resourceId={patientId} resourceType="Patient" limit={20} />
        </div>
      </div>
    </div>
  )
}
