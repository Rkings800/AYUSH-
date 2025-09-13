"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TerminologySearch } from "@/components/terminology-search"
import { Loader2, Plus, X, AlertCircle, CheckCircle, Code } from "lucide-react"

interface DiagnosisCode {
  system: string
  code: string
  display: string
  primary?: boolean
}

interface DiagnosisEntryFormProps {
  patientId: string
  onSuccess?: (diagnosis: any) => void
  onCancel?: () => void
}

export function DiagnosisEntryForm({ patientId, onSuccess, onCancel }: DiagnosisEntryFormProps) {
  const [selectedCodes, setSelectedCodes] = useState<DiagnosisCode[]>([])
  const [clinicalStatus, setClinicalStatus] = useState<string>("active")
  const [verificationStatus, setVerificationStatus] = useState<string>("confirmed")
  const [severity, setSeverity] = useState<string>("")
  const [onsetDate, setOnsetDate] = useState<string>("")
  const [notes, setNotes] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const handleTerminologySelect = async (result: any) => {
    // Add primary NAMASTE code
    const namasteCode: DiagnosisCode = {
      system: result.system,
      code: result.code,
      display: result.display,
      primary: selectedCodes.length === 0, // First code is primary
    }

    const newCodes = [namasteCode]

    // Add mapped codes if available
    if (result.mappings?.icd11TM2) {
      newCodes.push({
        system: "ICD-11-TM2",
        code: result.mappings.icd11TM2,
        display: `${result.display} (Traditional Medicine)`,
      })
    }

    if (result.mappings?.icd11Biomed) {
      // Fetch the biomedicine display name
      try {
        const response = await fetch(`/api/terminology/search?q=${result.mappings.icd11Biomed}`)
        const data = await response.json()
        const biomedResult = data.results?.find((r: any) => r.code === result.mappings.icd11Biomed)

        newCodes.push({
          system: "ICD-11-Biomedicine",
          code: result.mappings.icd11Biomed,
          display: biomedResult?.display || result.mappings.icd11Biomed,
        })
      } catch (error) {
        console.error("Failed to fetch biomedicine code:", error)
      }
    }

    setSelectedCodes((prev) => [...prev, ...newCodes])
  }

  const removeCode = (index: number) => {
    setSelectedCodes((prev) => {
      const newCodes = prev.filter((_, i) => i !== index)
      // If we removed the primary code, make the first remaining code primary
      if (prev[index].primary && newCodes.length > 0) {
        newCodes[0].primary = true
      }
      return newCodes
    })
  }

  const setPrimaryCode = (index: number) => {
    setSelectedCodes((prev) =>
      prev.map((code, i) => ({
        ...code,
        primary: i === index,
      })),
    )
  }

  const validateForm = (): boolean => {
    const newErrors: string[] = []

    if (selectedCodes.length === 0) {
      newErrors.push("At least one diagnosis code is required")
    }

    const namasteCode = selectedCodes.find((code) => code.system.includes("NAMASTE"))
    if (!namasteCode) {
      newErrors.push("At least one NAMASTE code is required")
    }

    const primaryCode = selectedCodes.find((code) => code.primary)
    if (!primaryCode) {
      newErrors.push("One code must be designated as primary")
    }

    if (!clinicalStatus) {
      newErrors.push("Clinical status is required")
    }

    if (!verificationStatus) {
      newErrors.push("Verification status is required")
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const diagnosisData = {
        patientId,
        practitionerId: "prac-001", // In real app, get from auth context
        codes: selectedCodes,
        clinicalStatus,
        verificationStatus,
        severity: severity || undefined,
        onsetDate: onsetDate || undefined,
        notes: notes || undefined,
      }

      const response = await fetch("/api/diagnosis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(diagnosisData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create diagnosis")
      }

      const diagnosis = await response.json()
      onSuccess?.(diagnosis)
    } catch (error) {
      console.error("Failed to create diagnosis:", error)
      setErrors([error instanceof Error ? error.message : "Failed to create diagnosis"])
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSystemColor = (system: string) => {
    if (system.includes("NAMASTE")) return "bg-primary text-primary-foreground"
    if (system.includes("TM2")) return "bg-accent text-accent-foreground"
    if (system.includes("Biomedicine")) return "bg-secondary text-secondary-foreground"
    return "bg-muted text-muted-foreground"
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Add New Diagnosis
        </CardTitle>
        <CardDescription>
          Enter diagnosis with NAMASTE and ICD-11 dual coding for comprehensive medical records
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Terminology Search */}
        <div className="space-y-2">
          <Label>Search Diagnosis Codes</Label>
          <TerminologySearch
            onSelect={handleTerminologySelect}
            placeholder="Search NAMASTE, ICD-11 codes (e.g., Amavata, Prameha, Jwara)..."
          />
          <p className="text-xs text-muted-foreground">
            Search will automatically include mapped ICD-11 TM2 and Biomedicine codes
          </p>
        </div>

        {/* Selected Codes */}
        {selectedCodes.length > 0 && (
          <div className="space-y-3">
            <Label>Selected Diagnosis Codes</Label>
            <div className="space-y-2">
              {selectedCodes.map((code, index) => (
                <div
                  key={`${code.system}-${code.code}`}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge className={getSystemColor(code.system)}>{code.system}</Badge>
                    <code className="text-sm font-mono">{code.code}</code>
                    <span className="text-sm font-medium">{code.display}</span>
                    {code.primary && (
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Primary
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!code.primary && (
                      <Button variant="outline" size="sm" onClick={() => setPrimaryCode(index)}>
                        Set Primary
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => removeCode(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clinical Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clinical-status">Clinical Status *</Label>
            <Select value={clinicalStatus} onValueChange={setClinicalStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select clinical status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="recurrence">Recurrence</SelectItem>
                <SelectItem value="relapse">Relapse</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="remission">Remission</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verification-status">Verification Status *</Label>
            <Select value={verificationStatus} onValueChange={setVerificationStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select verification status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unconfirmed">Unconfirmed</SelectItem>
                <SelectItem value="provisional">Provisional</SelectItem>
                <SelectItem value="differential">Differential</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="refuted">Refuted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity">Severity</Label>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="Select severity (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mild">Mild</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="severe">Severe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="onset-date">Onset Date</Label>
            <Input id="onset-date" type="date" value={onsetDate} onChange={(e) => setOnsetDate(e.target.value)} />
          </div>
        </div>

        {/* Clinical Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Clinical Notes</Label>
          <Textarea
            id="notes"
            placeholder="Enter clinical observations, treatment plans, or additional notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={isSubmitting || selectedCodes.length === 0}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Diagnosis...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create Diagnosis
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
