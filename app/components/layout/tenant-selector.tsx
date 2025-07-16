"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Building2, 
  ChevronDown, 
  Check, 
  Globe,
  Crown,
  Loader2,
  Search,
  Star,
  Clock,
  Sparkles,
  TrendingUp,
  Brain,
  Bookmark,
  Zap
} from "lucide-react"
import { toast } from "sonner"

interface Tenant {
  id: string
  name: string
  domain: string
  subdomain?: string
  settings?: any
}

interface AIRecommendation {
  tenantId: string
  tenantName: string
  score: number
  reason: string
  type: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
}

interface TenantSelectorProps {
  className?: string
}

export function TenantSelector({ className }: TenantSelectorProps) {
  const { data: session, update } = useSession()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([])
  const [recentTenants, setRecentTenants] = useState<string[]>([])
  const [favoriteTenants, setFavoriteTenants] = useState<string[]>([])

  // Check if user is super admin (has access to all tenants)
  const isSuperAdmin = session?.user?.roles?.some(role => role.name === 'super_admin')

  useEffect(() => {
    loadAvailableTenants()
    loadAIRecommendations()
  }, [session])

  const loadAvailableTenants = async () => {
    if (!session?.user) return

    setIsLoading(true)
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
      }
    } catch (error) {
      console.error('Error loading tenants:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadAIRecommendations = async () => {
    if (!session?.user) return

    setIsLoadingAI(true)
    try {
      const response = await fetch('/api/ai/tenant-recommendations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAiRecommendations(data.recommendations || [])
        
        // Extract recent and favorite patterns from user context
        if (data.userContext) {
          // This would come from user preferences in a real implementation
          setRecentTenants([])
          setFavoriteTenants([])
        }
      }
    } catch (error) {
      console.error('Error loading AI recommendations:', error)
    } finally {
      setIsLoadingAI(false)
    }
  }

  const switchTenant = async (tenantId: string, source: string = 'manual', context: any = {}) => {
    if (!session?.user || tenantId === session.user.tenantId) return

    setIsSwitching(true)
    try {
      const response = await fetch('/api/auth/switch-tenant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          tenantId,
          source,
          context
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Update session with new tenant info
        await update({
          ...session,
          user: {
            ...session.user,
            tenantId: data.tenant.id,
            tenant: data.tenant
          }
        })

        toast.success(`Gewechselt zu ${data.tenant.name}`)
        
        // Smooth transition without full page reload
        setTimeout(() => {
          window.location.reload()
        }, 500)
      } else {
        throw new Error('Tenant switch failed')
      }
    } catch (error) {
      console.error('Error switching tenant:', error)
      toast.error('Fehler beim Mandanten-Wechsel')
    } finally {
      setIsSwitching(false)
    }
  }

  const toggleFavorite = (tenantId: string) => {
    setFavoriteTenants(prev => 
      prev.includes(tenantId) 
        ? prev.filter(id => id !== tenantId)
        : [...prev, tenantId]
    )
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'USAGE_BASED': return <TrendingUp className="w-3 h-3" />
      case 'ROLE_BASED': return <Crown className="w-3 h-3" />
      case 'TIME_BASED': return <Clock className="w-3 h-3" />
      case 'AI_SUGGESTED': return <Brain className="w-3 h-3" />
      default: return <Sparkles className="w-3 h-3" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-500'
      case 'MEDIUM': return 'text-yellow-500'
      default: return 'text-green-500'
    }
  }

  // Filter tenants based on search
  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.domain.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get high-priority AI recommendations
  const topRecommendations = aiRecommendations
    .filter(rec => rec.priority === 'HIGH')
    .slice(0, 3)

  const currentTenant = session?.user?.tenant
  
  if (!session?.user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={`flex items-center space-x-2 hover:bg-gray-100 transition-all duration-200 ${className}`}
          disabled={isSwitching}
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              {isSuperAdmin ? (
                <Crown className="w-4 h-4 text-white" />
              ) : (
                <Building2 className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-sm font-medium text-gray-700">
                {currentTenant?.name || 'Mandant wählen'}
              </div>
              <div className="text-xs text-gray-500 flex items-center space-x-1">
                {isSuperAdmin && <Crown className="w-3 h-3" />}
                <span>{isSuperAdmin ? 'Super Admin' : 'Aktueller Mandant'}</span>
              </div>
            </div>
          </div>
          {isSwitching ? (
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-96 max-h-[600px] overflow-y-auto">
        <DropdownMenuLabel>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Smart Mandanten-Auswahl</span>
            </div>
            {isSuperAdmin && (
              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                <Crown className="w-3 h-3 mr-1" />
                Super Admin
              </Badge>
            )}
          </div>
        </DropdownMenuLabel>
        
        {/* Search */}
        <div className="p-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Mandanten suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-8 text-sm"
            />
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* AI Recommendations */}
        {topRecommendations.length > 0 && (
          <>
            <DropdownMenuLabel className="text-xs font-semibold text-purple-600 flex items-center space-x-1">
              <Brain className="w-3 h-3" />
              <span>KI-Empfehlungen</span>
              {isLoadingAI && <Loader2 className="w-3 h-3 animate-spin" />}
            </DropdownMenuLabel>
            {topRecommendations.map((rec, index) => {
              const tenant = tenants.find(t => t.id === rec.tenantId)
              if (!tenant) return null
              
              return (
                <DropdownMenuItem
                  key={`rec-${rec.tenantId}-${index}`}
                  onClick={() => switchTenant(rec.tenantId, 'ai_recommendation', { 
                    score: rec.score, 
                    reason: rec.reason,
                    type: rec.type
                  })}
                  className="px-3 py-2 hover:bg-purple-50 cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Zap className="w-3 h-3 text-purple-500 mr-1" />
                        {getRecommendationIcon(rec.type)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm flex items-center space-x-1">
                          <span>{tenant.name}</span>
                          <div className={`w-1 h-1 rounded-full ${getPriorityColor(rec.priority)}`} />
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">
                          {rec.reason}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-purple-600 font-medium">
                      {Math.round(rec.score * 100)}%
                    </div>
                  </div>
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
          </>
        )}

        {/* Super Admin: All Tenants View */}
        {isSuperAdmin && (
          <>
            <DropdownMenuItem
              onClick={() => switchTenant('all', 'super_admin')}
              className={`px-3 py-2 ${currentTenant?.id === 'all' ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <Crown className="w-4 h-4 text-purple-500" />
                  <div>
                    <div className="font-medium text-sm">Alle Mandanten</div>
                    <div className="text-xs text-gray-500">Übergreifende Admin-Ansicht</div>
                  </div>
                </div>
                {currentTenant?.id === 'all' && (
                  <Check className="w-4 h-4 text-blue-500" />
                )}
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Main Tenant List */}
        <DropdownMenuLabel className="text-xs font-semibold text-gray-600">
          Alle Mandanten
        </DropdownMenuLabel>

        {isLoading ? (
          <DropdownMenuItem disabled className="px-3 py-2">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Lade Mandanten...
          </DropdownMenuItem>
        ) : filteredTenants.length === 0 ? (
          <DropdownMenuItem disabled className="px-3 py-2">
            <div className="text-center text-gray-500 py-2 w-full">
              {searchQuery ? 'Keine Mandanten gefunden' : 'Keine Mandanten verfügbar'}
            </div>
          </DropdownMenuItem>
        ) : (
          filteredTenants.map((tenant) => (
            <DropdownMenuItem
              key={tenant.id}
              onClick={() => switchTenant(tenant.id, 'manual')}
              className={`px-3 py-2 ${currentTenant?.id === tenant.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-blue-500" />
                  <div className="flex-1">
                    <div className="font-medium text-sm flex items-center space-x-1">
                      <span>{tenant.name}</span>
                      {favoriteTenants.includes(tenant.id) && (
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {tenant.domain}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-gray-200"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(tenant.id)
                    }}
                  >
                    <Bookmark className={`w-3 h-3 ${favoriteTenants.includes(tenant.id) ? 'fill-current text-yellow-500' : 'text-gray-400'}`} />
                  </Button>
                  {currentTenant?.id === tenant.id && (
                    <Check className="w-4 h-4 text-blue-500" />
                  )}
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}

        {/* Footer */}
        <Separator />
        <div className="p-3 text-xs text-gray-500 bg-gray-50">
          <div className="flex items-center justify-between">
            <span>KI-optimierte Auswahl</span>
            <div className="flex items-center space-x-1">
              <Brain className="w-3 h-3" />
              <span>Powered by AI</span>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
