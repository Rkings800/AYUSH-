"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, User, MapPin, Plus } from "lucide-react"
import Link from "next/link"

interface EncounterListProps {
  patientId?: string
  limit?: number
  showCreateButton?: boolean
}

export function EncounterList({ patientId, limit = 10, showCreateButton = true }: EncounterListProps) {
  const [encounters, setEncounters] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEncounters()
  }, [patientId])

  const fetchEncounters = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (patientId) params.append("patientId", patientId)
      params.append("limit", limit.toString())

      const response = await fetch(`/api/encounters?${params}`)
      const data = await response.json()
      setEncounters(data.encounters || [])
    } catch (error) {
      console.error("Failed to fetch encounters:", error)
    } finally {
      setIsLoading(false)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Encounters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Encounters</CardTitle>
            <CardDescription>Clinical visits and consultations</CardDescription>
          </div>
          {showCreateButton && (
            <Button asChild size="sm">
              <Link href={patientId ? `/encounters/new?patientId=${patientId}` : "/encounters/new"}>
                <Plus className="h-4 w-4 mr-2" />
                New Encounter
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {encounters.map((encounter) => (
              <Link key={encounter.id} href={`/encounters/${encounter.id}`}>
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(encounter.status)}>
                        {encounter.status.replace("-", " ").toUpperCase()}
                      </Badge>
                      <span className="font-medium">
                        {encounter.type?.[0]?.coding?.[0]?.display || "General Consultation"}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">{formatDate(encounter.period.start)}</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {encounter.subject.display}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {formatTime(encounter.period.start)}
                      {encounter.period.end && ` - ${formatTime(encounter.period.end)}`}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {encounter.location?.[0]?.location?.display || "Not specified"}
                    </div>
                  </div>

                  {encounter.reasonCode && encounter.reasonCode.length > 0 && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Reason: </span>
                      {encounter.reasonCode[0].text}
                    </div>
                  )}
                </div>
              </Link>
            ))}
            {encounters.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No encounters found</div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
