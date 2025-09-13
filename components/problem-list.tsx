"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Activity, Code, Edit, Eye } from "lucide-react"

interface ProblemListEntry {
  id: string
  patientId: string
  diagnosis: {
    id: string
    codes: Array<{
      system: string
      code: string
      display: string
      primary?: boolean
    }>
    clinicalStatus: string
    verificationStatus: string
    severity?: string
    onsetDate?: string
    recordedDate: string
    notes?: string
  }
  status: string
  priority: string
  lastUpdated: string
}

interface ProblemListProps {
  patientId: string
  onAddDiagnosis?: () => void
}

export function ProblemList({ patientId, onAddDiagnosis }: ProblemListProps) {
  const [problems, setProblems] = useState<ProblemListEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    fetchProblemList()
  }, [patientId])

  const fetchProblemList = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch(`/api/patients/${patientId}/problem-list`)
      if (!response.ok) {
        throw new Error("Failed to fetch problem list")
      }
      const data = await response.json()
      setProblems(data.problems || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load problem list")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-destructive text-destructive-foreground"
      case "inactive":
        return "bg-secondary text-secondary-foreground"
      case "resolved":
        return "bg-accent text-accent-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground"
      case "medium":
        return "bg-primary text-primary-foreground"
      case "low":
        return "bg-secondary text-secondary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getSystemColor = (system: string) => {
    if (system.includes("NAMASTE")) return "bg-primary text-primary-foreground"
    if (system.includes("TM2")) return "bg-accent text-accent-foreground"
    if (system.includes("Biomedicine")) return "bg-secondary text-secondary-foreground"
    return "bg-muted text-muted-foreground"
  }

  const getPrimaryCode = (codes: any[]) => {
    return codes.find((code) => code.primary) || codes[0]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading problem list...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Problem List
            </CardTitle>
            <CardDescription>Active diagnoses and medical conditions with dual coding</CardDescription>
          </div>
          {onAddDiagnosis && (
            <Button onClick={onAddDiagnosis} className="w-full sm:w-auto">
              <Code className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Add Diagnosis</span>
              <span className="sm:hidden">Add</span>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {problems.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No diagnoses recorded</h3>
            <p className="text-muted-foreground mb-4">Start by adding a diagnosis with NAMASTE and ICD-11 coding</p>
            {onAddDiagnosis && (
              <Button onClick={onAddDiagnosis} className="w-full sm:w-auto">
                <Code className="w-4 h-4 mr-2" />
                Add First Diagnosis
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {problems.map((problem) => {
              const primaryCode = getPrimaryCode(problem.diagnosis.codes)
              return (
                <div key={problem.id} className="border border-border rounded-lg p-4 space-y-3">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h4 className="font-semibold text-foreground break-words">{primaryCode.display}</h4>
                        <Badge className={getStatusColor(problem.status)}>{problem.status}</Badge>
                        <Badge variant="outline" className={getPriorityColor(problem.priority)}>
                          {problem.priority} priority
                        </Badge>
                      </div>

                      {/* Primary Code */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge className={getSystemColor(primaryCode.system)}>{primaryCode.system}</Badge>
                        <code className="text-sm font-mono text-muted-foreground break-all">{primaryCode.code}</code>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
                        <Eye className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
                        <Edit className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                    </div>
                  </div>

                  {/* All Codes */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-foreground">All Codes:</h5>
                    <div className="flex flex-wrap gap-2">
                      {problem.diagnosis.codes.map((code, index) => (
                        <div key={`${code.system}-${code.code}`} className="flex items-center gap-2 text-xs flex-wrap">
                          <Badge variant="outline" className={getSystemColor(code.system)}>
                            {code.system}
                          </Badge>
                          <span className="font-mono break-all">{code.code}</span>
                          <span className="break-words">{code.display}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clinical Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Clinical Status:</span>
                      <p className="font-medium capitalize break-words">{problem.diagnosis.clinicalStatus}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Verification:</span>
                      <p className="font-medium capitalize break-words">{problem.diagnosis.verificationStatus}</p>
                    </div>
                    {problem.diagnosis.severity && (
                      <div>
                        <span className="text-muted-foreground">Severity:</span>
                        <p className="font-medium capitalize break-words">{problem.diagnosis.severity}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Recorded:</span>
                      <p className="font-medium">{formatDate(problem.diagnosis.recordedDate)}</p>
                    </div>
                  </div>

                  {/* Notes */}
                  {problem.diagnosis.notes && (
                    <div className="pt-2 border-t border-border">
                      <span className="text-sm text-muted-foreground">Clinical Notes:</span>
                      <p className="text-sm text-foreground mt-1 break-words">{problem.diagnosis.notes}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
