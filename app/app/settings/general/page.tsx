
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Globe, Settings, Save, Clock, User, Building, Mail } from 'lucide-react'

export default function SettingsGeneralPage() {
  const generalSettings = [
    {
      category: 'Company Information',
      settings: [
        { id: 'company_name', label: 'Company Name', type: 'text', value: 'WeGroup Platform' },
        { id: 'company_email', label: 'Company Email', type: 'email', value: 'info@wegroup.com' },
        { id: 'company_phone', label: 'Company Phone', type: 'tel', value: '+49 30 12345678' },
        { id: 'company_address', label: 'Company Address', type: 'text', value: 'Berlin, Germany' }
      ]
    },
    {
      category: 'Localization',
      settings: [
        { id: 'language', label: 'Default Language', type: 'select', value: 'de', options: ['de', 'en', 'fr'] },
        { id: 'timezone', label: 'Timezone', type: 'select', value: 'Europe/Berlin', options: ['Europe/Berlin', 'UTC', 'America/New_York'] },
        { id: 'date_format', label: 'Date Format', type: 'select', value: 'DD.MM.YYYY', options: ['DD.MM.YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
        { id: 'currency', label: 'Currency', type: 'select', value: 'EUR', options: ['EUR', 'USD', 'GBP'] }
      ]
    },
    {
      category: 'System Preferences',
      settings: [
        { id: 'auto_backup', label: 'Auto Backup', type: 'switch', value: true },
        { id: 'email_notifications', label: 'Email Notifications', type: 'switch', value: true },
        { id: 'maintenance_mode', label: 'Maintenance Mode', type: 'switch', value: false },
        { id: 'debug_mode', label: 'Debug Mode', type: 'switch', value: false }
      ]
    }
  ]

  const stats = [
    { title: 'Active Users', value: '247', icon: User },
    { title: 'System Uptime', value: '99.9%', icon: Clock },
    { title: 'Data Storage', value: '2.4 TB', icon: Building },
    { title: 'API Requests', value: '12.5K', icon: Globe }
  ]

  const renderSetting = (setting: any) => {
    switch (setting.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <Input
            type={setting.type}
            defaultValue={setting.value}
            className="mt-1"
          />
        )
      case 'select':
        return (
          <Select defaultValue={setting.value}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {setting.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case 'switch':
        return (
          <Switch
            defaultChecked={setting.value}
            className="mt-1"
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">General Settings</h1>
          <p className="text-gray-600">Configure your system's general settings and preferences</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
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

      {/* Settings Categories */}
      <div className="space-y-6">
        {generalSettings.map((category, categoryIndex) => (
          <Card key={categoryIndex}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {category.category}
              </CardTitle>
              <CardDescription>
                Configure {category.category.toLowerCase()} settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {category.settings.map((setting, settingIndex) => (
                  <div key={settingIndex} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor={setting.id} className="text-sm font-medium">
                        {setting.label}
                      </Label>
                      {setting.type === 'switch' && (
                        <p className="text-xs text-gray-500">
                          {setting.value ? 'Enabled' : 'Disabled'}
                        </p>
                      )}
                    </div>
                    <div className="w-64">
                      {renderSetting(setting)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            System Status
          </CardTitle>
          <CardDescription>
            Current system health and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Connection</span>
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Status</span>
                <Badge className="bg-green-100 text-green-800">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Service</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Backup Service</span>
                <Badge className="bg-green-100 text-green-800">Running</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">CPU Usage</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Memory Usage</span>
                <span className="text-sm font-medium">67%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Disk Usage</span>
                <span className="text-sm font-medium">23%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Network Load</span>
                <span className="text-sm font-medium">12%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          Reset to Defaults
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Save All Changes
        </Button>
      </div>
    </div>
  )
}
