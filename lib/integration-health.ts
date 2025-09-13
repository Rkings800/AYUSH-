import { APIConfigManager } from "./api-config"
import { FHIRClient } from "./fhir-client"

export interface HealthCheck {
  service: string
  status: "healthy" | "unhealthy" | "unknown"
  responseTime: number
  lastChecked: string
  error?: string
  details?: Record<string, any>
}

export class IntegrationHealthService {
  private fhirClient: FHIRClient
  private healthChecks: Map<string, HealthCheck> = new Map()

  constructor() {
    this.fhirClient = new FHIRClient()
  }

  async checkFHIRServer(): Promise<HealthCheck> {
    const service = "FHIR Server"
    const startTime = Date.now()

    try {
      // Try to get server metadata
      const config = APIConfigManager.getConfig()
      const response = await fetch(`${config.fhirServer.baseUrl}/metadata`, {
        method: "GET",
        headers: { Accept: "application/fhir+json" },
      })

      const responseTime = Date.now() - startTime
      const lastChecked = new Date().toISOString()

      if (response.ok) {
        const metadata = await response.json()
        const healthCheck: HealthCheck = {
          service,
          status: "healthy",
          responseTime,
          lastChecked,
          details: {
            version: metadata.fhirVersion,
            software: metadata.software?.name,
            implementation: metadata.implementation?.description,
          },
        }
        this.healthChecks.set(service, healthCheck)
        return healthCheck
      } else {
        const healthCheck: HealthCheck = {
          service,
          status: "unhealthy",
          responseTime,
          lastChecked,
          error: `HTTP ${response.status}: ${response.statusText}`,
        }
        this.healthChecks.set(service, healthCheck)
        return healthCheck
      }
    } catch (error) {
      const responseTime = Date.now() - startTime
      const healthCheck: HealthCheck = {
        service,
        status: "unhealthy",
        responseTime,
        lastChecked: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
      }
      this.healthChecks.set(service, healthCheck)
      return healthCheck
    }
  }

  async checkABHAService(): Promise<HealthCheck> {
    const service = "ABHA Service"
    const startTime = Date.now()

    try {
      const config = APIConfigManager.getConfig()
      const response = await fetch(`${config.abha.baseUrl}/health`, {
        method: "GET",
        headers: { Accept: "application/json" },
      })

      const responseTime = Date.now() - startTime
      const lastChecked = new Date().toISOString()

      if (response.ok) {
        const healthCheck: HealthCheck = {
          service,
          status: "healthy",
          responseTime,
          lastChecked,
          details: {
            environment: config.abha.environment,
          },
        }
        this.healthChecks.set(service, healthCheck)
        return healthCheck
      } else {
        const healthCheck: HealthCheck = {
          service,
          status: "unhealthy",
          responseTime,
          lastChecked,
          error: `HTTP ${response.status}: ${response.statusText}`,
        }
        this.healthChecks.set(service, healthCheck)
        return healthCheck
      }
    } catch (error) {
      const responseTime = Date.now() - startTime
      const healthCheck: HealthCheck = {
        service,
        status: "unhealthy",
        responseTime,
        lastChecked: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
      }
      this.healthChecks.set(service, healthCheck)
      return healthCheck
    }
  }

  async checkTerminologyServices(): Promise<HealthCheck> {
    const service = "Terminology Services"
    const startTime = Date.now()

    try {
      const config = APIConfigManager.getConfig()

      // Check multiple terminology services
      const checks = await Promise.allSettled([
        fetch(`${config.terminology.namasteApi}/health`),
        fetch(`${config.terminology.icd11Api}/health`),
      ])

      const responseTime = Date.now() - startTime
      const lastChecked = new Date().toISOString()

      const healthyServices = checks.filter((result) => result.status === "fulfilled" && result.value.ok).length

      const totalServices = checks.length
      const status = healthyServices === totalServices ? "healthy" : healthyServices > 0 ? "unhealthy" : "unhealthy"

      const healthCheck: HealthCheck = {
        service,
        status,
        responseTime,
        lastChecked,
        details: {
          healthyServices,
          totalServices,
          services: {
            namaste: checks[0].status === "fulfilled" && checks[0].value.ok,
            icd11: checks[1].status === "fulfilled" && checks[1].value.ok,
          },
        },
      }

      this.healthChecks.set(service, healthCheck)
      return healthCheck
    } catch (error) {
      const responseTime = Date.now() - startTime
      const healthCheck: HealthCheck = {
        service,
        status: "unhealthy",
        responseTime,
        lastChecked: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
      }
      this.healthChecks.set(service, healthCheck)
      return healthCheck
    }
  }

  async runAllHealthChecks(): Promise<HealthCheck[]> {
    const checks = await Promise.allSettled([
      this.checkFHIRServer(),
      this.checkABHAService(),
      this.checkTerminologyServices(),
    ])

    return checks.map((result) =>
      result.status === "fulfilled"
        ? result.value
        : {
            service: "Unknown",
            status: "unknown" as const,
            responseTime: 0,
            lastChecked: new Date().toISOString(),
            error: "Health check failed",
          },
    )
  }

  getHealthCheck(service: string): HealthCheck | null {
    return this.healthChecks.get(service) || null
  }

  getAllHealthChecks(): HealthCheck[] {
    return Array.from(this.healthChecks.values())
  }

  getOverallHealth(): "healthy" | "unhealthy" | "degraded" {
    const checks = this.getAllHealthChecks()
    if (checks.length === 0) return "unhealthy"

    const healthyCount = checks.filter((check) => check.status === "healthy").length
    const totalCount = checks.length

    if (healthyCount === totalCount) return "healthy"
    if (healthyCount > 0) return "degraded"
    return "unhealthy"
  }
}
