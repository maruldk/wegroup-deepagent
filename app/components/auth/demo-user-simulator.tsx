
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Shield, 
  Crown, 
  Users, 
  Briefcase, 
  ShoppingCart, 
  Truck, 
  User,
  Building,
  Play,
  ChevronRight,
  Globe,
  Loader2
} from "lucide-react"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DemoUser {
  id: string
  name: string
  email: string
  role: string
  company: string
  tenant: string
  tenantType: string
  businessArea?: string
  avatar: string
  permissions: string[]
  description: string
}

const demoUsers: Record<string, DemoUser[]> = {
  portals: [
    {
      id: "customer-demo",
      name: "Anna Schmidt",
      email: "customer.demo@wegroup.com",
      role: "Kunde",
      company: "Beispiel-Kunde GmbH",
      tenant: "WeGroup Demo",
      tenantType: "Customer Portal",
      businessArea: "Kundenportal",
      avatar: "AS",
      permissions: ["Aufträge anzeigen", "Anfragen erstellen", "Angebote einsehen"],
      description: "Demo-Zugang zum Kundenportal"
    },
    {
      id: "supplier-demo",
      name: "Thomas Müller",
      email: "supplier.demo@wegroup.com",
      role: "Lieferant",
      company: "Lieferant Solutions GmbH",
      tenant: "WeGroup Demo",
      tenantType: "Supplier Portal",
      businessArea: "Lieferantenportal",
      avatar: "TM",
      permissions: ["RFQs anzeigen", "Angebote abgeben", "Aufträge verwalten"],
      description: "Demo-Zugang zum Lieferantenportal"
    }
  ],
  administrators: [
    {
      id: "super-admin-1",
      name: "Dr. Sarah Weber",
      email: "sarah.weber@wegroup.de",
      role: "Super-Administrator",
      company: "WeGroup Central",
      tenant: "Alle Mandanten",
      tenantType: "WeGROUP GmbH",
      businessArea: "System Administration",
      avatar: "SW",
      permissions: ["Alle Rechte", "Mandanten-übergreifend", "System-Administration"],
      description: "Vollzugriff auf alle Module und Mandanten"
    },
    {
      id: "legacy-super-admin",
      name: "Admin User",
      email: "admin@wegroup.demo",
      role: "Super-Administrator (Legacy)",
      company: "WeGroup Demo",
      tenant: "System-Level",
      tenantType: "System Administrator",
      businessArea: "System Administration",
      avatar: "AD",
      permissions: ["System-Administration", "Alle Rechte", "Legacy-Support"],
      description: "Legacy Super-Admin mit vollem Systemzugriff"
    },
    {
      id: "tenant-admin-1", 
      name: "John Doe",
      email: "john@doe.com",
      role: "Mandanten-Administrator",
      company: "WeGroup Demo",
      tenant: "WeGroup Demo",
      tenantType: "WeGroup Demo Tenant",
      businessArea: "Demo Administration",
      avatar: "JD",
      permissions: ["Mandanten-Administration", "Benutzer-Management", "Demo-Funktionen"],
      description: "Haupttest-Account mit Mandanten-Administration"
    },
    {
      id: "tenant-admin-2", 
      name: "Michael Bauer",
      email: "m.bauer@techcorp.de",
      role: "Mandanten-Administrator",
      company: "TechCorp Solutions",
      tenant: "WFS Fulfillment Solutions",
      tenantType: "WFS Fulfillment Solutions GmbH",
      businessArea: "Technology Solutions",
      avatar: "MB",
      permissions: ["Mandanten-Administration", "Benutzer-Management", "Module-Konfiguration"],
      description: "Vollzugriff innerhalb des WFS Mandanten"
    },
    {
      id: "tenant-admin-3",
      name: "Angela Fischer",
      email: "a.fischer@globallogistics.de", 
      role: "Mandanten-Administrator",
      company: "Global Logistics GmbH",
      tenant: "Abundance GH",
      tenantType: "Abundance GH",
      businessArea: "Logistics & Holdings",
      avatar: "AF",
      permissions: ["Mandanten-Administration", "Benutzer-Management", "Logistics-Module"],
      description: "Vollzugriff innerhalb des Abundance Mandanten"
    }
  ],
  clevel: [
    {
      id: "ceo-1",
      name: "Maria Schmidt",
      email: "ceo@wegroup.demo",
      role: "Geschäftsführer",
      company: "WeGroup Demo",
      tenant: "WeGroup Demo",
      tenantType: "WeGroup Demo Tenant",
      businessArea: "Executive Leadership",
      avatar: "MS",
      permissions: ["Executive Dashboard", "Finanz-Reports", "Strategische Planung"],
      description: "C-Level Zugriff mit strategischen Entscheidungsrechten"
    },
    {
      id: "ceo-2",
      name: "Thomas Hartmann",
      email: "t.hartmann@techcorp.de",
      role: "Geschäftsführer",
      company: "TechCorp Solutions",
      tenant: "WFS Fulfillment Solutions",
      tenantType: "WFS Fulfillment Solutions GmbH",
      businessArea: "Technology Leadership",
      avatar: "TH",
      permissions: ["Executive Dashboard", "Finanz-Reports", "Strategische Planung"],
      description: "C-Level Zugriff mit strategischen Entscheidungsrechten"
    },
    {
      id: "cfo-1",
      name: "Dr. Petra Schneider",
      email: "p.schneider@globallogistics.de",
      role: "Finanzvorstand",
      company: "Global Logistics GmbH", 
      tenant: "Abundance GH",
      tenantType: "Abundance GH",
      businessArea: "Finance & Investment",
      avatar: "PS",
      permissions: ["Finance-Module", "Budget-Planning", "Cost-Center Management"],
      description: "Finanzverantwortung und Budget-Kontrolle"
    }
  ],
  management: [
    {
      id: "manager-1",
      name: "Thomas Weber",
      email: "manager@wegroup.demo",
      role: "Abteilungsleiter",
      company: "WeGroup Demo",
      tenant: "WeGroup Demo",
      tenantType: "WeGroup Demo Tenant",
      businessArea: "Team Management",
      avatar: "TW",
      permissions: ["Team-Management", "Projekt-Verwaltung", "Reporting"],
      description: "Management-Zugriff mit Team-Führungsrechten"
    },
    {
      id: "hr-manager-1",
      name: "Klaus Zimmermann",
      email: "admin@wfs-fulfillment.de",
      role: "Administrator",
      company: "WFS Fulfillment Solutions",
      tenant: "WFS Fulfillment Solutions",
      tenantType: "WFS Fulfillment Solutions GmbH",
      businessArea: "Administration",
      avatar: "KZ",
      permissions: ["Administration", "Benutzer-Verwaltung", "System-Konfiguration"],
      description: "Vollzugriff auf WFS Fulfillment Solutions"
    },
    {
      id: "dept-manager-1",
      name: "Maria Schmidt",
      email: "admin@abundance.de",
      role: "Administrator",
      company: "Abundance",
      tenant: "Abundance",
      tenantType: "Abundance GH",
      businessArea: "Administration",
      avatar: "MS",
      permissions: ["Administration", "Benutzer-Verwaltung", "Logistics-Module"],
      description: "Vollzugriff auf Abundance Mandant"
    }
  ],
  operative: [
    {
      id: "employee-1",
      name: "Anna Müller",
      email: "employee@wegroup.demo",
      role: "Mitarbeiterin",
      company: "WeGroup Demo",
      tenant: "WeGroup Demo",
      tenantType: "WeGroup Demo Tenant",
      businessArea: "General Operations",
      avatar: "AM",
      permissions: ["Basis-Module", "Zeiterfassung", "Self-Service"],
      description: "Standard Mitarbeiter-Zugriff"
    },
    {
      id: "employee-2",
      name: "Sandra Koch",
      email: "operations@wfs-fulfillment.de",
      role: "Operations Spezialist",
      company: "WFS Fulfillment Solutions",
      tenant: "WFS Fulfillment Solutions",
      tenantType: "WFS Fulfillment Solutions GmbH",
      businessArea: "Operations",
      avatar: "SK",
      permissions: ["Operations-Dashboard", "Auftragsbearbeitung", "Reporting"],
      description: "Operative Tätigkeit im WFS Fulfillment"
    },
    {
      id: "employee-3",
      name: "Michael Wagner",
      email: "logistics@wfs-fulfillment.de",
      role: "Logistik-Spezialist", 
      company: "WFS Fulfillment Solutions",
      tenant: "WFS Fulfillment Solutions",
      tenantType: "WFS Fulfillment Solutions GmbH",
      businessArea: "Logistics",
      avatar: "MW",
      permissions: ["Logistik-Dashboard", "Sendungsverfolgung", "Lagerverwaltung"],
      description: "Spezialisierte Logistik-Funktionen"
    }
  ]
}

