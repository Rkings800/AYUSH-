import { APIConfigManager } from "./api-config"

export interface FHIRResource {
  resourceType: string
  id?: string
  meta?: {
    versionId?: string
    lastUpdated?: string
    profile?: string[]
  }
  [key: string]: any
}

export interface FHIRBundle {
  resourceType: "Bundle"
  id?: string
  type:
    | "document"
    | "message"
    | "transaction"
    | "transaction-response"
    | "batch"
    | "batch-response"
    | "history"
    | "searchset"
    | "collection"
  entry?: Array<{
    resource?: FHIRResource
    request?: {
      method: "GET" | "POST" | "PUT" | "DELETE"
      url: string
    }
    response?: {
      status: string
      location?: string
      etag?: string
    }
  }>
  total?: number
}

export class FHIRClient {
  private baseUrl: string
  private headers: Record<string, string>

  constructor() {
    const config = APIConfigManager.getConfig()
    this.baseUrl = config.fhirServer.baseUrl
    this.headers = {
      "Content-Type": "application/fhir+json",
      Accept: "application/fhir+json",
    }

    // Add authentication headers based on config
    if (config.fhirServer.auth.type === "bearer") {
      const token = process.env.FHIR_ACCESS_TOKEN
      if (token) {
        this.headers.Authorization = `Bearer ${token}`
      }
    }
  }

  async create(resource: FHIRResource): Promise<FHIRResource> {
    const response = await fetch(`${this.baseUrl}/${resource.resourceType}`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(resource),
    })

    if (!response.ok) {
      throw new Error(`FHIR create failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async read(resourceType: string, id: string): Promise<FHIRResource> {
    const response = await fetch(`${this.baseUrl}/${resourceType}/${id}`, {
      method: "GET",
      headers: this.headers,
    })

    if (!response.ok) {
      throw new Error(`FHIR read failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async update(resource: FHIRResource): Promise<FHIRResource> {
    if (!resource.id) {
      throw new Error("Resource ID is required for update")
    }

    const response = await fetch(`${this.baseUrl}/${resource.resourceType}/${resource.id}`, {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify(resource),
    })

    if (!response.ok) {
      throw new Error(`FHIR update failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async delete(resourceType: string, id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${resourceType}/${id}`, {
      method: "DELETE",
      headers: this.headers,
    })

    if (!response.ok) {
      throw new Error(`FHIR delete failed: ${response.status} ${response.statusText}`)
    }
  }

  async search(resourceType: string, params: Record<string, string> = {}): Promise<FHIRBundle> {
    const searchParams = new URLSearchParams(params)
    const response = await fetch(`${this.baseUrl}/${resourceType}?${searchParams}`, {
      method: "GET",
      headers: this.headers,
    })

    if (!response.ok) {
      throw new Error(`FHIR search failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async batch(bundle: FHIRBundle): Promise<FHIRBundle> {
    const response = await fetch(`${this.baseUrl}`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(bundle),
    })

    if (!response.ok) {
      throw new Error(`FHIR batch failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async validateResource(resource: FHIRResource): Promise<{ valid: boolean; issues: any[] }> {
    const response = await fetch(`${this.baseUrl}/${resource.resourceType}/$validate`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(resource),
    })

    const result = await response.json()
    return {
      valid: response.ok,
      issues: result.issue || [],
    }
  }
}
