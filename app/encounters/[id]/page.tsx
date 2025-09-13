"use client"

import { Calendar } from "@/components/ui/calendar"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Clock, User, MapPin, FileText, Plus, Save } from "lucide-react"
import { ConsentBanner } from "@/components/consent-banner"
import { AuditTrail } from "@/components/audit-trail"

export default function EncounterDetailPage() {
  const params = useParams()
  const router = useRouter()
  const encounterId = params.id as string

  const [encounter, setEncounter] = useState<any>(null)
  const [clinicalNotes, setClinicalNotes] = useState<any[]>([])
  const [newNote, setNewNote] = useState("")
  const [noteType, setNoteType] = useState("progress")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchEncounter()
    fetchClinicalNotes()
  }, [encounterId])

  const fetchEncounter = async () => {
    try {
      const response = await fetch(`/api/encounters/${encounterId}`)
      const data = await response.json()
      setEncounter(data.encounter)
    } catch (error) {
      console.error("Failed to fetch encounter:", error)
    }
  }

  const fetchClinicalNotes = async () => {
    try {
      const response = await fetch(`/api/encounters/${encounterId}/notes`)
      const data = await response.json()
      setClinicalNotes(data.notes || [])
    } catch (error) {
      console.error("Failed to fetch clinical notes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/encounters/${encounterId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: noteType,
          text: newNote,
          author: {
            reference: "Practitioner/prac-001",
            display: "Dr. Priya Sharma",
          },
          status: "draft",
        }),
      })

      if (response.ok) {
        setNewNote("")
        fetchClinicalNotes()
      }
    } catch (error) {
      console.error("Failed to add clinical note:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/encounters/${encounterId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          ...(newStatus === "finished" && { period: { ...encounter.period, end: new Date().toISOString() } }),
        }),
      })

      if (response.ok) {
        fetchEncounter()
      }
    } catch (error) {
      console.error("Failed to update encounter status:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "finished":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (isLoading || !encounter) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      </div>
    )
  }

  const patientId = encounter.subject.reference.split("/")[1]

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Encounter Details</h1>
          <p className="text-muted-foreground">{encounter.type?.[0]?.coding?.[0]?.display || "General Consultation"}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(encounter.status)}>{encounter.status.replace("-", " ").toUpperCase()}</Badge>
          {encounter.status === "in-progress" && (
            <Button onClick={() => handleStatusUpdate("finished")} size="sm">
              Complete Encounter
            </Button>
          )}
        </div>
      </div>

      <ConsentBanner
        patientId={patientId}
        requiredPurpose="TREAT"
        onConsentRequired={() => router.push(`/patients/${patientId}/consent`)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Encounter Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{encounter.subject.display}</p>
                    <p className="text-sm text-muted-foreground">Patient</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{formatDateTime(encounter.period.start)}</p>
                    <p className="text-sm text-muted-foreground">
                      {encounter.period.end ? `Ended: ${formatDateTime(encounter.period.end)}` : "Ongoing"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{encounter.location?.[0]?.location?.display || "Not specified"}</p>
                    <p className="text-sm text-muted-foreground">Location</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{encounter.participant[0]?.individual?.display}</p>
                    <p className="text-sm text-muted-foreground">Practitioner</p>
                  </div>
                </div>
              </div>
              {encounter.reasonCode && encounter.reasonCode.length > 0 && (
                <div>
                  <p className="font-medium mb-1">Reason for Visit</p>
                  <p className="text-muted-foreground">{encounter.reasonCode[0].text}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="notes" className="w-full">
            <TabsList>
              <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
              <TabsTrigger value="diagnosis">Diagnoses</TabsTrigger>
              <TabsTrigger value="audit">Audit Trail</TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Add Clinical Note
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={noteType} onValueChange={setNoteType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="progress">Progress Note</SelectItem>
                      <SelectItem value="assessment">Assessment</SelectItem>
                      <SelectItem value="plan">Treatment Plan</SelectItem>
                      <SelectItem value="general">General Note</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Enter clinical note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={4}
                  />
                  <Button onClick={handleAddNote} disabled={!newNote.trim() || isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Add Note"}
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {clinicalNotes.map((note) => (
                  <Card key={note.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{note.type.toUpperCase()}</Badge>
                        <div className="text-sm text-muted-foreground">
                          {formatDateTime(note.created)} by {note.author.display}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{note.text}</p>
                    </CardContent>
                  </Card>
                ))}
                {clinicalNotes.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">No clinical notes yet</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="diagnosis">
              <Card>
                <CardHeader>
                  <CardTitle>Encounter Diagnoses</CardTitle>
                </CardHeader>
                <CardContent>
                  {encounter.diagnosis && encounter.diagnosis.length > 0 ? (
                    <div className="space-y-3">
                      {encounter.diagnosis.map((diag: any, index: number) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{diag.condition.display}</span>
                            <Badge variant="outline">Rank {diag.rank}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{diag.use.coding[0].display}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No diagnoses recorded for this encounter
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audit">
              <AuditTrail resourceId={encounterId} resourceType="Encounter" />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Diagnosis
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Follow-up
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
