
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Mail, Lock, Loader2, Zap } from "lucide-react"

export function CompactLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        toast({
          title: "Anmeldung fehlgeschlagen",
          description: "Bitte überprüfen Sie Ihre Anmeldedaten.",
          variant: "destructive"
        })
      } else {
        toast({
          title: "Willkommen zurück!",
          description: "Sie werden weitergeleitet..."
        })
        router.push("/dashboard")
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
          Willkommen zurück
        </h2>
        <p className="text-gray-600">
          Melden Sie sich in Ihrem WeGroup-Konto an, um Zugriff auf Ihre KI-gestützte Plattform zu erhalten.
        </p>
      </div>

      {/* Form */}
      <Card className="shadow-xl border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-lg font-semibold">
            Anmelden
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">E-Mail-Adresse</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ihre.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  Wird angemeldet...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Anmelden
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <a 
              href="/auth/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Passwort vergessen?
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Register Link */}
      <div className="text-center text-sm text-gray-600">
        <p>
          Noch kein Konto?{" "}
          <a href="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
            Jetzt registrieren
          </a>
        </p>
      </div>
    </div>
  )
}
