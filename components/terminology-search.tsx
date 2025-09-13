"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Code, ArrowRight } from "lucide-react"

interface SearchResult {
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

interface TerminologySearchProps {
  onSelect?: (result: SearchResult) => void
  placeholder?: string
  className?: string
}

export function TerminologySearch({
  onSelect,
  placeholder = "Search NAMASTE, ICD-11 codes...",
  className,
}: TerminologySearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const searchTerminologies = async () => {
      if (!query.trim()) {
        setResults([])
        setShowResults(false)
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/terminology/search?q=${encodeURIComponent(query)}&limit=8`)
        const data = await response.json()
        setResults(data.results || [])
        setShowResults(true)
      } catch (error) {
        console.error("Search error:", error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchTerminologies, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleSelect = (result: SearchResult) => {
    setQuery(result.display)
    setShowResults(false)
    onSelect?.(result)
  }

  const getSystemColor = (system: string) => {
    if (system.includes("NAMASTE")) return "bg-primary text-primary-foreground"
    if (system.includes("TM2")) return "bg-accent text-accent-foreground"
    if (system.includes("Biomedicine")) return "bg-secondary text-secondary-foreground"
    return "bg-muted text-muted-foreground"
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10 bg-background border-2 border-input focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
          onFocus={() => query && setShowResults(true)}
        />
        {isLoading && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      {showResults && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-2 max-h-96 overflow-y-auto shadow-lg border-2 border-border bg-card">
          <CardContent className="p-0">
            {results.map((result, index) => (
              <div
                key={`${result.system}-${result.code}`}
                className="p-3 sm:p-4 hover:bg-accent/50 cursor-pointer border-b border-border last:border-b-0 transition-colors"
                onClick={() => handleSelect(result)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="secondary" className={`text-xs ${getSystemColor(result.system)}`}>
                        {result.system}
                      </Badge>
                      <code className="text-sm font-mono text-muted-foreground break-all">{result.code}</code>
                    </div>
                    <p className="font-medium text-sm text-foreground mb-1 break-words">{result.display}</p>
                    {result.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 break-words">{result.description}</p>
                    )}

                    {result.mappings && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {result.mappings.icd11TM2 && (
                          <Badge variant="outline" className="text-xs break-all">
                            TM2: {result.mappings.icd11TM2}
                          </Badge>
                        )}
                        {result.mappings.icd11Biomed && (
                          <Badge variant="outline" className="text-xs break-all">
                            ICD-11: {result.mappings.icd11Biomed}
                          </Badge>
                        )}
                        {result.mappings.snomedCT && (
                          <Badge variant="outline" className="text-xs break-all">
                            SNOMED: {result.mappings.snomedCT}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {showResults && results.length === 0 && query && !isLoading && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-2 shadow-lg border-2 border-border bg-card">
          <CardContent className="p-4 text-center text-muted-foreground">
            <Code className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="break-words">No terminology codes found for "{query}"</p>
            <p className="text-xs mt-1">Try searching for conditions like "Amavata", "Prameha", or "Jwara"</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
