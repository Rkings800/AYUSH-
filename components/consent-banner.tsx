"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Clock } from "lucide-react"

interface ConsentBannerProps {
  patientId: string
  requiredPurpose?: string
  onConsentRequired?: () => void
  onConsentGranted?: () => void
}

export function ConsentBanner({
  patientId,
  requiredPurpose = "TREAT",
  onConsentRequired,
  onConsentGranted,
}: ConsentBannerProps) {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null)
  const [consents, setConsents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkConsent()
  }, [patientId, requiredPurpose])

  const checkConsent = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/patients/${patientId}/consents`)
      const data = await response.json()

      const activeConsents =
        data.consents?.filter(
          (consent: any) =>
            consent.status === "active" &&
            consent.provision.type === "permit" &&
            consent.provision.purpose.some((p: any) => p.code === requiredPurpose) &&
            (!consent.provision.period?.end || new Date(consent.provision.period.end) > new Date()),
        ) || []

      setConsents(activeConsents)
      setHasConsent(activeConsents.length > 0)

      if (activeConsents.length > 0) {
        onConsentGranted?.()
      } else {
        onConsentRequired?.()
      }
    } catch (error) {
      console.error("Failed to check consent:", error)
      setHasConsent(false)
    } finally {
      setIsLoading(false)
    }
  }

  const getPurposeDisplay = (code: string) => {
    const purposeMap: { [key: string]: string } = {
      TREAT: "Treatment",
      HPAYMT: "Healthcare Payment",
      HRESCH: "Healthcare Research",
      PUBHLTH: "Public Health",
      HQUALIMP: "Healthcare Quality Improvement",
    }
    return purposeMap[code] || code
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>Checking consent status...</AlertDescription>
      </Alert>
    )
  }

  if (hasConsent) {
    return (
      <Alert className="border-accent bg-accent/5">
        <CheckCircle className="h-4 w-4 text-accent" />
        <AlertDescription className="flex items-center justify-between">
          <div>
            <span className="font-medium text-accent">Consent Active</span>
            <span className="ml-2 text-muted-foreground">
              Patient has provided consent for {getPurposeDisplay(requiredPurpose)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {consents.length > 0 && (
              <span>
                Valid until:{" "}
                {consents[0].provision.period?.end ? formatDate(consents[0].provision.period.end) : "Indefinite"}
              </span>
            )}
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="destructive">
      <AlertDescription>
        <span className="font-medium">Consent Required</span>
        <span className="ml-2">
          Patient consent is required for {getPurposeDisplay(requiredPurpose)} before accessing medical records.
        </span>
      </AlertDescription>
    </Alert>
  )
}
