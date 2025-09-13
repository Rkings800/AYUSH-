"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Shield, FileText, Users, Activity } from "lucide-react"
import { format } from "date-fns"

interface ConsentFormProps {
  patientId: string
  onConsentGranted?: () => void
  onCancel?: () => void
}

export function ConsentForm({ patientId, onConsentGranted, onCancel }: ConsentFormProps) {
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([])
  const [expiryDate, setExpiryDate] = useState<Date>()
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const consentPurposes = [
    { code: "TREAT", label: "Treatment", description: "Diagnosis, treatment, and care coordination", icon: Activity },
    { code: "HPAYMT", label: "Healthcare Payment", description: "Insurance claims and billing", icon: FileText },
    { code: "HRESCH", label: "Healthcare Research", description: "Medical research and studies", icon: Users },
    { code: "PUBHLTH", label: "Public Health", description: "Disease surveillance and prevention", icon: Shield },
  ]

  const handlePurposeChange = (purposeCode: string, checked: boolean) => {
    if (checked) {
      setSelectedPurposes([...selectedPurposes, purposeCode])
    } else {
      setSelectedPurposes(selectedPurposes.filter((p) => p !== purposeCode))
    }
  }

  const handleSubmit = async () => {
    if (selectedPurposes.length === 0) return

    setIsSubmitting(true)
    try {
      const consentData = {
        patientId,
        purposes: selectedPurposes,
        expiryDate: expiryDate?.toISOString(),
        additionalNotes,
        grantedBy: "patient", // In real implementation, this would be the authenticated user
        grantedAt: new Date().toISOString(),
      }

      const response = await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(consentData),
      })

      if (response.ok) {
        onConsentGranted?.()
      }
    } catch (error) {
      console.error("Failed to grant consent:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-accent" />
          Patient Consent Management
        </CardTitle>
        <CardDescription>
          Please specify the purposes for which you consent to the use of your medical information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-medium">Consent Purposes</Label>
          {consentPurposes.map((purpose) => {
            const IconComponent = purpose.icon
            return (
              <div key={purpose.code} className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={purpose.code}
                  checked={selectedPurposes.includes(purpose.code)}
                  onCheckedChange={(checked) => handlePurposeChange(purpose.code, checked as boolean)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4 text-accent" />
                    <Label htmlFor={purpose.code} className="font-medium cursor-pointer">
                      {purpose.label}
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{purpose.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="space-y-2">
          <Label>Consent Expiry (Optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {expiryDate ? format(expiryDate, "PPP") : "Select expiry date (leave blank for indefinite)"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={expiryDate}
                onSelect={setExpiryDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any specific conditions or notes regarding this consent..."
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={handleSubmit} disabled={selectedPurposes.length === 0 || isSubmitting} className="flex-1">
            {isSubmitting ? "Granting Consent..." : "Grant Consent"}
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
