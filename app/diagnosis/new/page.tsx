"use client"
import { DiagnosisEntryForm } from "@/components/diagnosis-entry-form"
import { NavigationHeader } from "@/components/navigation-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function NewDiagnosisPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const patientId = searchParams.get("patientId") || ""

  const handleSuccess = (diagnosis: any) => {
    // Redirect to patient detail page or diagnosis list
    if (patientId) {
      router.push(`/patients/${patientId}`)
    } else {
      router.push("/dashboard")
    }
  }

  const handleCancel = () => {
    if (patientId) {
      router.push(`/patients/${patientId}`)
    } else {
      router.push("/dashboard")
    }
  }

  if (!patientId) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader title="Patient Required" showBack={true} backUrl="/patients" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Patient Required</h2>
            <p className="text-muted-foreground mb-4">Please select a patient to add a diagnosis.</p>
            <Link href="/patients">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Select Patient
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader
        title="New Diagnosis"
        subtitle="Add diagnosis with NAMASTE and ICD-11 dual coding"
        showBack={true}
        backUrl={patientId ? `/patients/${patientId}` : "/dashboard"}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex justify-center">
          <DiagnosisEntryForm patientId={patientId} onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </main>
    </div>
  )
}
