
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Server, Database, Shield, HardDrive, Cpu, Wifi, AlertTriangle, CheckCircle, Activity, Zap, Download, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SystemMetric {
  id: string
  name: string
  value: number
  unit: string
  status: 'good' | 'warning' | 'critical'
  threshold: number
  description: string
}

interface BackupInfo {
  id: string
  type: 'full' | 'incremental' | 'differential'
  size: string
  date: string
  status: 'completed' | 'running' | 'failed'
  location: string
}

interface SecuritySetting {
  id: string
  name: string
  description: string
  enabled: boolean
  level: 'basic' | 'advanced' | 'enterprise'
  category: 'authentication' | 'encryption' | 'monitoring' | 'compliance'
}

interface SystemUpdate {
  id: string
  component: string
  version: string
  newVersion: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  size: string
  releaseDate: string
}

export default function SystemPage() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([])
  const [backups, setBackups] = useState<BackupInfo[]>([])
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([])
  const [updates, setUpdates] = useState<SystemUpdate[]>([])
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSystemData()
  }, [])

  const loadSystemData = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setMetrics([
        {
          id: "1",
          name: "CPU Auslastung",
          value: 23,
          unit: "%",
          status: "good",
          threshold: 80,
          description: "Durchschnittliche Prozessorauslastung"
        },
        {
          id: "2",
          name: "RAM Verbrauch",
          value: 67,
          unit: "%",
          status: "warning",
          threshold: 85,
          description: "Arbeitsspeicher-Nutzung"
        },
        {
          id: "3",
          name: "Festplatte",
          value: 34,
          unit: "%",
          status: "good",
          threshold: 90,
          description: "Speicherplatz-Verbrauch"
        },
        {
          id: "4",
          name: "Netzwerk I/O",
          value: 45,
          unit: "MB/s",
          status: "good",
          threshold: 100,
          description: "Netzwerk-Durchsatz"
        },
        {
          id: "5",
          name: "Datenbankgröße",
          value: 2.8,
          unit: "GB",
          status: "good",
          threshold: 10,
          description: "Gesamtgröße der Datenbank"
        },
        {
          id: "6",
          name: "Aktive Sessions",
          value: 247,
          unit: "Sessions",
          status: "good",
          threshold: 1000,
          description: "Gleichzeitige Benutzersitzungen"
        }
      ])

      setBackups([
        {
          id: "1",
          type: "full",
          size: "2.8 GB",
          date: "2024-01-15T02:00:00",
          status: "completed",
          location: "AWS S3"
        },
        {
          id: "2",
          type: "incremental",
          size: "145 MB",
          date: "2024-01-15T14:00:00",
          status: "completed",
          location: "AWS S3"
        },
        {
          id: "3",
          type: "incremental",
          size: "89 MB",
          date: "2024-01-15T20:00:00",
          status: "running",
          location: "AWS S3"
        }
      ])

      setSecuritySettings([
        {
          id: "1",
          name: "Zwei-Faktor-Authentifizierung",
          description: "Zusätzliche Sicherheitsebene für alle Benutzerkonten",
          enabled: true,
          level: "enterprise",
          category: "authentication"
        },
        {
          id: "2",
          name: "Ende-zu-Ende-Verschlüsselung",
          description: "Vollständige Datenverschlüsselung in Transit und at Rest",
          enabled: true,
          level: "enterprise",
          category: "encryption"
        },
        {
          id: "3",
          name: "Anomalie-Erkennung",
          description: "KI-gestützte Erkennung ungewöhnlicher Aktivitäten",
          enabled: true,
          level: "advanced",
          category: "monitoring"
        },
        {
          id: "4",
          name: "GDPR Compliance",
          description: "Automatische DSGVO-Konformitätsprüfungen",
          enabled: true,
          level: "enterprise",
          category: "compliance"
        },
        {
          id: "5",
          name: "Brute-Force-Schutz",
          description: "Schutz vor automatisierten Anmeldungsversuchen",
          enabled: true,
          level: "basic",
          category: "authentication"
        },
        {
          id: "6",
          name: "Audit Logging",
          description: "Umfassende Protokollierung aller Systemaktivitäten",
          enabled: true,
          level: "enterprise",
          category: "monitoring"
        }
      ])

      setUpdates([
        {
          id: "1",
          component: "WeGroup Core System",
          version: "2.4.1",
          newVersion: "2.5.0",
          description: "Neue KI-Features und Performance-Verbesserungen",
          priority: "high",
          size: "145 MB",
          releaseDate: "2024-01-10"
        },
        {
          id: "2",
          component: "Security Framework",
          version: "1.8.3",
          newVersion: "1.9.0",
          description: "Kritische Sicherheitsupdates und neue Verschlüsselungsalgorithmen",
          priority: "critical",
          size: "67 MB",
          releaseDate: "2024-01-12"
        },
        {
          id: "3",
          component: "Database Engine",
          version: "14.2",
          newVersion: "14.3",
          description: "Performance-Optimierungen und Bug-Fixes",
          priority: "medium",
          size: "234 MB",
          releaseDate: "2024-01-08"
        }
      ])

      setLoading(false)
    }, 1000)
  }

  const getMetricStatus = (metric: SystemMetric) => {
    if (metric.status === 'critical') return 'text-red-600'
    if (metric.status === 'warning') return 'text-yellow-600'
    return 'text-green-600'
  }

  const getBackupStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'running': return <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-500" />
      default: return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: "outline",
      medium: "secondary",
      high: "default",
      critical: "destructive"
    } as const
    
    const labels = {
      low: "Niedrig",
      medium: "Mittel",
      high: "Hoch",
      critical: "Kritisch"
    }
    
    return <Badge variant={variants[priority as keyof typeof variants]}>{labels[priority as keyof typeof labels]}</Badge>
  }

  const criticalUpdates = updates.filter(u => u.priority === 'critical').length
  const systemHealth = Math.round(metrics.filter(m => m.status === 'good').length / metrics.length * 100)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">System-Einstellungen</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System-Einstellungen</h1>
          <p className="text-gray-600 mt-1">Überwachung und Konfiguration der Systeminfrastruktur</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="maintenance-mode">Wartungsmodus</Label>
            <Switch
              id="maintenance-mode"
              checked={maintenanceMode}
              onCheckedChange={setMaintenanceMode}
            />
          </div>
          <Badge variant={systemHealth > 90 ? "default" : systemHealth > 70 ? "secondary" : "destructive"}>
            System: {systemHealth}%
          </Badge>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalUpdates > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Kritische Updates verfügbar!</strong> {criticalUpdates} sicherheitskritische Updates warten auf Installation.
          </AlertDescription>
        </Alert>
      )}

      {maintenanceMode && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Wartungsmodus aktiv!</strong> Das System ist für Benutzer nur eingeschränkt verfügbar.
          </AlertDescription>
        </Alert>
      )}

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">{metric.name}</span>
                {metric.name.includes('CPU') && <Cpu className="w-4 h-4 text-blue-500" />}
                {metric.name.includes('RAM') && <Server className="w-4 h-4 text-purple-500" />}
                {metric.name.includes('Festplatte') && <HardDrive className="w-4 h-4 text-green-500" />}
                {metric.name.includes('Netzwerk') && <Wifi className="w-4 h-4 text-orange-500" />}
                {metric.name.includes('Datenbank') && <Database className="w-4 h-4 text-red-500" />}
                {metric.name.includes('Sessions') && <Activity className="w-4 h-4 text-indigo-500" />}
              </div>
              <div className={`text-2xl font-bold ${getMetricStatus(metric)}`}>
                {metric.value}{metric.unit}
              </div>
              <p className="text-xs text-gray-500 mb-2">{metric.description}</p>
              <Progress 
                value={metric.unit === '%' ? metric.value : (metric.value / metric.threshold) * 100} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>{metric.unit === '%' ? '100%' : `${metric.threshold}${metric.unit}`}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Sicherheit</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>System Performance</span>
                </CardTitle>
                <CardDescription>Aktuelle Systemleistung und Ressourcenverbrauch</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800">Gesamtsystem-Status</span>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-900 mt-1">{systemHealth}%</div>
                    <p className="text-sm text-green-700">Alle kritischen Systeme funktional</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-gray-900">99.97%</div>
                      <div className="text-sm text-gray-600">Verfügbarkeit</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-gray-900">1.2ms</div>
                      <div className="text-sm text-gray-600">Ø Antwortzeit</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimierungsempfehlungen</CardTitle>
                <CardDescription>KI-gestützte Performance-Optimierungen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Zap className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900">RAM-Optimierung</div>
                      <p className="text-sm text-blue-700">Speicher-Caching kann um 15% verbessert werden</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Database className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-purple-900">Datenbank-Tuning</div>
                      <p className="text-sm text-purple-700">Index-Optimierung empfohlen für bessere Query-Performance</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <Activity className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-900">Auto-Scaling</div>
                      <p className="text-sm text-green-700">Automatische Ressourcenskalierung ist optimal konfiguriert</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-4">
            {securitySettings.map((setting) => (
              <Card key={setting.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-6 h-6 text-blue-500" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{setting.name}</h3>
                        <p className="text-sm text-gray-600">{setting.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={setting.level === 'enterprise' ? 'default' : setting.level === 'advanced' ? 'secondary' : 'outline'}>
                            {setting.level === 'enterprise' ? 'Enterprise' : setting.level === 'advanced' ? 'Erweitert' : 'Basis'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {setting.category === 'authentication' && '🔐 Authentifizierung'}
                            {setting.category === 'encryption' && '🔒 Verschlüsselung'}
                            {setting.category === 'monitoring' && '👁️ Überwachung'}
                            {setting.category === 'compliance' && '📋 Compliance'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={setting.enabled}
                      onCheckedChange={(checked) => {
                        setSecuritySettings(prev => 
                          prev.map(s => s.id === setting.id ? {...s, enabled: checked} : s)
                        )
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="backups" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Backup-Konfiguration</CardTitle>
                <CardDescription>Automatische Datensicherung und Wiederherstellung</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Backup-Intervall</Label>
                    <Input value="6 Stunden" readOnly />
                  </div>
                  <div>
                    <Label>Aufbewahrungszeit</Label>
                    <Input value="30 Tage" readOnly />
                  </div>
                </div>
                
                <div>
                  <Label>Backup-Speicherort</Label>
                  <Input value="AWS S3 - eu-central-1" readOnly />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Verschlüsselung</Label>
                    <p className="text-sm text-gray-600">AES-256 Ende-zu-Ende</p>
                  </div>
                  <Badge variant="default">Aktiv</Badge>
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Backup erstellen
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Upload className="w-4 h-4 mr-2" />
                    Wiederherstellen
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Backup-Verlauf</CardTitle>
                <CardDescription>Letzte Sicherungen und Status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {backups.map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getBackupStatusIcon(backup.status)}
                        <div>
                          <div className="font-medium text-sm">
                            {backup.type === 'full' ? 'Vollsicherung' : 
                             backup.type === 'incremental' ? 'Inkrementell' : 'Differenziell'}
                          </div>
                          <div className="text-xs text-gray-600">
                            {new Date(backup.date).toLocaleString('de-DE')} • {backup.size}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={backup.status === 'completed' ? 'default' : backup.status === 'running' ? 'secondary' : 'destructive'}>
                          {backup.status === 'completed' ? 'Abgeschlossen' : 
                           backup.status === 'running' ? 'Läuft' : 'Fehlgeschlagen'}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">{backup.location}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="updates" className="space-y-4">
          <div className="grid gap-4">
            {updates.map((update) => (
              <Card key={update.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{update.component}</h3>
                        {getPriorityBadge(update.priority)}
                      </div>
                      <p className="text-gray-600 mb-3">{update.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Aktuelle Version: </span>
                          <span className="font-medium">{update.version}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Neue Version: </span>
                          <span className="font-medium">{update.newVersion}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Größe: </span>
                          <span className="font-medium">{update.size}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Veröffentlicht: </span>
                          <span className="font-medium">{new Date(update.releaseDate).toLocaleDateString('de-DE')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                      <Button size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Installieren
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
