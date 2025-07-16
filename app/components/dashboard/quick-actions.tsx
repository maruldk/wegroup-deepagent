
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Plus, 
  Upload, 
  Download, 
  MessageSquare, 
  Users, 
  Package,
  FileText,
  Settings
} from "lucide-react"

interface QuickActionProps {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  onClick?: () => void
  variant?: "default" | "outline" | "secondary"
}

function QuickAction({ title, description, icon: Icon, href, onClick, variant = "outline" }: QuickActionProps) {
  return (
    <Button
      variant={variant}
      className="h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-shadow"
      onClick={onClick}
      asChild={!!href}
    >
      {href ? (
        <a href={href}>
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5" />
            <span className="font-medium">{title}</span>
          </div>
          <span className="text-sm text-gray-600 text-left">{description}</span>
        </a>
      ) : (
        <>
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5" />
            <span className="font-medium">{title}</span>
          </div>
          <span className="text-sm text-gray-600 text-left">{description}</span>
        </>
      )}
    </Button>
  )
}

export function QuickActions() {
  const actions = [
    {
      title: "Neuen Mitarbeiter hinzufügen",
      description: "Schnell neue Teammitglieder onboarden",
      icon: Users,
      href: "/hr/employees/new"
    },
    {
      title: "Sendung verfolgen",
      description: "Live-Tracking für aktuelle Lieferungen",
      icon: Package,
      href: "/logistics/tracking"
    },
    {
      title: "Finanzbericht generieren",
      description: "Aktuelle Finanzanalysen erstellen",
      icon: FileText,
      href: "/finance/reports"
    },
    {
      title: "Daten importieren",
      description: "Bulk-Import von CSV/Excel-Dateien",
      icon: Upload,
      onClick: () => alert("Import-Funktion wird geöffnet...")
    },
    {
      title: "AI Chat starten",
      description: "Unterstützung durch WeGroup AI",
      icon: MessageSquare,
      href: "/ai",
      variant: "default" as const
    },
    {
      title: "System konfigurieren",
      description: "Platform-Einstellungen anpassen",
      icon: Settings,
      href: "/settings"
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Schnellaktionen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action, index) => (
            <QuickAction key={index} {...action} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
