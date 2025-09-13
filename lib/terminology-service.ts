import { namasteTerminologies, icd11Codes, conceptMappings } from "./terminology-data"

export interface SearchResult {
  code: string
  display: string
  system: string
  description?: string
  mappings?: {
    icd11TM2?: string
    icd11Biomed?: string
    snomedCT?: string
  }
}

export interface TranslationResult {
  sourceCode: string
  sourceSystem: string
  targetCode: string
  targetSystem: string
  targetDisplay: string
  equivalence: string
}

export class TerminologyService {
  // Search across all terminology systems
  static search(query: string, limit = 10): SearchResult[] {
    const searchTerm = query.toLowerCase().trim()

    if (!searchTerm) return []

    const results: SearchResult[] = []

    // Search NAMASTE codes
    namasteTerminologies.forEach((term) => {
      if (
        term.display.toLowerCase().includes(searchTerm) ||
        term.code.toLowerCase().includes(searchTerm) ||
        term.description?.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          code: term.code,
          display: term.display,
          system: `NAMASTE-${term.system}`,
          description: term.description,
          mappings: {
            icd11TM2: term.icd11TM2,
            icd11Biomed: term.icd11Biomed,
            snomedCT: term.snomedCT,
          },
        })
      }
    })

    // Search ICD-11 codes
    icd11Codes.forEach((code) => {
      if (
        code.display.toLowerCase().includes(searchTerm) ||
        code.code.toLowerCase().includes(searchTerm) ||
        code.description?.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          code: code.code,
          display: code.display,
          system: `ICD-11-${code.module}`,
          description: code.description,
        })
      }
    })

    return results.slice(0, limit)
  }

  // Get terminology by code
  static getByCode(code: string, system: string): SearchResult | null {
    // Search in NAMASTE
    const namasteResult = namasteTerminologies.find((term) => term.code === code)
    if (namasteResult && system.includes("NAMASTE")) {
      return {
        code: namasteResult.code,
        display: namasteResult.display,
        system: `NAMASTE-${namasteResult.system}`,
        description: namasteResult.description,
        mappings: {
          icd11TM2: namasteResult.icd11TM2,
          icd11Biomed: namasteResult.icd11Biomed,
          snomedCT: namasteResult.snomedCT,
        },
      }
    }

    // Search in ICD-11
    const icd11Result = icd11Codes.find((icdCode) => icdCode.code === code)
    if (icd11Result && system.includes("ICD-11")) {
      return {
        code: icd11Result.code,
        display: icd11Result.display,
        system: `ICD-11-${icd11Result.module}`,
        description: icd11Result.description,
      }
    }

    return null
  }

  // Translate between coding systems
  static translate(sourceCode: string, sourceSystem: string, targetSystem: string): TranslationResult[] {
    const results: TranslationResult[] = []

    conceptMappings.forEach((mapping) => {
      if (mapping.sourceCode === sourceCode && mapping.sourceSystem === sourceSystem) {
        if (mapping.targetSystem === targetSystem) {
          const targetTerm = this.getByCode(mapping.targetCode, mapping.targetSystem)
          if (targetTerm) {
            results.push({
              sourceCode: mapping.sourceCode,
              sourceSystem: mapping.sourceSystem,
              targetCode: mapping.targetCode,
              targetSystem: mapping.targetSystem,
              targetDisplay: targetTerm.display,
              equivalence: mapping.equivalence,
            })
          }
        }
      }
    })

    return results
  }

  // Get all mappings for a code
  static getMappings(code: string, system: string): { [key: string]: SearchResult } {
    const mappings: { [key: string]: SearchResult } = {}

    if (system.includes("NAMASTE")) {
      const namasteCode = namasteTerminologies.find((term) => term.code === code)
      if (namasteCode) {
        if (namasteCode.icd11TM2) {
          const tm2Code = this.getByCode(namasteCode.icd11TM2, "ICD-11-TM2")
          if (tm2Code) mappings["ICD-11-TM2"] = tm2Code
        }
        if (namasteCode.icd11Biomed) {
          const biomedCode = this.getByCode(namasteCode.icd11Biomed, "ICD-11-Biomedicine")
          if (biomedCode) mappings["ICD-11-Biomedicine"] = biomedCode
        }
      }
    }

    return mappings
  }

  // Generate FHIR CodeSystem resource
  static generateFHIRCodeSystem() {
    return {
      resourceType: "CodeSystem",
      id: "namaste-terminology",
      url: "http://example.org/fhir/CodeSystem/namaste",
      version: "1.0.0",
      name: "NAMASTETerminology",
      title: "NAMASTE - National AYUSH Morbidity & Standardized Terminologies Electronic",
      status: "active",
      experimental: false,
      date: new Date().toISOString(),
      publisher: "Ministry of AYUSH, Government of India",
      description: "Standardized terminologies for Ayurveda, Siddha, and Unani disorders",
      caseSensitive: true,
      content: "complete",
      count: namasteTerminologies.length,
      concept: namasteTerminologies.map((term) => ({
        code: term.code,
        display: term.display,
        definition: term.description,
        property: [
          {
            code: "system",
            valueString: term.system,
          },
        ],
      })),
    }
  }

  // Generate FHIR ConceptMap resource
  static generateFHIRConceptMap() {
    return {
      resourceType: "ConceptMap",
      id: "namaste-to-icd11",
      url: "http://example.org/fhir/ConceptMap/namaste-to-icd11",
      version: "1.0.0",
      name: "NAMASTEToICD11Map",
      title: "NAMASTE to ICD-11 Concept Map",
      status: "active",
      experimental: false,
      date: new Date().toISOString(),
      publisher: "Ministry of AYUSH, Government of India",
      description: "Mapping between NAMASTE codes and ICD-11 TM2/Biomedicine codes",
      sourceUri: "http://example.org/fhir/CodeSystem/namaste",
      targetUri: "http://id.who.int/icd/release/11/mms",
      group: conceptMappings.reduce((groups: any[], mapping) => {
        let group = groups.find((g) => g.source === mapping.sourceSystem && g.target === mapping.targetSystem)
        if (!group) {
          group = {
            source: mapping.sourceSystem,
            target: mapping.targetSystem,
            element: [],
          }
          groups.push(group)
        }

        group.element.push({
          code: mapping.sourceCode,
          target: [
            {
              code: mapping.targetCode,
              equivalence: mapping.equivalence,
            },
          ],
        })

        return groups
      }, []),
    }
  }
}
