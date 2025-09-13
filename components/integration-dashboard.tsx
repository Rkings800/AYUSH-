"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Database, AlertCircle, CheckCircle, Clock } from "lucide-react"

export function IntegrationDashboard() {
  const [healthChecks, setHealthChecks] = useState<any[]>([])
  const [syncStatuses, setSyncStatuses] = useState<any[]>([])
  const [overallHealth, setOverallHealth] = useState<string>("unknown")
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    fetchHealthStatus()
    fetchSyncStatus()

    // Set up periodic health checks
    const interval = setInterval(() => {
      fetchHealthStatus()
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const fetchHealthStatus = async () => {
    try {
      const response = await fetch("/api/health")
      const data = await response.json()
      setHealthChecks(data.checks || [])
      setOverallHealth(data.status)
    } catch (error) {
      console.error("Failed to fetch health status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSyncStatus = async () => {
    try {
      const response = await fetch("/api/sync")
      const data = await response.json()
      setSyncStatuses(data.statuses || [])
    } catch (error) {
      console.error("Failed to fetch sync status:", error)
    }
  }

  const handleSync = async (resourceType: string) => {
    setIsSyncing(true)
    try {
      const response = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceType }),
      })

      if (response.ok) {
        fetchSyncStatus()
      }
    } catch (error) {
      console.error("Sync failed:", error)
    } finally {
      setIsSyncing(false)
    }
  }

  const getHealthIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "unhealthy":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "degraded":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800"
      case "unhealthy":
        return "bg-red-100 text-red-800"
      case "degraded":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSyncIcon = (status: string) => {
    switch (status) {
      case "syncing":
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Database className="h-4 w-4 text-gray-600" />
    }
  }

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return "Never"
    return new Date(timestamp).toLocaleString()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Integration Dashboard</h2>
          <p className="text-muted-foreground">Monitor system health and data synchronization</p>
        </div>
        <div className="flex items-center gap-2">
          {getHealthIcon(overallHealth)}
          <Badge className={getHealthColor(overallHealth)}>{overallHealth.toUpperCase()}</Badge>
        </div>
      </div>

      <Tabs defaultValue="health" className="w-full">
        <TabsList>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="sync">Data Sync</TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {healthChecks.map((check) => (
              <Card key={check.service}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{check.service}</CardTitle>
                    {getHealthIcon(check.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Status</span>
                      <Badge className={getHealthColor(check.status)} variant="outline">
                        {check.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Response Time</span>
                      <span>{check.responseTime}ms</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Last Checked</span>
                      <span>{formatTimestamp(check.lastChecked)}</span>
                    </div>
                    {check.error && (
                      <div className="text-sm text-red-600 mt-2">
                        <span className="font-medium">Error:</span> {check.error}
                      </div>
                    )}
                    {check.details && (
                      <div className="text-xs text-muted-foreground mt-2">
                        {Object.entries(check.details).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span>{key}:</span>
                            <span>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => handleSync("all")} disabled={isSyncing} size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
              Sync All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {["Patient", "Encounter", "Condition"].map((resourceType) => {
              const syncStatus = syncStatuses.find((s) => s.resourceType === resourceType) || {
                resourceType,
                status: "idle",
                lastSync: null,
                totalRecords: 0,
                syncedRecords: 0,
                errors: [],
              }

              return (
                <Card key={resourceType}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{resourceType}s</CardTitle>
                      {getSyncIcon(syncStatus.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Status</span>
                        <Badge variant="outline">{syncStatus.status.toUpperCase()}</Badge>
                      </div>

                      {syncStatus.totalRecords > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>
                              {syncStatus.syncedRecords}/{syncStatus.totalRecords}
                            </span>
                          </div>
                          <Progress
                            value={(syncStatus.syncedRecords / syncStatus.totalRecords) * 100}
                            className="h-2"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm">
                        <span>Last Sync</span>
                        <span className="text-xs">{formatTimestamp(syncStatus.lastSync)}</span>
                      </div>

                      {syncStatus.errors.length > 0 && (
                        <div className="text-xs text-red-600">
                          <span className="font-medium">{syncStatus.errors.length} error(s)</span>
                        </div>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(resourceType)}
                        disabled={isSyncing || syncStatus.status === "syncing"}
                        className="w-full"
                      >
                        <RefreshCw className="h-3 w-3 mr-2" />
                        Sync Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
