
import { EnhancedRoleManagementDashboard } from '@/components/user-management/enhanced-role-management-dashboard'

export const dynamic = "force-dynamic"

export default function RolesPermissionsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rollen & Berechtigungen</h2>
          <p className="text-muted-foreground">
            Verwalten Sie hierarchische Rollen und Berechtigungen mit KI-gestützten Einblicken
          </p>
        </div>
      </div>
      <EnhancedRoleManagementDashboard />
    </div>
  )
}
