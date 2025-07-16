
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Shield, Lock, Key, AlertTriangle, CheckCircle, Eye, Users, Clock } from 'lucide-react'

export default function SettingsSecurityPage() {
  const securitySettings = [
    {
      category: 'Authentication',
      settings: [
        { id: 'password_policy', label: 'Password Policy', type: 'select', value: 'strong', options: ['weak', 'medium', 'strong'] },
        { id: 'two_factor', label: 'Two-Factor Authentication', type: 'switch', value: true },
        { id: 'session_timeout', label: 'Session Timeout (minutes)', type: 'number', value: 30 },
        { id: 'max_login_attempts', label: 'Max Login Attempts', type: 'number', value: 5 }
      ]
    },
    {
      category: 'Access Control',
      settings: [
        { id: 'role_based_access', label: 'Role-Based Access Control', type: 'switch', value: true },
        { id: 'ip_whitelist', label: 'IP Whitelist', type: 'switch', value: false },
        { id: 'api_rate_limiting', label: 'API Rate Limiting', type: 'switch', value: true },
        { id: 'audit_logging', label: 'Audit Logging', type: 'switch', value: true }
      ]
    },
    {
      category: 'Data Protection',
      settings: [
        { id: 'data_encryption', label: 'Data Encryption', type: 'switch', value: true },
        { id: 'backup_encryption', label: 'Backup Encryption', type: 'switch', value: true },
        { id: 'gdpr_compliance', label: 'GDPR Compliance', type: 'switch', value: true },
        { id: 'data_retention', label: 'Data Retention (days)', type: 'number', value: 365 }
      ]
    }
  ]

  const securityAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Failed Login Attempts',
      message: '5 failed login attempts from IP 192.168.1.100',
      timestamp: '2024-01-15 14:30',
      status: 'active'
    },
    {
      id: 2,
      type: 'info',
      title: 'Security Update Available',
      message: 'A security update is available for the authentication system',
      timestamp: '2024-01-15 12:15',
      status: 'pending'
    },
    {
      id: 3,
      type: 'success',
      title: 'Security Scan Completed',
      message: 'Weekly security scan completed successfully with no vulnerabilities',
      timestamp: '2024-01-15 10:00',
      status: 'resolved'
    }
  ]

  const stats = [
    { title: 'Active Sessions', value: '147', icon: Users },
    { title: 'Security Score', value: '94%', icon: Shield },
    { title: 'Failed Logins', value: '12', icon: AlertTriangle },
    { title: 'Last Audit', value: '2h ago', icon: Clock }
  ]

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'info': return 'bg-blue-100 text-blue-800'
      case 'success': return 'bg-green-100 text-green-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle
      case 'info': return Eye
      case 'success': return CheckCircle
      case 'error': return AlertTriangle
      default: return Eye
    }
  }

  const renderSetting = (setting: any) => {
    switch (setting.type) {
      case 'number':
        return (
          <Input
            type="number"
            defaultValue={setting.value}
            className="mt-1 w-24"
          />
        )
      case 'select':
        return (
          <Select defaultValue={setting.value}>
            <SelectTrigger className="mt-1 w-32">
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
          <h1 className="text-3xl font-bold text-gray-900">Security Settings</h1>
          <p className="text-gray-600">Configure security policies and access controls</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Shield className="w-4 h-4 mr-2" />
          Run Security Scan
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

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Security Alerts
          </CardTitle>
          <CardDescription>
            Recent security events and alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityAlerts.map((alert) => {
              const IconComponent = getAlertIcon(alert.type)
              return (
                <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${alert.type === 'warning' ? 'bg-yellow-100' : alert.type === 'success' ? 'bg-green-100' : 'bg-blue-100'}`}>
                      <IconComponent className={`w-6 h-6 ${alert.type === 'warning' ? 'text-yellow-600' : alert.type === 'success' ? 'text-green-600' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                      <p className="text-sm text-gray-600">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                    </div>
                  </div>
                  <Badge className={getAlertColor(alert.type)}>
                    {alert.status}
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <div className="space-y-6">
        {securitySettings.map((category, categoryIndex) => (
          <Card key={categoryIndex}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
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
                    <div>
                      {renderSetting(setting)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Security Audit</h3>
                <p className="text-sm text-gray-600">Run comprehensive security check</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Key className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold">API Keys</h3>
                <p className="text-sm text-gray-600">Manage API access keys</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="font-semibold">User Permissions</h3>
                <p className="text-sm text-gray-600">Review user access rights</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
