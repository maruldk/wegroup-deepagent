
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Mail, Lock, User, Loader2, Zap } from "lucide-react"

export function CompactRegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Fehler",
        description: "Die Passwörter stimmen nicht überein.",
        variant: "destructive"
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        })
      })

      if (response.ok) {
        // Auto-login after successful registration
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false
        })

        if (result?.ok) {
          toast({
            title: "Willkommen bei WeGroup!",
            description: "Ihr Konto wurde erstellt und Sie sind angemeldet."
          })
          router.push("/dashboard")
        } else {
          toast({
            title: "Registrierung erfolgreich",
            description: "Bitte melden Sie sich an."
          })
          router.push("/auth/login")
        }
      } else {
        const error = await response.json()
        toast({
          title: "Registrierung fehlgeschlagen",
          description: error.error || "Ein Fehler ist aufgetreten.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start mb-6">
          <div className="bg-blue-600 rounded-lg p-3 mr-3">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">WeGroup Platform</h1>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Starten Sie Ihre Reise
        </h2>
        <p className="text-gray-600">
          Erstellen Sie Ihr WeGroup-Konto und entdecken Sie die Kraft der KI für Ihr Unternehmen.
        </p>
      </div>

      {/* Form */}
      <Card className="shadow-xl border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-lg font-semibold">
            Konto erstellen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm">Vorname</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Max"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="pl-10 h-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm">Nachname</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Mustermann"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="pl-10 h-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">E-Mail-Adresse</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="max.mustermann@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 h-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Passwort</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 h-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm">Passwort bestätigen</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 h-10"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird erstellt...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Konto erstellen
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Login Link */}
      <div className="text-center text-sm text-gray-600">
        <p>
          Bereits ein Konto?{" "}
          <a href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Jetzt anmelden
          </a>
        </p>
      </div>
    </div>
  )
}
