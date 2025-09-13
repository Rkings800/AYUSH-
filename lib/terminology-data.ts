// Mock NAMASTE terminology data
export interface NAMASTECode {
  code: string
  display: string
  system: "Ayurveda" | "Siddha" | "Unani"
  description?: string
  icd11TM2?: string
  icd11Biomed?: string
  snomedCT?: string
}

export interface ICD11Code {
  code: string
  display: string
  module: "TM2" | "Biomedicine"
  description?: string
}

export interface ConceptMapping {
  sourceCode: string
  sourceSystem: string
  targetCode: string
  targetSystem: string
  equivalence: "equivalent" | "wider" | "narrower" | "inexact"
}

// Mock NAMASTE codes data
export const namasteTerminologies: NAMASTECode[] = [
  {
    code: "AYU001",
    display: "Amavata",
    system: "Ayurveda",
    description: "Rheumatoid arthritis in Ayurvedic terminology",
    icd11TM2: "TM2-123",
    icd11Biomed: "M06.9",
    snomedCT: "69896004",
  },
  {
    code: "AYU002",
    display: "Sandhivata",
    system: "Ayurveda",
    description: "Osteoarthritis in Ayurvedic terminology",
    icd11TM2: "TM2-124",
    icd11Biomed: "M19.9",
    snomedCT: "396275006",
  },
  {
    code: "AYU003",
    display: "Prameha",
    system: "Ayurveda",
    description: "Diabetes mellitus in Ayurvedic terminology",
    icd11TM2: "TM2-125",
    icd11Biomed: "E14.9",
    snomedCT: "73211009",
  },
  {
    code: "AYU004",
    display: "Kasa",
    system: "Ayurveda",
    description: "Cough in Ayurvedic terminology",
    icd11TM2: "TM2-126",
    icd11Biomed: "R05",
    snomedCT: "49727002",
  },
  {
    code: "AYU005",
    display: "Jwara",
    system: "Ayurveda",
    description: "Fever in Ayurvedic terminology",
    icd11TM2: "TM2-127",
    icd11Biomed: "R50.9",
    snomedCT: "386661006",
  },
  {
    code: "SID001",
    display: "Vali Noi",
    system: "Siddha",
    description: "Rheumatoid arthritis in Siddha terminology",
    icd11TM2: "TM2-201",
    icd11Biomed: "M06.9",
    snomedCT: "69896004",
  },
  {
    code: "SID002",
    display: "Sandhi Vatham",
    system: "Siddha",
    description: "Joint pain in Siddha terminology",
    icd11TM2: "TM2-202",
    icd11Biomed: "M25.5",
    snomedCT: "57676002",
  },
  {
    code: "UNA001",
    display: "Waja-ul-Mafasil",
    system: "Unani",
    description: "Joint pain in Unani terminology",
    icd11TM2: "TM2-301",
    icd11Biomed: "M25.5",
    snomedCT: "57676002",
  },
  {
    code: "UNA002",
    display: "Ziabetus",
    system: "Unani",
    description: "Diabetes in Unani terminology",
    icd11TM2: "TM2-302",
    icd11Biomed: "E14.9",
    snomedCT: "73211009",
  },
]

// Mock ICD-11 codes
export const icd11Codes: ICD11Code[] = [
  {
    code: "TM2-123",
    display: "Amavata (Traditional Medicine)",
    module: "TM2",
    description: "Traditional medicine concept for rheumatoid arthritis",
  },
  {
    code: "TM2-124",
    display: "Sandhivata (Traditional Medicine)",
    module: "TM2",
    description: "Traditional medicine concept for osteoarthritis",
  },
  {
    code: "M06.9",
    display: "Rheumatoid arthritis, unspecified",
    module: "Biomedicine",
    description: "Biomedical classification for rheumatoid arthritis",
  },
  {
    code: "M19.9",
    display: "Arthrosis, unspecified",
    module: "Biomedicine",
    description: "Biomedical classification for osteoarthritis",
  },
  {
    code: "E14.9",
    display: "Unspecified diabetes mellitus without complications",
    module: "Biomedicine",
    description: "Biomedical classification for diabetes",
  },
]

// Concept mappings
export const conceptMappings: ConceptMapping[] = [
  {
    sourceCode: "AYU001",
    sourceSystem: "NAMASTE",
    targetCode: "TM2-123",
    targetSystem: "ICD-11-TM2",
    equivalence: "equivalent",
  },
  {
    sourceCode: "AYU001",
    sourceSystem: "NAMASTE",
    targetCode: "M06.9",
    targetSystem: "ICD-11-Biomedicine",
    equivalence: "equivalent",
  },
  {
    sourceCode: "TM2-123",
    sourceSystem: "ICD-11-TM2",
    targetCode: "M06.9",
    targetSystem: "ICD-11-Biomedicine",
    equivalence: "equivalent",
  },
]
