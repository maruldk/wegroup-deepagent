
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Network, Plus, Settings, CheckCircle, AlertTriangle, Clock, Zap } from 'lucide-react'

export default function SettingsIntegrationsPage() {
  const integrations = [
    {
      id: 1,
      name: 'Slack',
      description: 'Team communication and notifications',
      category: 'Communication',
      status: 'connected',
      enabled: true,
      lastSync: '2024-01-15 14:30',
      apiKey: 'sk-123*********************',
      webhookUrl: 'https://hooks.slack.com/services/...'
    },
    {
      id: 2,
      name: 'Microsoft Teams',
      description: 'Video conferencing and collaboration',
      category: 'Communication',
      status: 'connected',
      enabled: true,
      lastSync: '2024-01-15 12:15',
      apiKey: 'mt-456*********************',
      webhookUrl: 'https://outlook.office.com/webhook/...'
    },
    {
      id: 3,
      name: 'Salesforce',
      description: 'Customer relationship management',
      category: 'CRM',
      status: 'error',
      enabled: false,
      lastSync: '2024-01-14 09:30',
      apiKey: 'sf-789*********************',
      webhookUrl: 'https://api.salesforce.com/...'
    },
    {
      id: 4,
      name: 'QuickBooks',
      description: 'Financial management and accounting',
      category: 'Finance',
      status: 'connected',
      enabled: true,
      lastSync: '2024-01-15 11:45',
      apiKey: 'qb-012*********************',
      webhookUrl: 'https://sandbox-quickbooks.api.intuit.com/...'
    },
    {
      id: 5,
      name: 'Google Workspace',
      description: 'Email, calendar, and document management',
      category: 'Productivity',
      status: 'pending',
      enabled: false,
      lastSync: null,
      apiKey: 'gw-345*********************',
      webhookUrl: 'https://www.googleapis.com/...'
    }
  ]

  const availableIntegrations = [
    { name: 'Zapier', description: 'Automation workflows', category: 'Automation' },
    { name: 'Trello', description: 'Project management', category: 'Project Management' },
    { name: 'Jira', description: 'Issue tracking', category: 'Development' },
    { name: 'HubSpot', description: 'Marketing automation', category: 'Marketing' },
    { name: 'Stripe', description: 'Payment processing', category: 'Finance' },
    { name: 'AWS', description: 'Cloud services', category: 'Infrastructure' }
  ]

  const stats = [
    { title: 'Active Integrations', value: '4', icon: Network },
    { title: 'API Calls Today', value: '2,847', icon: Zap },
    { title: 'Failed Syncs', value: '1', icon: AlertTriangle },
    { title: 'Last Updated', value: '2h ago', icon: Clock }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'disconnected': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return CheckCircle
      case 'error': return AlertTriangle
      case 'pending': return Clock
      default: return AlertTriangle
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Communication': return 'bg-blue-100 text-blue-800'
      case 'CRM': return 'bg-purple-100 text-purple-800'
      case 'Finance': return 'bg-green-100 text-green-800'
      case 'Productivity': return 'bg-orange-100 text-orange-800'
      case 'Automation': return 'bg-indigo-100 text-indigo-800'
      case 'Project Management': return 'bg-pink-100 text-pink-800'
      case 'Development': return 'bg-red-100 text-red-800'
      case 'Marketing': return 'bg-yellow-100 text-yellow-800'
      case 'Infrastructure': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600">Connect your favorite tools and services</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Integration
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            Active Integrations
          </CardTitle>
          <CardDescription>
            Manage your connected services and applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.map((integration) => {
              const StatusIcon = getStatusIcon(integration.status)
              return (
                <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Network className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                        <Badge className={getCategoryColor(integration.category)}>
                          {integration.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{integration.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>API Key: {integration.apiKey}</span>
                        {integration.lastSync && (
                          <>
                            <span>•</span>
                            <span>Last sync: {integration.lastSync}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={integration.enabled} />
                    <Badge className={getStatusColor(integration.status)}>
                      {integration.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Available Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Available Integrations
          </CardTitle>
          <CardDescription>
            Connect new services to enhance your workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableIntegrations.map((integration, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
                        <Network className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{integration.name}</h3>
                        <p className="text-xs text-gray-600">{integration.description}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="mt-3">
                    <Badge className={getCategoryColor(integration.category)}>
                      {integration.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Integration Settings
          </CardTitle>
          <CardDescription>
            Configure global integration preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Auto-sync Enabled</Label>
                <p className="text-xs text-gray-500">Automatically sync data with connected services</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Sync Frequency</Label>
                <p className="text-xs text-gray-500">How often to sync data</p>
              </div>
              <div className="w-32">
                <Input defaultValue="15" className="text-sm" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Error Notifications</Label>
                <p className="text-xs text-gray-500">Send alerts when sync fails</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">API Rate Limiting</Label>
                <p className="text-xs text-gray-500">Prevent API abuse and throttling</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
