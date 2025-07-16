
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { 
  Settings, 
  Users, 
  Shield, 
  Bell,
  Globe,
  Palette,
  Database,
  Key,
  Mail,
  Smartphone,
  Clock,
  Archive,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Info,
  Plus
} from 'lucide-react'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    slack: true
  })

  const [security, setSecurity] = useState({
    twoFactor: true,
    passwordExpiry: false,
    sessionTimeout: true,
    ipRestriction: false
  })

  const [system, setSystem] = useState({
    autoBackup: true,
    maintenanceMode: false,
    debugMode: false,
    analytics: true
  })

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Einstellungen</h1>
          <p className="text-gray-600 mt-1">Verwalten Sie Ihre Plattform-Konfiguration und Präferenzen</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          <Settings className="w-4 h-4 mr-1" />
          Super Admin
        </Badge>
      </div>

      {/* System Status */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">System Status</p>
                <p className="text-lg font-bold text-green-600">Online</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Database className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">DB Status</p>
                <p className="text-lg font-bold text-blue-600">Healthy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-lg font-bold text-gray-900">99.9%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-lg font-bold text-gray-900">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">
            <Settings className="w-4 h-4 mr-2" />
            Allgemein
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Benachrichtigungen
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            Sicherheit
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />
            Benutzer
          </TabsTrigger>
          <TabsTrigger value="system">
            <Database className="w-4 h-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Globe className="w-4 h-4 mr-2" />
            Integrationen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2 text-blue-600" />
                  Darstellung & Theme
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-gray-600">Dunkles Theme aktivieren</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Kompaktes Layout</p>
                    <p className="text-sm text-gray-600">Weniger Abstände für mehr Inhalt</p>
                  </div>
                  <Switch />
                </div>
                <div>
                  <p className="font-medium mb-2">Akzentfarbe</p>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-blue-600"></div>
                    <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                    <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
                    <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-green-600" />
                  Sprache & Region
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Sprache</p>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>Deutsch</option>
                    <option>English</option>
                    <option>Français</option>
                  </select>
                </div>
                <div>
                  <p className="font-medium mb-2">Zeitzone</p>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>Europe/Berlin</option>
                    <option>UTC</option>
                    <option>America/New_York</option>
                  </select>
                </div>
                <div>
                  <p className="font-medium mb-2">Währung</p>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>EUR (€)</option>
                    <option>USD ($)</option>
                    <option>GBP (£)</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2 text-yellow-600" />
                Benachrichtigungseinstellungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Kanäle</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium">E-Mail</p>
                        <p className="text-sm text-gray-600">Benachrichtigungen per E-Mail</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium">Push-Benachrichtigungen</p>
                        <p className="text-sm text-gray-600">Browser-Benachrichtigungen</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium">SMS</p>
                        <p className="text-sm text-gray-600">Kritische Benachrichtigungen per SMS</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.sms}
                      onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Kategorien</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'System-Warnungen', enabled: true },
                      { label: 'Neue Bewerbungen', enabled: true },
                      { label: 'Rechnungs-Updates', enabled: false },
                      { label: 'Logistik-Alerts', enabled: true },
                      { label: 'Performance-Reports', enabled: false }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">{item.label}</span>
                        <Switch defaultChecked={item.enabled} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-red-600" />
                  Authentifizierung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Zwei-Faktor-Authentifizierung</p>
                    <p className="text-sm text-gray-600">Zusätzliche Sicherheit bei der Anmeldung</p>
                  </div>
                  <Switch 
                    checked={security.twoFactor}
                    onCheckedChange={(checked) => setSecurity({...security, twoFactor: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Passwort-Ablauf</p>
                    <p className="text-sm text-gray-600">Passwörter nach 90 Tagen erneuern</p>
                  </div>
                  <Switch 
                    checked={security.passwordExpiry}
                    onCheckedChange={(checked) => setSecurity({...security, passwordExpiry: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Session-Timeout</p>
                    <p className="text-sm text-gray-600">Automatische Abmeldung nach Inaktivität</p>
                  </div>
                  <Switch 
                    checked={security.sessionTimeout}
                    onCheckedChange={(checked) => setSecurity({...security, sessionTimeout: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="w-5 h-5 mr-2 text-yellow-600" />
                  Zugriffskontrolle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">IP-Beschränkung</p>
                    <p className="text-sm text-gray-600">Zugriff nur von erlaubten IP-Adressen</p>
                  </div>
                  <Switch 
                    checked={security.ipRestriction}
                    onCheckedChange={(checked) => setSecurity({...security, ipRestriction: checked})}
                  />
                </div>
                <div>
                  <p className="font-medium mb-2">Erlaubte IP-Adressen</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-mono">192.168.1.0/24</span>
                      <Button variant="outline" size="sm">Entfernen</Button>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      IP-Adresse hinzufügen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2 text-blue-600" />
                  System-Verwaltung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Automatische Backups</p>
                    <p className="text-sm text-gray-600">Tägliche Datensicherung</p>
                  </div>
                  <Switch 
                    checked={system.autoBackup}
                    onCheckedChange={(checked) => setSystem({...system, autoBackup: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Wartungsmodus</p>
                    <p className="text-sm text-gray-600">System für Wartung sperren</p>
                  </div>
                  <Switch 
                    checked={system.maintenanceMode}
                    onCheckedChange={(checked) => setSystem({...system, maintenanceMode: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Debug-Modus</p>
                    <p className="text-sm text-gray-600">Erweiterte Protokollierung</p>
                  </div>
                  <Switch 
                    checked={system.debugMode}
                    onCheckedChange={(checked) => setSystem({...system, debugMode: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Archive className="w-5 h-5 mr-2 text-green-600" />
                  Daten-Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    System-Backup herunterladen
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Backup hochladen
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Archive className="w-4 h-4 mr-2" />
                    Logs exportieren
                  </Button>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-amber-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">Speicherplatz: 78% belegt</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-amber-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Benutzer-Verwaltung
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Aktive Benutzer</h3>
                    <p className="text-gray-600">Verwalten Sie Benutzerrollen und Berechtigungen</p>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Benutzer hinzufügen
                  </Button>
                </div>
                
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { role: 'Super Admin', count: 2, color: 'bg-red-100 text-red-700' },
                    { role: 'Admin', count: 8, color: 'bg-orange-100 text-orange-700' },
                    { role: 'Manager', count: 24, color: 'bg-blue-100 text-blue-700' },
                    { role: 'Employee', count: 1213, color: 'bg-green-100 text-green-700' }
                  ].map((item, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{item.role}</p>
                          <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                        </div>
                        <Badge className={item.color}>
                          {item.role}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2 text-indigo-600" />
                API & Integrationen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { name: 'Slack Integration', status: 'connected', color: 'text-green-600' },
                    { name: 'Microsoft Teams', status: 'disconnected', color: 'text-gray-400' },
                    { name: 'Salesforce CRM', status: 'connected', color: 'text-green-600' },
                    { name: 'SAP Integration', status: 'pending', color: 'text-yellow-600' }
                  ].map((integration, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-semibold">{integration.name}</p>
                        <p className={`text-sm ${integration.color}`}>
                          {integration.status === 'connected' ? 'Verbunden' : 
                           integration.status === 'pending' ? 'Ausstehend' : 'Nicht verbunden'}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        {integration.status === 'connected' ? 'Konfigurieren' : 'Verbinden'}
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold mb-4">API-Schlüssel</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Production API Key</p>
                        <p className="text-sm text-gray-600 font-mono">••••••••-••••-••••-••••-••••••••••••</p>
                      </div>
                      <Button variant="outline" size="sm">Regenerieren</Button>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Neuen API-Schlüssel erstellen
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button variant="outline">
          Zurücksetzen
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Änderungen speichern
        </Button>
      </div>
    </div>
  )
}
