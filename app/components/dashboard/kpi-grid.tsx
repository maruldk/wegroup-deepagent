
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  Euro,
  Truck,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface KPICardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ComponentType<{ className?: string }>
  color: "blue" | "green" | "purple" | "orange"
}

function KPICard({ title, value, change, trend, icon: Icon, color }: KPICardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200"
  }

  const iconColors = {
    blue: "text-blue-600",
    green: "text-green-600", 
    purple: "text-purple-600",
    orange: "text-orange-600"
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-lg", colorClasses[color])}>
          <Icon className={cn("h-4 w-4", iconColors[color])} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="flex items-center text-xs text-gray-600 mt-1">
          {trend === "up" ? (
            <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
          ) : (
            <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
          )}
          <span className={trend === "up" ? "text-green-600" : "text-red-600"}>
            {change}
          </span>
          <span className="ml-1">vs. letzter Monat</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function KPIGrid() {
  const kpis = [
    {
      title: "Aktive Mitarbeiter",
      value: "1,247",
      change: "+12.5%",
      trend: "up" as const,
      icon: Users,
      color: "blue" as const
    },
    {
      title: "Sendungen heute",
      value: "2,845",
      change: "+8.3%", 
      trend: "up" as const,
      icon: Package,
      color: "green" as const
    },
    {
      title: "Umsatz (Monat)",
      value: "€3.2M",
      change: "+15.7%",
      trend: "up" as const,
      icon: Euro,
      color: "purple" as const
    },
    {
      title: "Durchschnittliche Lieferzeit",
      value: "2.3 Tage",
      change: "-0.5%",
      trend: "up" as const,
      icon: Truck,
      color: "orange" as const
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => (
        <KPICard key={index} {...kpi} />
      ))}
    </div>
  )
}
