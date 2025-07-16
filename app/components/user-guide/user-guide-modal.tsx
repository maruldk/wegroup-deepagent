
"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  BookOpen, 
  Users, 
  Settings, 
  Workflow, 
  Shield, 
  Star, 
  ChevronRight, 
  Play, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Video,
  Bookmark,
  Clock,
  Lightbulb,
  Target,
  Zap,
  Brain,
  Globe,
  Rocket,
  Crown,
  Building,
  Factory,
  Truck,
  Calculator,
  User,
  Heart,
  Home,
  BarChart3,
  MessageSquare,
  HelpCircle,
  ArrowRight,
  BookMarked,
  Filter,
  X,
  UserPlus,
  Plus,
  ShieldCheck,
  Calendar,
  DollarSign,
  CreditCard,
  Wallet,
  UserCog,
  Lock,
  Database,
  Server,
  Scan,
  Package,
  Route,
  MapPin,
  Webhook
} from "lucide-react"

interface UserGuideModalProps {
  isOpen: boolean
  onClose: () => void
}

export interface GuideSection {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  content: React.ReactNode
  tags: string[]
  roles: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  prerequisites?: string[]
}

export function UserGuideModal({ isOpen, onClose }: UserGuideModalProps) {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [activeSection, setActiveSection] = useState<string>("overview")
  const [bookmarkedSections, setBookmarkedSections] = useState<string[]>([])
  const [completedSections, setCompletedSections] = useState<string[]>([])

  // Get user's current role
  const getUserRole = () => {
    if (!session?.user?.roles?.length) return "employee"
    return session.user.roles[0]?.name || "employee"
  }

  const userRole = getUserRole()

  // Load user preferences
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('userGuideBookmarks')
    const savedCompleted = localStorage.getItem('userGuideCompleted')
    
    if (savedBookmarks) {
      setBookmarkedSections(JSON.parse(savedBookmarks))
    }
    if (savedCompleted) {
      setCompletedSections(JSON.parse(savedCompleted))
    }
  }, [])

  // Save bookmarks and completed sections
  const toggleBookmark = (sectionId: string) => {
    const newBookmarks = bookmarkedSections.includes(sectionId)
      ? bookmarkedSections.filter(id => id !== sectionId)
      : [...bookmarkedSections, sectionId]
    
    setBookmarkedSections(newBookmarks)
    localStorage.setItem('userGuideBookmarks', JSON.stringify(newBookmarks))
  }

  const markAsCompleted = (sectionId: string) => {
    const newCompleted = [...completedSections, sectionId]
    setCompletedSections(newCompleted)
    localStorage.setItem('userGuideCompleted', JSON.stringify(newCompleted))
  }

  // Guide sections data
  const guideSections: GuideSection[] = [
    {
      id: "overview",
      title: "Platform Übersicht",
      description: "Erste Schritte und Grundlagen der WeGroup Platform",
      icon: Home,
      tags: ["basics", "getting-started", "overview"],
      roles: ["all"],
      difficulty: "beginner",
      estimatedTime: "5 Min",
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Willkommen bei WeGroup Platform v4.0</h3>
            <p className="text-blue-800 mb-4">
              Eine KI-gestützte Multi-Tenant-Plattform mit 85% Autonomie für HR, Finanzen, Logistik und mehr.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium mb-2">🚀 Kern-Features</h4>
                <ul className="text-sm space-y-1">
                  <li>• AI-gestützte Entscheidungsfindung</li>
                  <li>• Multi-Tenant-Architektur</li>
                  <li>• Rolle-basierte Berechtigungen</li>
                  <li>• Real-time Notifications</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium mb-2">📊 Module</h4>
                <ul className="text-sm space-y-1">
                  <li>• HR & Personalmanagement</li>
                  <li>• Finance & Accounting</li>
                  <li>• Logistics & Supply Chain</li>
                  <li>• AI Engine & Analytics</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Dashboard Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Nutzen Sie die Sidebar zur Navigation zwischen Modulen. Klicken Sie auf das WeGroup-Logo für das Hauptmenü.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Tenant-Wechsel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Wechseln Sie zwischen Mandanten über den Tenant-Selector im Header. Ihre Berechtigungen passen sich automatisch an.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Erhalten Sie Real-time Updates über das Glocken-Symbol. Wichtige Ereignisse werden sofort angezeigt.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: "roles-permissions",
      title: "Rollen & Berechtigungen",
      description: "Verstehen Sie das Berechtigungssystem der Platform",
      icon: Shield,
      tags: ["security", "permissions", "rbac", "roles"],
      roles: ["all"],
      difficulty: "intermediate",
      estimatedTime: "10 Min",
      content: (
        <div className="space-y-6">
          <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
            <h3 className="text-lg font-semibold text-amber-900 mb-3">Rolle-basierte Zugriffskontrolle (RBAC)</h3>
            <p className="text-amber-800 mb-4">
              Die WeGroup Platform verwendet ein hierarchisches Berechtigungssystem mit definierten Rollen und Zugriffsrechten.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-purple-600" />
                  Super Administrator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge variant="secondary">Vollzugriff</Badge>
                  <ul className="text-sm space-y-1">
                    <li>• Alle Mandanten verwalten</li>
                    <li>• System-Konfiguration</li>
                    <li>• Benutzer & Rollen verwalten</li>
                    <li>• Audit-Logs einsehen</li>
                    <li>• AI-Engine konfigurieren</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Tenant Administrator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge variant="secondary">Mandanten-Vollzugriff</Badge>
                  <ul className="text-sm space-y-1">
                    <li>• Mandanten-Einstellungen</li>
                    <li>• Benutzer im Mandanten verwalten</li>
                    <li>• Rollen zuweisen</li>
                    <li>• Reporting & Analytics</li>
                    <li>• Integration konfigurieren</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-gold-600" />
                  C-Level Executive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge variant="secondary">Executive Access</Badge>
                  <ul className="text-sm space-y-1">
                    <li>• Executive Dashboard</li>
                    <li>• Finanz-Reports</li>
                    <li>• Performance-Metriken</li>
                    <li>• Strategische Analysen</li>
                    <li>• Compliance-Reports</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Manager
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge variant="secondary">Team Management</Badge>
                  <ul className="text-sm space-y-1">
                    <li>• Team-Mitglieder verwalten</li>
                    <li>• Aufgaben zuweisen</li>
                    <li>• Performance tracking</li>
                    <li>• Genehmigungen erteilen</li>
                    <li>• Reporting erstellen</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-600" />
                  Employee
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge variant="secondary">Standard Access</Badge>
                  <ul className="text-sm space-y-1">
                    <li>• Eigene Aufgaben verwalten</li>
                    <li>• Spesen einreichen</li>
                    <li>• Urlaub beantragen</li>
                    <li>• Zeiterfassung</li>
                    <li>• Dokumentation lesen</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  Customer & Supplier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge variant="secondary">Portal Access</Badge>
                  <ul className="text-sm space-y-1">
                    <li>• Kundenportal (Customer)</li>
                    <li>• Lieferantenportal (Supplier)</li>
                    <li>• Aufträge verwalten</li>
                    <li>• Kommunikation</li>
                    <li>• Dokumentenaustausch</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: "dashboard-navigation",
      title: "Dashboard & Navigation",
      description: "Effiziente Navigation durch die Platform-Oberfläche",
      icon: BarChart3,
      tags: ["navigation", "dashboard", "ui", "interface"],
      roles: ["all"],
      difficulty: "beginner",
      estimatedTime: "7 Min",
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Dashboard-Navigation Meistern</h3>
            <p className="text-green-800">
              Die WeGroup Platform bietet eine intuitive Benutzeroberfläche mit intelligenter Navigation und personalisierten Dashboards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">🎯 Hauptnavigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Sidebar Navigation</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Klicken Sie auf Module in der Sidebar</li>
                    <li>• Nutzen Sie Unterkategorien für Details</li>
                    <li>• Sidebar ist kollapsible (← →)</li>
                    <li>• Badges zeigen neue Features an</li>
                  </ul>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Breadcrumb Navigation</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Zeigt aktuellen Pfad an</li>
                    <li>• Klickbare Pfad-Elemente</li>
                    <li>• Schnelle Navigation zurück</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">🔍 Suchfunktionen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Globale Suche</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Suchfeld im Header verwenden</li>
                    <li>• Suche über alle Module</li>
                    <li>• Intelligente Vorschläge</li>
                    <li>• Filtermöglichkeiten</li>
                  </ul>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Keyboard Shortcuts</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Ctrl+K: Globale Suche</li>
                    <li>• Ctrl+H: Hilfe öffnen</li>
                    <li>• Ctrl+S: Speichern</li>
                    <li>• Esc: Modals schließen</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Dashboard-Personalisierung</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium mb-2">Widget-Anpassung</h4>
                <p className="text-sm text-gray-600">
                  Ziehen Sie Widgets per Drag & Drop, um Ihr Dashboard zu personalisieren.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium mb-2">Favoriten</h4>
                <p className="text-sm text-gray-600">
                  Markieren Sie häufig verwendete Bereiche als Favoriten für schnellen Zugriff.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium mb-2">Benachrichtigungen</h4>
                <p className="text-sm text-gray-600">
                  Konfigurieren Sie Benachrichtigungen für wichtige Ereignisse und Updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "hr-workflows",
      title: "HR & Personalmanagement",
      description: "Komplette HR-Workflows und Personalverwaltung",
      icon: Users,
      tags: ["hr", "personnel", "workflows", "management"],
      roles: ["hr_manager", "manager", "tenant_admin", "super_admin"],
      difficulty: "intermediate",
      estimatedTime: "15 Min",
      content: (
        <div className="space-y-6">
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">HR-Workflows & Personalmanagement</h3>
            <p className="text-purple-800">
              Verwalten Sie Mitarbeiter, Bewerbungen, Performance und alle HR-Prozesse effizient mit KI-Unterstützung.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                  Mitarbeiterverwaltung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Schritt 1: Mitarbeiter anlegen</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Navigieren Sie zu HR → Employees</li>
                      <li>• Klicken Sie auf "Neuen Mitarbeiter hinzufügen"</li>
                      <li>• Füllen Sie alle erforderlichen Felder aus</li>
                      <li>• Weisen Sie Rollen und Berechtigungen zu</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Schritt 2: Dokumentation</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Verträge und Zeugnisse hochladen</li>
                      <li>• Personalakte digital verwalten</li>
                      <li>• Compliance-Dokumente tracken</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Performance Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Ziele setzen</h4>
                    <ul className="text-sm space-y-1">
                      <li>• SMART-Ziele definieren</li>
                      <li>• Quartalsziele verfolgen</li>
                      <li>• Team-Ziele vs. individuelle Ziele</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Bewertungen</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 360-Grad-Feedback</li>
                      <li>• Regelmäßige Check-ins</li>
                      <li>• Entwicklungspläne erstellen</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-purple-600" />
                  Recruiting & Bewerbungen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Stellenausschreibungen</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Job-Posting erstellen</li>
                      <li>• Anforderungsprofil definieren</li>
                      <li>• Multi-Channel-Veröffentlichung</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Bewerbermanagement</h4>
                    <ul className="text-sm space-y-1">
                      <li>• CV-Screening mit KI</li>
                      <li>• Interview-Planung</li>
                      <li>• Kandidaten-Pipeline</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  Zeiterfassung & Urlaub
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Arbeitszeiten</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Stechuhren-Integration</li>
                      <li>• Flexible Arbeitszeiten</li>
                      <li>• Overtime-Tracking</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Urlaubsmanagement</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Urlaubsanträge stellen</li>
                      <li>• Genehmigungsprozess</li>
                      <li>• Urlaubskalender</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3">💡 Best Practices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Onboarding-Checkliste</h4>
                <ul className="text-sm space-y-1">
                  <li>• Arbeitsplatz vorbereiten</li>
                  <li>• IT-Ausstattung bereitstellen</li>
                  <li>• Buddy-System einrichten</li>
                  <li>• Erste Woche strukturieren</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Compliance beachten</h4>
                <ul className="text-sm space-y-1">
                  <li>• DSGVO-konforme Datenspeicherung</li>
                  <li>• Arbeitsrecht einhalten</li>
                  <li>• Dokumentationspflichten</li>
                  <li>• Audit-Trails führen</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "finance-workflows",
      title: "Finance & Accounting",
      description: "Finanzprozesse, Rechnungsbearbeitung und Budgetierung",
      icon: Calculator,
      tags: ["finance", "accounting", "invoices", "budgets"],
      roles: ["finance_manager", "c_level", "tenant_admin", "super_admin"],
      difficulty: "intermediate",
      estimatedTime: "12 Min",
      content: (
        <div className="space-y-6">
          <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
            <h3 className="text-lg font-semibold text-emerald-900 mb-3">Finance & Accounting Workflows</h3>
            <p className="text-emerald-800">
              Automatisieren Sie Finanzprozesse mit KI-gestützter Rechnungsbearbeitung, Budgetierung und Compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Rechnungsbearbeitung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">1. Rechnung hochladen</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Drag & Drop in den Upload-Bereich</li>
                      <li>• OCR-Texterkennung automatisch</li>
                      <li>• Datenvalidierung durch KI</li>
                      <li>• Dublikate automatisch erkennen</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">2. Three-Way-Matching</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Rechnung vs. Bestellung</li>
                      <li>• Wareneingangsprüfung</li>
                      <li>• Automatische Freigabe bei Match</li>
                      <li>• Abweichungen markieren</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Genehmigungsprozess
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Approval Workflow</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Automatische Zuweisungen</li>
                      <li>• Genehmigungslimits beachten</li>
                      <li>• Eskalation bei Verzögerung</li>
                      <li>• Mobile Genehmigung möglich</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Compliance</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 4-Augen-Prinzip</li>
                      <li>• Audit-Trail vollständig</li>
                      <li>• Archivierung automatisch</li>
                      <li>• Reporting für Prüfer</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  Budgetierung & Forecasting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Budget erstellen</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Kostenstellen definieren</li>
                      <li>• Perioden-Budgets festlegen</li>
                      <li>• Forecasting mit KI</li>
                      <li>• Varianzen tracken</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Cash Flow Management</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Liquiditätsplanung</li>
                      <li>• Zahlungsfristen überwachen</li>
                      <li>• Mahnwesen automatisieren</li>
                      <li>• Kreditlimits verwalten</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                  Reporting & Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Standard-Reports</h4>
                    <ul className="text-sm space-y-1">
                      <li>• GuV (P&L) monatlich</li>
                      <li>• Bilanz quartalsweise</li>
                      <li>• Cash Flow Statement</li>
                      <li>• Kostenstellen-Berichte</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">KI-gestützte Analysen</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Anomalie-Erkennung</li>
                      <li>• Trend-Analysen</li>
                      <li>• Predictive Analytics</li>
                      <li>• Benchmark-Vergleiche</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">🔧 Konfiguration & Setup</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">E-Mail-Integration</h4>
                <ul className="text-sm space-y-1">
                  <li>• IMAP/SMTP konfigurieren</li>
                  <li>• Automatische Rechnungsextraktion</li>
                  <li>• Spam-Filter einrichten</li>
                  <li>• Weiterleitung konfigurieren</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Buchhaltungsintegration</h4>
                <ul className="text-sm space-y-1">
                  <li>• DATEV-Schnittstelle</li>
                  <li>• SAP-Connector</li>
                  <li>• Kontenpläne importieren</li>
                  <li>• Automatische Buchungen</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "logistics-workflows",
      title: "Logistics & Supply Chain",
      description: "3PL-Management, Lagerverwaltung und Transportprozesse",
      icon: Truck,
      tags: ["logistics", "supply-chain", "3pl", "warehouse"],
      roles: ["logistics_manager", "manager", "tenant_admin", "super_admin"],
      difficulty: "advanced",
      estimatedTime: "18 Min",
      content: (
        <div className="space-y-6">
          <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
            <h3 className="text-lg font-semibold text-indigo-900 mb-3">Logistics & Supply Chain Management</h3>
            <p className="text-indigo-800">
              Optimieren Sie Ihre Lieferkette mit KI-gestützten 3PL-Prozessen, intelligentem Routing und Real-time Tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Lagerverwaltung (WMS)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Wareneingang</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Lieferungen scannen und erfassen</li>
                      <li>• Qualitätskontrolle durchführen</li>
                      <li>• Lagerplätze automatisch zuweisen</li>
                      <li>• Bestandsführung aktualisieren</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Picking & Packing</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Optimierte Picker-Routen</li>
                      <li>• Batch-Picking für Effizienz</li>
                      <li>• Verpackungsoptimierung</li>
                      <li>• Versandlabel automatisch generieren</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5 text-green-600" />
                  Intelligentes Routing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">KI-Routenoptimierung</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Verkehr und Wetter berücksichtigen</li>
                      <li>• Kostenoptimierung vs. Zeitoptimierung</li>
                      <li>• Multi-Stop-Routen planen</li>
                      <li>• Carrier-Auswahl automatisieren</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Multi-Carrier-Management</h4>
                    <ul className="text-sm space-y-1">
                      <li>• DHL, UPS, FedEx integrieren</li>
                      <li>• Preisvergleiche in Echtzeit</li>
                      <li>• SLA-Monitoring</li>
                      <li>• Performance-Bewertungen</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  Real-time Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Sendungsverfolgung</h4>
                    <ul className="text-sm space-y-1">
                      <li>• GPS-Tracking für alle Sendungen</li>
                      <li>• Milestone-Updates automatisch</li>
                      <li>• Verspätungen proaktiv melden</li>
                      <li>• Kundenbenachrichtigungen</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Predictive Analytics</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Lieferzeitprognosen</li>
                      <li>• Kapazitätsplanung</li>
                      <li>• Demand Forecasting</li>
                      <li>• Risiko-Assessment</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Factory className="h-5 w-5 text-orange-600" />
                  Supplier Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Lieferantenbewertung</h4>
                    <ul className="text-sm space-y-1">
                      <li>• KPIs definieren und messen</li>
                      <li>• Automatische Scorecards</li>
                      <li>• Compliance-Monitoring</li>
                      <li>• Verbesserungsvorschläge</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">RFQ-Prozess</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Anfragen automatisch versenden</li>
                      <li>• Angebote digital sammeln</li>
                      <li>• Preisvergleiche durchführen</li>
                      <li>• Verhandlungen dokumentieren</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
            <h3 className="text-lg font-semibold text-teal-900 mb-3">🚀 Erweiterte Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium mb-2">IoT-Integration</h4>
                <ul className="text-sm space-y-1">
                  <li>• RFID-Tracking</li>
                  <li>• Temperatursensoren</li>
                  <li>• Vibrations-Monitoring</li>
                  <li>• Diebstahlschutz</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium mb-2">Blockchain-Verifizierung</h4>
                <ul className="text-sm space-y-1">
                  <li>• Fälschungssicherheit</li>
                  <li>• Herkunftsnachweis</li>
                  <li>• Smart Contracts</li>
                  <li>• Transparenz in der Lieferkette</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium mb-2">Nachhaltigkeit</h4>
                <ul className="text-sm space-y-1">
                  <li>• CO2-Footprint-Tracking</li>
                  <li>• Öko-Routing</li>
                  <li>• Verpackungsoptimierung</li>
                  <li>• Circular Economy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "ai-engine-workflows",
      title: "AI Engine & Automation",
      description: "KI-gestützte Automatisierung und intelligente Entscheidungsfindung",
      icon: Brain,
      tags: ["ai", "automation", "machine-learning", "intelligence"],
      roles: ["ai_engineer", "super_admin", "tenant_admin"],
      difficulty: "advanced",
      estimatedTime: "20 Min",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">AI Engine & Intelligent Automation</h3>
            <p className="text-blue-800">
              Nutzen Sie die Kraft der KI für automatisierte Entscheidungen, Prozessoptimierung und predictive Analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Model Discovery & Registry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">KI-Modelle finden</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Hugging Face Integration</li>
                      <li>• OpenAI API-Zugang</li>
                      <li>• Custom Model Training</li>
                      <li>• Model Performance Monitoring</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Model Registry</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Versionskontrolle für Modelle</li>
                      <li>• A/B-Testing durchführen</li>
                      <li>• Deployment-Automatisierung</li>
                      <li>• Rollback-Strategien</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5 text-green-600" />
                  Intelligent Workflow Engine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Process Automation</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Workflow-Designer verwenden</li>
                      <li>• Trigger und Conditions setzen</li>
                      <li>• Human-in-the-Loop integrieren</li>
                      <li>• Exception Handling</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Decision Engine</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Business Rules definieren</li>
                      <li>• KI-Empfehlungen integrieren</li>
                      <li>• Confidence Scoring</li>
                      <li>• Audit-Trail erstellen</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Predictive Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Forecasting Models</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Demand Forecasting</li>
                      <li>• Sales Predictions</li>
                      <li>• Resource Planning</li>
                      <li>• Risk Assessment</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Anomaly Detection</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Outlier-Erkennung</li>
                      <li>• Fraud Detection</li>
                      <li>• Quality Monitoring</li>
                      <li>• Alert-Systeme</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-orange-600" />
                  AI-Recommendation Engine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Personalisierung</h4>
                    <ul className="text-sm space-y-1">
                      <li>• User Behavior Analysis</li>
                      <li>• Content Recommendations</li>
                      <li>• Personalized Dashboards</li>
                      <li>• Adaptive Interfaces</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Business Intelligence</h4>
                    <ul className="text-sm space-y-1">
                      <li>• KPI-Optimierung</li>
                      <li>• Process Improvement</li>
                      <li>• Resource Allocation</li>
                      <li>• Strategic Planning</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">🤖 Advanced AI Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium mb-2">Natural Language Processing</h4>
                <ul className="text-sm space-y-1">
                  <li>• Document Analysis</li>
                  <li>• Sentiment Analysis</li>
                  <li>• Automatic Summarization</li>
                  <li>• Language Translation</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium mb-2">Computer Vision</h4>
                <ul className="text-sm space-y-1">
                  <li>• Document OCR</li>
                  <li>• Quality Inspection</li>
                  <li>• Barcode Reading</li>
                  <li>• Defect Detection</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium mb-2">Auto-ML Pipeline</h4>
                <ul className="text-sm space-y-1">
                  <li>• Automated Feature Engineering</li>
                  <li>• Model Selection</li>
                  <li>• Hyperparameter Tuning</li>
                  <li>• Continuous Learning</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium mb-2">Explainable AI</h4>
                <ul className="text-sm space-y-1">
                  <li>• Decision Explanations</li>
                  <li>• Feature Importance</li>
                  <li>• Bias Detection</li>
                  <li>• Compliance Reporting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "portal-systems",
      title: "Portal-Systeme (Customer & Supplier)",
      description: "Kunden- und Lieferantenportale für externen Zugriff",
      icon: Globe,
      tags: ["portals", "customer", "supplier", "external"],
      roles: ["portal_admin", "customer", "supplier", "tenant_admin"],
      difficulty: "intermediate",
      estimatedTime: "10 Min",
      content: (
        <div className="space-y-6">
          <div className="bg-cyan-50 p-6 rounded-lg border border-cyan-200">
            <h3 className="text-lg font-semibold text-cyan-900 mb-3">Portal-Systeme für externe Partner</h3>
            <p className="text-cyan-800">
              Ermöglichen Sie Kunden und Lieferanten direkten Zugriff auf relevante Informationen und Prozesse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-600" />
                  Kundenportal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Demo-Login: Anna Schmidt</h4>
                    <ul className="text-sm space-y-1">
                      <li>• E-Mail: anna.schmidt@customer.com</li>
                      <li>• Passwort: customer123</li>
                      <li>• Rolle: Customer</li>
                      <li>• Automatische Weiterleitung zu /customer-portal</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Verfügbare Funktionen</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Bestellungen verfolgen</li>
                      <li>• Angebote anfordern</li>
                      <li>• Service-Requests erstellen</li>
                      <li>• Dokumenten-Download</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Factory className="h-5 w-5 text-blue-600" />
                  Lieferantenportal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Demo-Login: Thomas Müller</h4>
                    <ul className="text-sm space-y-1">
                      <li>• E-Mail: thomas.mueller@supplier.com</li>
                      <li>• Passwort: supplier123</li>
                      <li>• Rolle: Supplier</li>
                      <li>• Automatische Weiterleitung zu /supplier-portal</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Verfügbare Funktionen</h4>
                    <ul className="text-sm space-y-1">
                      <li>• RFQ-Antworten</li>
                      <li>• Bestellungen bearbeiten</li>
                      <li>• Performance-Metriken</li>
                      <li>• Compliance-Uploads</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  Kommunikation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Nachrichten-System</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Sichere Kommunikation</li>
                      <li>• Dateianhänge möglich</li>
                      <li>• Automatische Benachrichtigungen</li>
                      <li>• Verlauf und Archivierung</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Support & Ticketing</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Ticket-System integriert</li>
                      <li>• Prioritäten setzen</li>
                      <li>• Status-Tracking</li>
                      <li>• Eskalation möglich</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-purple-600" />
                  Sicherheit & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Zugriffskontrolle</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Rolle-basierte Berechtigungen</li>
                      <li>• Single Sign-On (SSO)</li>
                      <li>• Multi-Faktor-Authentifizierung</li>
                      <li>• Session-Management</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Datenschschutz</h4>
                    <ul className="text-sm space-y-1">
                      <li>• DSGVO-konform</li>
                      <li>• Verschlüsselte Übertragung</li>
                      <li>• Audit-Logs</li>
                      <li>• Datenminimierung</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-3">📋 Portal-Setup & Konfiguration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Portal-Aktivierung</h4>
                <ol className="text-sm space-y-1">
                  <li>1. Navigieren Sie zu Einstellungen → Portal</li>
                  <li>2. Wählen Sie Kunden- oder Lieferantenportal</li>
                  <li>3. Aktivieren Sie die gewünschten Module</li>
                  <li>4. Konfigurieren Sie Branding und Design</li>
                  <li>5. Testen Sie die Funktionen</li>
                </ol>
              </div>
              <div>
                <h4 className="font-medium mb-2">Benutzer-Onboarding</h4>
                <ol className="text-sm space-y-1">
                  <li>1. Externe Benutzer einladen</li>
                  <li>2. Rollen und Berechtigungen zuweisen</li>
                  <li>3. Willkommens-E-Mail versenden</li>
                  <li>4. Schulungs-Materialien bereitstellen</li>
                  <li>5. Support-Kontakte definieren</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "integrations-apis",
      title: "Integrationen & APIs",
      description: "Systemintegrationen und API-Management",
      icon: Webhook,
      tags: ["api", "integration", "webhook", "automation"],
      roles: ["developer", "system_admin", "tenant_admin"],
      difficulty: "advanced",
      estimatedTime: "25 Min",
      content: (
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">System-Integrationen & API-Management</h3>
            <p className="text-slate-800">
              Verbinden Sie die WeGroup Platform mit externen Systemen über REST-APIs, Webhooks und vorgefertigte Connectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Webhook className="h-5 w-5 text-blue-600" />
                  API Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">API-Dokumentation</h4>
                    <ul className="text-sm space-y-1">
                      <li>• OpenAPI 3.0 Spezifikation</li>
                      <li>• Interaktive Swagger UI</li>
                      <li>• Code-Beispiele verfügbar</li>
                      <li>• Postman-Collections</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Authentifizierung</h4>
                    <ul className="text-sm space-y-1">
                      <li>• API-Keys verwalten</li>
                      <li>• OAuth 2.0 Support</li>
                      <li>• JWT-Token verwenden</li>
                      <li>• Rate Limiting aktivieren</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-green-600" />
                  Datenintegration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">ETL-Prozesse</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Datenextraktion konfigurieren</li>
                      <li>• Transformation-Rules definieren</li>
                      <li>• Automatische Datenaktualisierung</li>
                      <li>• Fehlerbehandlung und Logging</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Datenmapping</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Feld-Zuordnungen definieren</li>
                      <li>• Datentyp-Konvertierung</li>
                      <li>• Validierungsregeln</li>
                      <li>• Konfliktlösung</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-purple-600" />
                  Vorgefertigte Connectors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">ERP-Systeme</h4>
                    <ul className="text-sm space-y-1">
                      <li>• SAP ECC/S4 HANA</li>
                      <li>• Microsoft Dynamics 365</li>
                      <li>• Oracle NetSuite</li>
                      <li>• Sage Business Cloud</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">E-Commerce</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Shopify Integration</li>
                      <li>• WooCommerce Sync</li>
                      <li>• Magento Connector</li>
                      <li>• Amazon Marketplace</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  Monitoring & Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">System-Monitoring</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Integration Health Checks</li>
                      <li>• Performance Metrics</li>
                      <li>• Uptime Monitoring</li>
                      <li>• Error Rate Tracking</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Benachrichtigungen</h4>
                    <ul className="text-sm space-y-1">
                      <li>• E-Mail-Alerts konfigurieren</li>
                      <li>• Slack-Notifications</li>
                      <li>• Teams-Integration</li>
                      <li>• PagerDuty-Support</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
            <h3 className="text-lg font-semibold text-amber-900 mb-3">🔧 Integration Setup Guide</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium mb-2">1. Connector wählen</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Wählen Sie einen vorgefertigten Connector oder erstellen Sie eine Custom Integration.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Neue Integration
                  </Button>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium mb-2">2. Konfiguration</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Authentifizierung einrichten und Datenmapping konfigurieren.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Konfigurieren
                  </Button>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium mb-2">3. Testing & Deployment</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Testen Sie die Integration gründlich, bevor Sie sie in Produktion nehmen.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Play className="h-4 w-4 mr-2" />
                    Test Run
                  </Button>
                  <Button size="sm" variant="default">
                    <Rocket className="h-4 w-4 mr-2" />
                    Deploy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ]

  // Filter sections based on search and filters
  const filteredSections = guideSections.filter(section => {
    const matchesSearch = searchTerm === "" || 
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesRole = selectedRole === "all" || 
      section.roles.includes("all") || 
      section.roles.includes(selectedRole) ||
      section.roles.includes(userRole)
    
    const matchesDifficulty = selectedDifficulty === "all" || 
      section.difficulty === selectedDifficulty
    
    return matchesSearch && matchesRole && matchesDifficulty
  })

  const currentSection = guideSections.find(s => s.id === activeSection)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            WeGroup Platform User Guide v1.0
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-full">
          {/* Sidebar Navigation */}
          <div className="w-80 border-r border-gray-200 bg-gray-50">
            <div className="p-4 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Suche in Guide..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Filter</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="text-xs border rounded px-2 py-1"
                  >
                    <option value="all">Alle Rollen</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="tenant_admin">Tenant Admin</option>
                    <option value="c_level">C-Level</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                    <option value="customer">Customer</option>
                    <option value="supplier">Supplier</option>
                  </select>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="text-xs border rounded px-2 py-1"
                  >
                    <option value="all">Alle Level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <ScrollArea className="h-full px-4 pb-4">
              <div className="space-y-2">
                {filteredSections.map((section) => (
                  <div
                    key={section.id}
                    className={`cursor-pointer p-3 rounded-lg border transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <div className="flex items-start gap-3">
                      <section.icon className={`h-5 w-5 mt-0.5 ${
                        activeSection === section.id ? 'text-blue-600' : 'text-gray-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium mb-1">{section.title}</h4>
                        <p className="text-xs text-gray-600 mb-2">{section.description}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {section.difficulty}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {section.estimatedTime}
                          </div>
                          <div className="flex items-center gap-1">
                            {bookmarkedSections.includes(section.id) && (
                              <BookMarked className="h-3 w-3 text-blue-600" />
                            )}
                            {completedSections.includes(section.id) && (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {currentSection && (
              <>
                {/* Content Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <currentSection.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold mb-2">{currentSection.title}</h2>
                        <p className="text-gray-600 mb-4">{currentSection.description}</p>
                        <div className="flex items-center gap-4 flex-wrap">
                          <Badge variant="secondary">{currentSection.difficulty}</Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            {currentSection.estimatedTime}
                          </div>
                          <div className="flex items-center gap-1">
                            {currentSection.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBookmark(currentSection.id)}
                      >
                        <Bookmark className={`h-4 w-4 ${
                          bookmarkedSections.includes(currentSection.id) 
                            ? 'text-blue-600 fill-current' 
                            : 'text-gray-400'
                        }`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsCompleted(currentSection.id)}
                        disabled={completedSections.includes(currentSection.id)}
                      >
                        <CheckCircle className={`h-4 w-4 ${
                          completedSections.includes(currentSection.id) 
                            ? 'text-green-600' 
                            : 'text-gray-400'
                        }`} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Content Body */}
                <ScrollArea className="flex-1 p-6">
                  {currentSection.content}
                </ScrollArea>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