const roleConfig = {
  portals: {
    title: "Portale",
    icon: Globe,
    color: "bg-orange-100 text-orange-700 border-orange-200",
    description: "Kunden- & Lieferantenportale"
  },
  administrators: {
    title: "Administratoren",
    icon: Shield,
    color: "bg-red-100 text-red-700 border-red-200",
    description: "Super-Admin & Mandanten-Administration"
  },
  clevel: {
    title: "C-Level",
    icon: Crown,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    description: "Geschäftsführung & Vorstände"
  },
  management: {
    title: "Management", 
    icon: Users,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    description: "Führungskräfte & Abteilungsleiter"
  },
  operative: {
    title: "Operative",
    icon: Briefcase,
    color: "bg-green-100 text-green-700 border-green-200", 
    description: "Mitarbeiter & Angestellte"
  }
}

export function DemoUserSimulator() {
  const [selectedUser, setSelectedUser] = useState<DemoUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleDemoLogin = async (user: DemoUser) => {
    console.log('=== DEMO LOGIN GESTARTET ===')
    console.log('User:', user.name, 'ID:', user.id)
    
    setIsLoading(true)
    setSelectedUser(user)
    
    try {
      toast.success(`Demo-Login als ${user.name} wird vorbereitet...`)
      
      console.log('Rufe Demo-Login API auf...')
      // Demo-Login API aufrufen
      const response = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ demoUserId: user.id })
      })

      console.log('API Response Status:', response.status)
      const data = await response.json()
      console.log('API Response Data:', data)

      if (data.success) {
        console.log('Demo-Login API erfolgreich, starte NextAuth Login...')
        
        // Richtiges Passwort für Demo-User bestimmen
        const getPasswordForUser = (email: string) => {
          const passwordMap: Record<string, string> = {
            // Portal Demo Users
            'customer.demo@wegroup.com': 'demo123',
            'supplier.demo@wegroup.com': 'demo123',
            // Internal Demo Users
            'sarah.weber@wegroup.de': 'demo123',
            'admin@wegroup.demo': 'admin123',
            'john@doe.com': 'johndoe123',
            'ceo@wegroup.demo': 'ceo123',
            't.hartmann@techcorp.de': 'demo123',
            'p.schneider@globallogistics.de': 'demo123',
            'manager@wegroup.demo': 'manager123',
            'admin@wfs-fulfillment.de': 'demo123',
            'admin@abundance.de': 'demo123',
            'employee@wegroup.demo': 'employee123',
            'operations@wfs-fulfillment.de': 'demo123',
            'logistics@wfs-fulfillment.de': 'demo123',
            'm.bauer@techcorp.de': 'demo123',
            'a.fischer@globallogistics.de': 'demo123'
          }
          return passwordMap[email] || 'demo123'
        }

        // Echten NextAuth Login mit Demo-User Credentials durchführen
        const result = await signIn('credentials', { 
          email: user.email, 
          password: getPasswordForUser(user.email),
          redirect: false 
        })

        console.log('NextAuth Login Result:', result)

        if (result?.ok) {
          toast.success(`Erfolgreich als ${user.role} angemeldet!`)
          console.log('Login erfolgreich! Weiterleitung zu:', data.redirectUrl)
          
          // Weiterleitung zur korrekten URL nach kurzer Verzögerung
          setTimeout(() => {
            router.push(data.redirectUrl || '/dashboard')
          }, 1000)
        } else {
          console.error('NextAuth Login fehlgeschlagen:', result)
          throw new Error(result?.error || 'Login fehlgeschlagen')
        }
      } else {
        console.error('Demo-Login API fehlgeschlagen:', data)
        throw new Error(data.error || 'Demo-Login fehlgeschlagen')
      }
      
    } catch (error) {
      console.error('Demo-Login Error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler'
      toast.error(`Demo-Login fehlgeschlagen: ${errorMessage}`)
    } finally {
      setIsLoading(false)
      setSelectedUser(null)
    }
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-3 mr-3">
            <Play className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Demo-Simulator</h3>
        </div>
        <p className="text-gray-600 max-w-md mx-auto">
          Erleben Sie WeGroup aus verschiedenen Rollen-Perspektiven
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center p-4 hover:shadow-md transition-shadow">
          <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">13</div>
          <div className="text-sm text-gray-600">Demo-Benutzer</div>
        </Card>
        <Card className="text-center p-4 hover:shadow-md transition-shadow">
          <Building className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">5</div>
          <div className="text-sm text-gray-600">Rollen-Arten</div>
        </Card>
        <Card className="text-center p-4 hover:shadow-md transition-shadow">
          <Globe className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">8</div>
          <div className="text-sm text-gray-600">Mandanten</div>
        </Card>
      </div>

      {/* Demo User Tabs - Flexible height */}
      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className="flex items-center text-lg">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Wählen Sie Ihre Demo-Rolle
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0">
          <Tabs defaultValue="portals" className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-5 mb-4 flex-shrink-0">
              {Object.entries(roleConfig).map(([key, config]) => {
                const IconComponent = config.icon
                return (
                  <TabsTrigger 
                    key={key} 
                    value={key}
                    className="text-xs px-2 py-2 flex flex-col items-center space-y-1"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="hidden sm:block">{config.title}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            <div className="flex-1 overflow-y-auto pr-2">
              {Object.entries(demoUsers).map(([roleKey, users]) => (
                <TabsContent key={roleKey} value={roleKey} className="mt-0 space-y-3">
                  <div className="mb-4">
                    <Badge className={`${roleConfig[roleKey as keyof typeof roleConfig].color} mb-2`}>
                      {roleConfig[roleKey as keyof typeof roleConfig].description}
                    </Badge>
                  </div>
                  
                  {users.map((user) => (
                    <Card 
                      key={user.id}
                      className={`hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500 hover:border-l-blue-600 hover:bg-blue-50/30 ${
                        isLoading && selectedUser?.id === user.id ? 'opacity-75' : ''
                      }`}
                      onClick={() => !isLoading && handleDemoLogin(user)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                              {user.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold text-gray-800 text-sm">
                                  {user.name}
                                </h4>
                                <Badge variant="outline" className="text-xs">
                                  {user.role}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">
                                {user.company} • <span className="font-medium text-blue-600">{user.tenant}</span>
                              </p>
                              {user.tenantType && (
                                <div className="flex items-center space-x-2 mb-2">
                                  <Globe className="w-3 h-3 text-purple-500" />
                                  <span className="text-xs text-purple-600 font-medium">
                                    {user.tenantType}
                                  </span>
                                  {user.businessArea && (
                                    <span className="text-xs text-gray-500">• {user.businessArea}</span>
                                  )}
                                </div>
                              )}
                              <p className="text-xs text-gray-500 mb-2">
                                {user.description}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {user.permissions.slice(0, 2).map((permission, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {permission}
                                  </Badge>
                                ))}
                                {user.permissions.length > 2 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{user.permissions.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              disabled={isLoading}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDemoLogin(user)
                              }}
                            >
                              {isLoading && selectedUser?.id === user.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <>
                                  <Play className="w-3 h-3 mr-1" />
                                  Demo
                                </>
                              )}
                            </Button>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Bottom CTA */}
      <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex-shrink-0">
        <h4 className="font-semibold text-gray-800 mb-2">
          Bereit für Ihre Rolle?
        </h4>
        <p className="text-sm text-gray-600">
          Entdecken Sie rollenspezifische Dashboards und Funktionen
        </p>
      </div>
    </div>
  )
}
