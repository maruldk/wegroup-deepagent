
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  Crown, 
  ChevronRight, 
  Globe,
  Loader2,
  Shield,
  ArrowRight
} from "lucide-react"
import { toast } from "sonner"
import { signOut, useSession } from "next-auth/react"

interface Tenant {
  id: string
  name: string
  domain: string
  subdomain?: string
  settings?: any
}

interface User {
  id: string
  email?: string | null
  firstName?: string | null
  lastName?: string | null
  roles?: any[]
  tenantId?: string | null
  tenant?: any
}

interface TenantSelectInterfaceProps {
  user: User
}

export function TenantSelectInterface({ user }: TenantSelectInterfaceProps) {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null)
  const router = useRouter()
  const { update } = useSession()

  // Check if user is super admin
  const isSuperAdmin = user?.roles?.some(role => role.name === 'super_admin')

  useEffect(() => {
    loadAvailableTenants()
  }, [])

  const loadAvailableTenants = async () => {
    try {
      const response = await fetch('/api/tenants/available', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTenants(data.tenants || [])
      } else {
        throw new Error('Failed to load tenants')
      }
    } catch (error) {
      console.error('Error loading tenants:', error)
      toast.error('Fehler beim Laden der Mandanten')
    } finally {
      setIsLoading(false)
    }
  }

  const selectTenant = async (tenantId: string) => {
    setIsSelecting(true)
    setSelectedTenant(tenantId)

    try {
      const response = await fetch('/api/auth/switch-tenant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tenantId })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Update session with new tenant info
        await update({
          user: {
            ...user,
            tenantId: data.tenant.id,
            tenant: data.tenant
          }
        })

        toast.success(`Mandant ${data.tenant.name} ausgewählt`)
        
        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        throw new Error('Tenant selection failed')
      }
    } catch (error) {
      console.error('Error selecting tenant:', error)
      toast.error('Fehler bei der Mandanten-Auswahl')
    } finally {
      setIsSelecting(false)
      setSelectedTenant(null)
    }
  }

  const continueWithoutTenant = async () => {
    if (!isSuperAdmin) {
      toast.error('Nur Super-Administratoren können ohne Mandant fortfahren')
      return
    }

    // For super admin, allow access to all tenants view
    router.push('/dashboard')
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/login' })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-3 mr-3">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Mandant auswählen</h1>
            <p className="text-gray-600 mt-2">
              Wählen Sie den Mandanten aus, mit dem Sie arbeiten möchten
            </p>
          </div>
        </div>
        
        {/* User Info */}
        <div className="bg-white rounded-lg p-4 inline-flex items-center space-x-3 shadow-sm border">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {user.firstName?.[0] || 'U'}{user.lastName?.[0] || 'S'}
          </div>
          <div className="text-left">
            <div className="font-medium text-gray-800">
              {user.firstName || ''} {user.lastName || ''}
            </div>
            <div className="text-sm text-gray-600">{user.email || 'Kein E-Mail'}</div>
          </div>
          {isSuperAdmin && (
            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
              <Crown className="w-3 h-3 mr-1" />
              Super Admin
            </Badge>
          )}
        </div>
      </div>

      {/* Tenant Selection */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Globe className="w-5 h-5 mr-2 text-blue-600" />
            Verfügbare Mandanten
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span className="text-gray-600">Lade Mandanten...</span>
            </div>
          ) : tenants.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Keine Mandanten verfügbar</p>
              {isSuperAdmin && (
                <Button onClick={continueWithoutTenant} className="bg-purple-600 hover:bg-purple-700">
                  <Crown className="w-4 h-4 mr-2" />
                  Als Super Admin fortfahren
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Super Admin Option */}
              {isSuperAdmin && (
                <>
                  <Card 
                    className="hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-purple-500 hover:border-l-purple-600 hover:bg-purple-50/30"
                    onClick={() => !isSelecting && continueWithoutTenant()}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                            <Crown className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">Alle Mandanten</h4>
                            <p className="text-sm text-gray-600">Übergreifende Super-Admin Ansicht</p>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                  <div className="border-t my-4"></div>
                </>
              )}

              {/* Tenant List */}
              {tenants.map((tenant) => (
                <Card 
                  key={tenant.id}
                  className={`hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500 hover:border-l-blue-600 hover:bg-blue-50/30 ${
                    isSelecting && selectedTenant === tenant.id ? 'opacity-75' : ''
                  }`}
                  onClick={() => !isSelecting && selectTenant(tenant.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {tenant.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{tenant.name}</h4>
                          <p className="text-sm text-gray-600">{tenant.domain}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isSelecting && selectedTenant === tenant.id ? (
                          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="text-center space-y-4">
        <div className="text-sm text-gray-500">
          Haben Sie Probleme? Wenden Sie sich an Ihren Administrator.
        </div>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="text-gray-600 hover:text-gray-800"
        >
          Abmelden
        </Button>
      </div>
    </div>
  )
}
