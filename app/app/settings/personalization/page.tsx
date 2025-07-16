
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Palette, Monitor, Bell, Globe, Zap, Save, RefreshCw, Upload, Sun, Moon, Laptop } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PersonalizationSettings {
  theme: {
    mode: 'light' | 'dark' | 'system'
    primaryColor: string
    accentColor: string
    fontSize: number
    compactMode: boolean
  }
  dashboard: {
    layout: 'grid' | 'list' | 'cards'
    widgets: string[]
    refreshInterval: number
    showAnimations: boolean
  }
  notifications: {
    email: boolean
    push: boolean
    desktop: boolean
    frequency: 'immediate' | 'hourly' | 'daily' | 'weekly'
    channels: string[]
  }
  language: {
    locale: string
    timezone: string
    dateFormat: string
    numberFormat: string
  }
  ai: {
    assistantEnabled: boolean
    suggestionLevel: number
    autoOptimization: boolean
    learningMode: boolean
  }
}

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  position: string
  bio: string
  avatar?: string
  location: string
  website?: string
}

export default function PersonalizationPage() {
  const [settings, setSettings] = useState<PersonalizationSettings>({
    theme: {
      mode: 'light',
      primaryColor: '#3B82F6',
      accentColor: '#10B981',
      fontSize: 14,
      compactMode: false
    },
    dashboard: {
      layout: 'grid',
      widgets: ['sales', 'hr', 'analytics', 'notifications'],
      refreshInterval: 30,
      showAnimations: true
    },
    notifications: {
      email: true,
      push: true,
      desktop: false,
      frequency: 'immediate',
      channels: ['system', 'sales', 'hr']
    },
    language: {
      locale: 'de-DE',
      timezone: 'Europe/Berlin',
      dateFormat: 'DD.MM.YYYY',
      numberFormat: 'DE'
    },
    ai: {
      assistantEnabled: true,
      suggestionLevel: 75,
      autoOptimization: true,
      learningMode: true
    }
  })

  const [profile, setProfile] = useState<UserProfile>({
    firstName: 'Dr. Sarah',
    lastName: 'Weber',
    email: 'sarah.weber@wegroup.com',
    phone: '+49 30 123456789',
    department: 'Management',
    position: 'CEO',
    bio: 'Erfahrene Führungskraft mit Fokus auf digitale Transformation und Innovation.',
    avatar: "https://i.pinimg.com/originals/e8/b1/f5/e8b1f506358e0a4c56e27eb50b2196c6.png",
    location: 'Berlin, Deutschland',
    website: 'https://linkedin.com/in/sarah-weber'
  })

  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const updateSettings = (section: keyof PersonalizationSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
    setHasChanges(true)
  }

  const updateProfile = (key: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [key]: value
    }))
    setHasChanges(true)
  }

  const saveSettings = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setHasChanges(false)
      // Show success message
    }, 1000)
  }

  const resetToDefaults = () => {
    setSettings({
      theme: {
        mode: 'light',
        primaryColor: '#3B82F6',
        accentColor: '#10B981',
        fontSize: 14,
        compactMode: false
      },
      dashboard: {
        layout: 'grid',
        widgets: ['sales', 'hr', 'analytics', 'notifications'],
        refreshInterval: 30,
        showAnimations: true
      },
      notifications: {
        email: true,
        push: true,
        desktop: false,
        frequency: 'immediate',
        channels: ['system', 'sales', 'hr']
      },
      language: {
        locale: 'de-DE',
        timezone: 'Europe/Berlin',
        dateFormat: 'DD.MM.YYYY',
        numberFormat: 'DE'
      },
      ai: {
        assistantEnabled: true,
        suggestionLevel: 75,
        autoOptimization: true,
        learningMode: true
      }
    })
    setHasChanges(true)
  }

  const availableWidgets = [
    { id: 'sales', name: 'Sales Dashboard', description: 'Umsätze und Deal-Pipeline' },
    { id: 'hr', name: 'HR Metrics', description: 'Personalanalytics und Recruiting' },
    { id: 'finance', name: 'Finance Overview', description: 'Finanzielle Kennzahlen' },
    { id: 'logistics', name: 'Logistics Status', description: 'Lager und Versand' },
    { id: 'analytics', name: 'Analytics Hub', description: 'Datenanalyse und KPIs' },
    { id: 'notifications', name: 'Benachrichtigungen', description: 'Aktuelle Meldungen' },
    { id: 'calendar', name: 'Kalender', description: 'Termine und Events' },
    { id: 'tasks', name: 'Aufgaben', description: 'To-Do Liste und Projekte' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Personalisierung</h1>
          <p className="text-gray-600 mt-1">Anpassung der Benutzeroberfläche und Einstellungen</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={resetToDefaults}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Zurücksetzen
          </Button>
          <Button onClick={saveSettings} disabled={!hasChanges || isLoading}>
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Speichern...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Speichern
              </>
            )}
          </Button>
        </div>
      </div>

      {hasChanges && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-800">
                Sie haben ungespeicherte Änderungen. Klicken Sie auf "Speichern", um sie zu übernehmen.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="theme">Design</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
          <TabsTrigger value="language">Sprache & Region</TabsTrigger>
          <TabsTrigger value="ai">KI-Einstellungen</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Persönliche Informationen</CardTitle>
                <CardDescription>Ihre Kontakt- und Profilinformationen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profile.avatar} alt={`${profile.firstName} ${profile.lastName}`} />
                    <AvatarFallback>
                      {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Foto ändern
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG max. 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Vorname</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => updateProfile('firstName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nachname</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => updateProfile('lastName', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">E-Mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => updateProfile('email', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => updateProfile('phone', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Abteilung</Label>
                    <Input
                      id="department"
                      value={profile.department}
                      onChange={(e) => updateProfile('department', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={profile.position}
                      onChange={(e) => updateProfile('position', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => updateProfile('bio', e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="location">Standort</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => updateProfile('location', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website/LinkedIn</Label>
                  <Input
                    id="website"
                    value={profile.website || ''}
                    onChange={(e) => updateProfile('website', e.target.value)}
                    placeholder="https://"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sicherheitseinstellungen</CardTitle>
                <CardDescription>Kontosicherheit und Authentifizierung</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Zwei-Faktor-Authentifizierung</Label>
                    <p className="text-sm text-gray-600">Zusätzlicher Schutz für Ihr Konto</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Anmelde-Benachrichtigungen</Label>
                    <p className="text-sm text-gray-600">E-Mail bei neuen Anmeldungen</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Passwort ändern
                  </Button>
                  <Button variant="outline" className="w-full">
                    Anmeldungsprotokoll anzeigen
                  </Button>
                  <Button variant="outline" className="w-full">
                    Aktive Sitzungen verwalten
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="theme" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5" />
                  <span>Erscheinungsbild</span>
                </CardTitle>
                <CardDescription>Anpassung von Farben und Darstellung</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Theme-Modus</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <Button
                      variant={settings.theme.mode === 'light' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateSettings('theme', 'mode', 'light')}
                    >
                      <Sun className="w-4 h-4 mr-2" />
                      Hell
                    </Button>
                    <Button
                      variant={settings.theme.mode === 'dark' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateSettings('theme', 'mode', 'dark')}
                    >
                      <Moon className="w-4 h-4 mr-2" />
                      Dunkel
                    </Button>
                    <Button
                      variant={settings.theme.mode === 'system' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateSettings('theme', 'mode', 'system')}
                    >
                      <Laptop className="w-4 h-4 mr-2" />
                      System
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Primärfarbe</Label>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'].map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-lg border-2 ${
                          settings.theme.primaryColor === color ? 'border-gray-900' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => updateSettings('theme', 'primaryColor', color)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Akzentfarbe</Label>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#3B82F6'].map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-lg border-2 ${
                          settings.theme.accentColor === color ? 'border-gray-900' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => updateSettings('theme', 'accentColor', color)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Schriftgröße: {settings.theme.fontSize}px</Label>
                  <Slider
                    value={[settings.theme.fontSize]}
                    onValueChange={([value]) => updateSettings('theme', 'fontSize', value)}
                    min={12}
                    max={18}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Kompakt-Modus</Label>
                    <p className="text-sm text-gray-600">Reduzierte Abstände und Größen</p>
                  </div>
                  <Switch
                    checked={settings.theme.compactMode}
                    onCheckedChange={(checked) => updateSettings('theme', 'compactMode', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vorschau</CardTitle>
                <CardDescription>So sieht Ihr Theme aus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 space-y-3" style={{ fontSize: `${settings.theme.fontSize}px` }}>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: settings.theme.primaryColor }}
                    />
                    <span className="font-medium">WeGroup Dashboard</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="border rounded p-2">
                      <div className="text-sm text-gray-600">Umsatz</div>
                      <div className="font-bold">€125,450</div>
                    </div>
                    <div className="border rounded p-2">
                      <div className="text-sm text-gray-600">Deals</div>
                      <div className="font-bold">34</div>
                    </div>
                  </div>
                  <button
                    className="w-full text-white rounded p-2"
                    style={{ backgroundColor: settings.theme.accentColor }}
                  >
                    Beispiel Button
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="w-5 h-5" />
                <span>Dashboard Layout</span>
              </CardTitle>
              <CardDescription>Anpassung der Dashboard-Ansicht und Widgets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Layout-Stil</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button
                    variant={settings.dashboard.layout === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSettings('dashboard', 'layout', 'grid')}
                  >
                    Raster
                  </Button>
                  <Button
                    variant={settings.dashboard.layout === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSettings('dashboard', 'layout', 'list')}
                  >
                    Liste
                  </Button>
                  <Button
                    variant={settings.dashboard.layout === 'cards' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSettings('dashboard', 'layout', 'cards')}
                  >
                    Karten
                  </Button>
                </div>
              </div>

              <div>
                <Label>Aktualisierungsintervall: {settings.dashboard.refreshInterval} Sekunden</Label>
                <Slider
                  value={[settings.dashboard.refreshInterval]}
                  onValueChange={([value]) => updateSettings('dashboard', 'refreshInterval', value)}
                  min={10}
                  max={300}
                  step={10}
                  className="mt-2"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Animationen anzeigen</Label>
                  <p className="text-sm text-gray-600">Übergangseffekte und Animationen</p>
                </div>
                <Switch
                  checked={settings.dashboard.showAnimations}
                  onCheckedChange={(checked) => updateSettings('dashboard', 'showAnimations', checked)}
                />
              </div>

              <div>
                <Label>Dashboard Widgets</Label>
                <p className="text-sm text-gray-600 mb-3">Wählen Sie die Widgets für Ihr Dashboard aus</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableWidgets.map((widget) => (
                    <div key={widget.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Switch
                        checked={settings.dashboard.widgets.includes(widget.id)}
                        onCheckedChange={(checked) => {
                          const widgets = checked
                            ? [...settings.dashboard.widgets, widget.id]
                            : settings.dashboard.widgets.filter(w => w !== widget.id)
                          updateSettings('dashboard', 'widgets', widgets)
                        }}
                      />
                      <div>
                        <div className="font-medium text-sm">{widget.name}</div>
                        <div className="text-xs text-gray-600">{widget.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Benachrichtigungen</span>
              </CardTitle>
              <CardDescription>Konfiguration von Benachrichtigungen und Alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>E-Mail Benachrichtigungen</Label>
                    <p className="text-sm text-gray-600">Wichtige Updates per E-Mail</p>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => updateSettings('notifications', 'email', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Benachrichtigungen</Label>
                    <p className="text-sm text-gray-600">Browser-Benachrichtigungen</p>
                  </div>
                  <Switch
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => updateSettings('notifications', 'push', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Desktop Benachrichtigungen</Label>
                    <p className="text-sm text-gray-600">System-Benachrichtigungen</p>
                  </div>
                  <Switch
                    checked={settings.notifications.desktop}
                    onCheckedChange={(checked) => updateSettings('notifications', 'desktop', checked)}
                  />
                </div>

                <div>
                  <Label>Benachrichtigungsfrequenz</Label>
                  <Select
                    value={settings.notifications.frequency}
                    onValueChange={(value) => updateSettings('notifications', 'frequency', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Sofort</SelectItem>
                      <SelectItem value="hourly">Stündlich</SelectItem>
                      <SelectItem value="daily">Täglich</SelectItem>
                      <SelectItem value="weekly">Wöchentlich</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Benachrichtigungs-Kanäle</Label>
                  <p className="text-sm text-gray-600 mb-3">Wählen Sie die Module für Benachrichtigungen</p>
                  <div className="space-y-2">
                    {['system', 'sales', 'hr', 'finance', 'logistics'].map((channel) => (
                      <div key={channel} className="flex items-center space-x-2">
                        <Switch
                          checked={settings.notifications.channels.includes(channel)}
                          onCheckedChange={(checked) => {
                            const channels = checked
                              ? [...settings.notifications.channels, channel]
                              : settings.notifications.channels.filter(c => c !== channel)
                            updateSettings('notifications', 'channels', channels)
                          }}
                        />
                        <Label className="capitalize">{channel}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="language" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Sprache & Region</span>
              </CardTitle>
              <CardDescription>Lokalisierung und regionale Einstellungen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Sprache</Label>
                  <Select
                    value={settings.language.locale}
                    onValueChange={(value) => updateSettings('language', 'locale', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="de-DE">Deutsch (Deutschland)</SelectItem>
                      <SelectItem value="en-US">English (United States)</SelectItem>
                      <SelectItem value="en-GB">English (United Kingdom)</SelectItem>
                      <SelectItem value="fr-FR">Français (France)</SelectItem>
                      <SelectItem value="es-ES">Español (España)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Zeitzone</Label>
                  <Select
                    value={settings.language.timezone}
                    onValueChange={(value) => updateSettings('language', 'timezone', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Berlin">Europa/Berlin (CET)</SelectItem>
                      <SelectItem value="Europe/London">Europa/London (GMT)</SelectItem>
                      <SelectItem value="America/New_York">Amerika/New York (EST)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asien/Tokio (JST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Datumsformat</Label>
                  <Select
                    value={settings.language.dateFormat}
                    onValueChange={(value) => updateSettings('language', 'dateFormat', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD.MM.YYYY">DD.MM.YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Zahlenformat</Label>
                  <Select
                    value={settings.language.numberFormat}
                    onValueChange={(value) => updateSettings('language', 'numberFormat', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DE">1.234,56 (Deutschland)</SelectItem>
                      <SelectItem value="US">1,234.56 (USA)</SelectItem>
                      <SelectItem value="FR">1 234,56 (Frankreich)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>KI-Einstellungen</span>
              </CardTitle>
              <CardDescription>Konfiguration der KI-gestützten Features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>KI-Assistent aktivieren</Label>
                  <p className="text-sm text-gray-600">Intelligente Unterstützung und Vorschläge</p>
                </div>
                <Switch
                  checked={settings.ai.assistantEnabled}
                  onCheckedChange={(checked) => updateSettings('ai', 'assistantEnabled', checked)}
                />
              </div>

              <div>
                <Label>Vorschlagslevel: {settings.ai.suggestionLevel}%</Label>
                <p className="text-sm text-gray-600 mb-2">Häufigkeit der KI-Vorschläge</p>
                <Slider
                  value={[settings.ai.suggestionLevel]}
                  onValueChange={([value]) => updateSettings('ai', 'suggestionLevel', value)}
                  min={0}
                  max={100}
                  step={5}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Automatische Optimierung</Label>
                  <p className="text-sm text-gray-600">KI optimiert automatisch Workflows</p>
                </div>
                <Switch
                  checked={settings.ai.autoOptimization}
                  onCheckedChange={(checked) => updateSettings('ai', 'autoOptimization', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Lernmodus</Label>
                  <p className="text-sm text-gray-600">KI lernt aus Ihren Präferenzen</p>
                </div>
                <Switch
                  checked={settings.ai.learningMode}
                  onCheckedChange={(checked) => updateSettings('ai', 'learningMode', checked)}
                />
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">KI-Datenschutz</h4>
                <p className="text-sm text-purple-800">
                  Ihre Daten werden sicher verarbeitet und ausschließlich zur Verbesserung 
                  Ihrer Benutzererfahrung verwendet. Alle KI-Modelle werden lokal trainiert.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
