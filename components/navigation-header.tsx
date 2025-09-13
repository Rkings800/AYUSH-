"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"

interface NavigationHeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  backUrl?: string
  actions?: React.ReactNode
}

export function NavigationHeader({ title, subtitle, showBack = true, backUrl, actions }: NavigationHeaderProps) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl)
    } else {
      router.back()
    }
  }

  const handleHome = () => {
    router.push("/dashboard")
  }

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/patients", label: "Patients", icon: null },
    { href: "/encounters", label: "Encounters", icon: null },
    { href: "/diagnosis/new", label: "New Diagnosis", icon: null },
    { href: "/admin/integrations", label: "System Status", icon: null },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Navigation */}
          <div className="flex items-center gap-2">
            {/* Mobile menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="space-y-4 py-4">
                  <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold">NAMASTE EMR</h2>
                    <div className="space-y-1">
                      {menuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop navigation buttons */}
            <div className="hidden md:flex items-center gap-2">
              {showBack && (
                <Button variant="ghost" size="sm" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleHome}>
                <Home className="h-4 w-4 mr-1" />
                Home
              </Button>
            </div>

            {/* Mobile navigation buttons */}
            <div className="flex md:hidden items-center gap-1">
              {showBack && (
                <Button variant="ghost" size="sm" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleHome}>
                <Home className="h-4 w-4" />
              </Button>
            </div>

            {/* Title */}
            <div className="ml-2">
              <h1 className="text-lg md:text-xl font-semibold text-foreground">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground hidden sm:block">{subtitle}</p>}
            </div>
          </div>

          {/* Right side - Actions */}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </header>
  )
}

export default NavigationHeader
