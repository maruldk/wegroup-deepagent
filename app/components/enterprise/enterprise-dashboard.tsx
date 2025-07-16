
// WeGroup Platform - Sprint 4: Enterprise Dashboard Component
// Multi-Language, White-Label, and Integration Management

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Building, 
  Globe2, 
  Palette, 
  Puzzle,
  Languages,
  Brush,
  Settings,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

interface EnterpriseStats {
  totalTenants: number
  activeTenants: number
  supportedLanguages: number
  customBrands: number
  integrations: number
  whitelabelPackages: number
}

interface Language {
  locale: string
  displayName: string
  completionPercentage: number
  isEnabled: boolean
}

interface CustomBrand {
  tenantId: string
  brandName: string
  primaryColor: string
  customDomain?: string
  isActive: boolean
}

export default function EnterpriseDashboard() {
  const [stats, setStats] = useState<EnterpriseStats>({
    totalTenants: 12,
    activeTenants: 11,
    supportedLanguages: 5,
    customBrands: 8,
    integrations: 15,
    whitelabelPackages: 3
  })
  const [languages, setLanguages] = useState<Language[]>([])
  const [customBrands, setCustomBrands] = useState<CustomBrand[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEnterpriseData()
  }, [])

  const fetchEnterpriseData = async () => {
    try {
      // Simulate fetching enterprise data
      const mockLanguages: Language[] = [
        { locale: 'en', displayName: 'English', completionPercentage: 100, isEnabled: true },
        { locale: 'de', displayName: 'Deutsch', completionPercentage: 95, isEnabled: true },
        { locale: 'fr', displayName: 'Français', completionPercentage: 87, isEnabled: true },
        { locale: 'es', displayName: 'Español', completionPercentage: 82, isEnabled: true },
        { locale: 'it', displayName: 'Italiano', completionPercentage: 76, isEnabled: false }
      ]

      const mockBrands: CustomBrand[] = [
        { tenantId: 'tenant_1', brandName: 'TechCorp Solutions', primaryColor: '#3B82F6', customDomain: 'techcorp.example.com', isActive: true },
        { tenantId: 'tenant_2', brandName: 'Global Logistics Ltd', primaryColor: '#10B981', isActive: true },
        { tenantId: 'tenant_3', brandName: 'FinanceFlow', primaryColor: '#8B5CF6', customDomain: 'financeflow.example.com', isActive: true },
        { tenantId: 'tenant_4', brandName: 'CreativeStudio', primaryColor: '#F59E0B', isActive: true }
      ]

      setLanguages(mockLanguages)
      setCustomBrands(mockBrands)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch enterprise data:', error)
      setLoading(false)
    }
  }

  // Sample data for charts
  const tenantGrowthData = [
    { month: 'Jan', tenants: 8, active: 7 },
    { month: 'Feb', tenants: 9, active: 8 },
    { month: 'Mar', tenants: 10, active: 9 },
    { month: 'Apr', tenants: 11, active: 10 },
    { month: 'May', tenants: 12, active: 11 },
    { month: 'Jun', tenants: 12, active: 11 }
  ]

  const packageDistribution = [
    { name: 'Basic', value: 40, color: '#60B5FF' },
    { name: 'Professional', value: 45, color: '#FF9149' },
    { name: 'Enterprise', value: 15, color: '#80D8C3' }
  ]

  const integrationUsage = [
    { name: 'Microsoft 365', usage: 85, color: '#60B5FF' },
    { name: 'Slack', usage: 72, color: '#FF9149' },
    { name: 'Salesforce', usage: 68, color: '#80D8C3' },
    { name: 'SAP', usage: 45, color: '#A19AD3' },
    { name: 'Zoom', usage: 62, color: '#FF9898' }
  ]

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 95) return 'text-green-600'
    if (percentage >= 80) return 'text-blue-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enterprise Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTenants}</div>
            <p className="text-xs text-gray-600">of {stats.totalTenants} total</p>
            <Progress value={(stats.activeTenants / stats.totalTenants) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Languages</CardTitle>
            <Globe2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.supportedLanguages}</div>
            <p className="text-xs text-gray-600">Supported languages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custom Brands</CardTitle>
            <Palette className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customBrands}</div>
            <p className="text-xs text-gray-600">White-label configurations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integrations</CardTitle>
            <Puzzle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.integrations}</div>
            <p className="text-xs text-gray-600">Active integrations</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="localization">Multi-Language</TabsTrigger>
          <TabsTrigger value="white-label">White-Label</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tenant Growth */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tenant Growth
                </CardTitle>
                <CardDescription>Monthly tenant acquisition and activation</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={tenantGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="tenants" stroke="#60B5FF" strokeWidth={2} name="Total Tenants" />
                    <Line type="monotone" dataKey="active" stroke="#80D8C3" strokeWidth={2} name="Active Tenants" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Package Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Package Distribution
                </CardTitle>
                <CardDescription>White-label package usage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={packageDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {packageDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="localization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Language Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  Language Support
                </CardTitle>
                <CardDescription>Translation completion status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {languages.map((language) => (
                  <div key={language.locale} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{language.displayName}</span>
                        <Badge variant={language.isEnabled ? "default" : "secondary"}>
                          {language.isEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <span className={`font-bold ${getCompletionColor(language.completionPercentage)}`}>
                        {language.completionPercentage}%
                      </span>
                    </div>
                    <Progress value={language.completionPercentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Localization Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe2 className="h-5 w-5" />
                  Localization Insights
                </CardTitle>
                <CardDescription>Translation and locale insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Translation Quality</span>
                  </div>
                  <p className="text-sm text-green-700">
                    English and German translations are complete with high quality scores.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Languages className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">AI Translation</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Auto-translation enabled for Spanish and French with 95% accuracy.
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Italian Translation</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Italian translation needs completion for full market readiness.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="white-label" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Custom Brand Configurations
              </CardTitle>
              <CardDescription>White-label tenant customizations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customBrands.map((brand) => (
                  <div key={brand.tenantId} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: brand.primaryColor }}
                        />
                        <span className="font-medium">{brand.brandName}</span>
                      </div>
                      <Badge variant={brand.isActive ? "default" : "secondary"}>
                        {brand.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Primary Color:</span>
                        <span className="font-mono">{brand.primaryColor}</span>
                      </div>
                      {brand.customDomain && (
                        <div className="flex justify-between">
                          <span>Custom Domain:</span>
                          <span className="font-mono text-blue-600">{brand.customDomain}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Tenant ID:</span>
                        <span className="font-mono">{brand.tenantId.slice(0, 12)}...</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Integration Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Puzzle className="h-5 w-5" />
                  Integration Usage
                </CardTitle>
                <CardDescription>Popular enterprise integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={integrationUsage} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="usage" fill="#60B5FF" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Enterprise Actions
                </CardTitle>
                <CardDescription>Common enterprise management tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Languages className="h-4 w-4 mr-2" />
                  Add New Language
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Brush className="h-4 w-4 mr-2" />
                  Create Custom Brand
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Puzzle className="h-4 w-4 mr-2" />
                  Configure Integration
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Building className="h-4 w-4 mr-2" />
                  Manage Tenants
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Enterprise Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
