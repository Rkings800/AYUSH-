"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, User, Clock, Shield, FileText } from "lucide-react"

interface AuditTrailProps {
  resourceId?: string
  resourceType?: string
  limit?: number
}

export function AuditTrail({ resourceId, resourceType, limit = 50 }: AuditTrailProps) {
  const [auditEntries, setAuditEntries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAuditTrail()
  }, [resourceId, resourceType])

  const fetchAuditTrail = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (resourceId) params.append("resourceId", resourceId)
      if (resourceType) params.append("resourceType", resourceType)
      params.append("limit", limit.toString())

      const response = await fetch(`/api/audit?${params}`)
      const data = await response.json()
      setAuditEntries(data.entries || [])
    } catch (error) {
      console.error("Failed to fetch audit trail:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case "create":
        return <FileText className="h-4 w-4" />
      case "read":
        return <Activity className="h-4 w-4" />
      case "update":
        return <Activity className="h-4 w-4" />
      case "delete":
        return <Activity className="h-4 w-4" />
      case "consent":
        return <Shield className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "create":
        return "bg-green-100 text-green-800"
      case "read":
        return "bg-blue-100 text-blue-800"
      case "update":
        return "bg-yellow-100 text-yellow-800"
      case "delete":
        return "bg-red-100 text-red-800"
      case "consent":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
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
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Audit Trail
        </CardTitle>
        <CardDescription>Complete record of all actions performed on this resource</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {auditEntries.map((entry, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0 mt-1">{getActionIcon(entry.action)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getActionColor(entry.action)}>{entry.action.toUpperCase()}</Badge>
                    <span className="text-sm font-medium">{entry.resourceType}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{entry.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {entry.actor.display || entry.actor.reference}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(entry.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {auditEntries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No audit entries found</div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
