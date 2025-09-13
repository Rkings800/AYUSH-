"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield, User } from "lucide-react"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [abhaId, setAbhaId] = useState("")
  const [error, setError] = useState("")

  const handleAbhaLogin = async () => {
    if (!abhaId.trim()) {
      setError("Please enter your ABHA ID")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate ABHA OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In real implementation, this would redirect to ABHA OAuth
      console.log("Redirecting to ABHA OAuth with ID:", abhaId)

      // Mock successful authentication
      localStorage.setItem("abha_token", "mock_token_" + Date.now())
      localStorage.setItem("abha_id", abhaId)

      // Redirect to dashboard
      window.location.href = "/dashboard"
    } catch (err) {
      setError("Authentication failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock demo authentication
      localStorage.setItem("abha_token", "demo_token_" + Date.now())
      localStorage.setItem("abha_id", "DEMO-12345")
      localStorage.setItem("practitioner_name", "Dr. Rajesh Kumar")

      window.location.href = "/dashboard"
    } catch (err) {
      setError("Demo login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="abha-id">ABHA ID</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="abha-id"
            type="text"
            placeholder="Enter your ABHA ID"
            value={abhaId}
            onChange={(e) => setAbhaId(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
      </div>

      <Button onClick={handleAbhaLogin} disabled={isLoading} className="w-full" size="lg">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Authenticating...
          </>
        ) : (
          <>
            <Shield className="mr-2 h-4 w-4" />
            Sign In with ABHA
          </>
        )}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or for demonstration</span>
        </div>
      </div>

      <Button
        onClick={handleDemoLogin}
        disabled={isLoading}
        variant="outline"
        className="w-full bg-transparent"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading Demo...
          </>
        ) : (
          "Continue with Demo Account"
        )}
      </Button>

      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        <p>All data is encrypted and compliant with healthcare regulations</p>
      </div>
    </div>
  )
}
