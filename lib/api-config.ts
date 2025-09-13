export interface APIConfig {
  fhirServer: {
    baseUrl: string
    version: string
    auth: {
      type: "oauth2" | "bearer" | "basic"
      clientId?: string
      clientSecret?: string
      tokenUrl?: string
      scope?: string
    }
  }
  abha: {
    baseUrl: string
    clientId: string
    clientSecret: string
    environment: "sandbox" | "production"
  }
  terminology: {
    namasteApi: string
    icd11Api: string
    snomedApi: string
    apiKey?: string
  }
  sync: {
    enabled: boolean
    interval: number // minutes
    batchSize: number
    retryAttempts: number
  }
}

export const defaultConfig: APIConfig = {
  fhirServer: {
    baseUrl: process.env.FHIR_SERVER_URL || "https://hapi.fhir.org/baseR4",
    version: "4.0.1",
    auth: {
      type: "bearer",
      scope: "system/*.read system/*.write",
    },
  },
  abha: {
    baseUrl: process.env.ABHA_BASE_URL || "https://dev.abdm.gov.in",
    clientId: process.env.ABHA_CLIENT_ID || "",
    clientSecret: process.env.ABHA_CLIENT_SECRET || "",
    environment: (process.env.ABHA_ENVIRONMENT as "sandbox" | "production") || "sandbox",
  },
  terminology: {
    namasteApi: process.env.NAMASTE_API_URL || "https://api.namaste.gov.in",
    icd11Api: process.env.ICD11_API_URL || "https://id.who.int/icd/release/11/2024-01",
    snomedApi: process.env.SNOMED_API_URL || "https://browser.ihtsdotools.org/snowstorm/snomed-ct",
    apiKey: process.env.TERMINOLOGY_API_KEY,
  },
  sync: {
    enabled: process.env.SYNC_ENABLED === "true",
    interval: Number.parseInt(process.env.SYNC_INTERVAL || "30"),
    batchSize: Number.parseInt(process.env.SYNC_BATCH_SIZE || "50"),
    retryAttempts: Number.parseInt(process.env.SYNC_RETRY_ATTEMPTS || "3"),
  },
}

export class APIConfigManager {
  private static config: APIConfig = defaultConfig

  static getConfig(): APIConfig {
    return this.config
  }

  static updateConfig(updates: Partial<APIConfig>): void {
    this.config = { ...this.config, ...updates }
  }

  static validateConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!this.config.fhirServer.baseUrl) {
      errors.push("FHIR server base URL is required")
    }

    if (!this.config.abha.clientId || !this.config.abha.clientSecret) {
      errors.push("ABHA client credentials are required")
    }

    if (this.config.sync.enabled && this.config.sync.interval < 5) {
      errors.push("Sync interval must be at least 5 minutes")
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }
}
