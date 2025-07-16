
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Users, UserPlus, Shield, Key, Search, Filter, Crown, Settings, Mail, Phone, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  department: string
  position: string
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  lastLogin: string
  joinDate: string
  avatar?: string
  roles: Role[]
  permissions: string[]
  tenantId: string
  tenantName: string
  isVerified: boolean
  twoFactorEnabled: boolean
}

interface Role {
  id: string
  name: string
  description: string
  level: 'user' | 'admin' | 'super_admin'
  permissions: Permission[]
  tenantId?: string
}

interface Permission {
  id: string
  name: string
  description: string
  resource: string
  action: string
  scope: 'read' | 'write' | 'delete' | 'admin'
}

interface Tenant {
  id: string
  name: string
  domain: string
  userCount: number
  isActive: boolean
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedTenant, setSelectedTenant] = useState("all")
  const [selectedRole, setSelectedRole] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsersData()
  }, [])

  const loadUsersData = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setUsers([
        {
          id: "1",
          firstName: "Dr. Sarah",
          lastName: "Weber",
          email: "sarah.weber@wegroup.com",
          phone: "+49 30 123456",
          department: "Management",
          position: "CEO",
          status: "active",
          lastLogin: "2024-01-15T09:30:00",
          joinDate: "2021-01-01",
          avatar: "https://i.pinimg.com/originals/46/89/e5/4689e549611d93a14c9d4db8bb2e186c.png",
          roles: [
            { id: "1", name: "Super Administrator", description: "Full system access", level: "super_admin", permissions: [] }
          ],
          permissions: ["all:*"],
          tenantId: "all",
          tenantName: "All Tenants",
          isVerified: true,
          twoFactorEnabled: true
        },
        {
          id: "2",
          firstName: "Thomas",
          lastName: "Fischer",
          email: "thomas.fischer@wegroup.com",
          phone: "+49 89 987654",
          department: "Sales",
          position: "Sales Director",
          status: "active",
          lastLogin: "2024-01-15T08:45:00",
          joinDate: "2022-03-15",
          avatar: "https://i.pinimg.com/originals/21/76/78/217678f7eb0ebcae251430dda3529ff0.jpg",
          roles: [
            { id: "2", name: "Sales Admin", description: "Sales module administration", level: "admin", permissions: [] }
          ],
          permissions: ["sales:read", "sales:write", "sales:admin"],
          tenantId: "tenant1",
          tenantName: "WeGroup Internal",
          isVerified: true,
          twoFactorEnabled: false
        },
        {
          id: "3",
          firstName: "Anna",
          lastName: "Schmidt",
          email: "anna.schmidt@wegroup.com",
          phone: "+49 40 555123",
          department: "Design",
          position: "UX Designer",
          status: "active",
          lastLogin: "2024-01-14T16:20:00",
          joinDate: "2022-06-01",
          avatar: "https://i.pinimg.com/originals/ce/b9/0e/ceb90ede494f606101ef2c5cce7df57a.jpg",
          roles: [
            { id: "3", name: "Content Creator", description: "Content creation and management", level: "user", permissions: [] }
          ],
          permissions: ["wecreate:read", "wecreate:write"],
          tenantId: "tenant1",
          tenantName: "WeGroup Internal",
          isVerified: true,
          twoFactorEnabled: true
        },
        {
          id: "4",
          firstName: "Michael",
          lastName: "Weber",
          email: "michael.weber@client.com",
          phone: "+49 69 777888",
          department: "IT",
          position: "IT Manager",
          status: "pending",
          lastLogin: "2024-01-12T14:10:00",
          joinDate: "2024-01-10",
          avatar: "https://i.pinimg.com/originals/bc/73/54/bc73543e1700c51cf7f4fbd929dde49a.jpg",
          roles: [
            { id: "4", name: "User", description: "Basic user access", level: "user", permissions: [] }
          ],
          permissions: ["hr:read", "finance:read"],
          tenantId: "tenant2",
          tenantName: "Client Corp",
          isVerified: false,
          twoFactorEnabled: false
        },
        {
          id: "5",
          firstName: "Lisa",
          lastName: "Müller",
          email: "lisa.mueller@partner.com",
          phone: "+49 711 444555",
          department: "HR",
          position: "HR Specialist",
          status: "suspended",
          lastLogin: "2024-01-08T11:30:00",
          joinDate: "2023-09-15",
          avatar: "https://i.pinimg.com/736x/58/6b/97/586b970ea96eee2b0eb7e39020094898.jpg",
          roles: [
            { id: "5", name: "HR User", description: "HR module access", level: "user", permissions: [] }
          ],
          permissions: ["hr:read", "hr:write"],
          tenantId: "tenant3",
          tenantName: "Partner Solutions",
          isVerified: true,
          twoFactorEnabled: false
        }
      ])

      setRoles([
        {
          id: "1",
          name: "Super Administrator",
          description: "Vollzugriff auf alle Systeme und Mandanten",
          level: "super_admin",
          permissions: []
        },
        {
          id: "2",
          name: "Tenant Administrator",
          description: "Vollzugriff innerhalb des eigenen Mandanten",
          level: "admin",
          permissions: []
        },
        {
          id: "3",
          name: "Sales Manager",
          description: "Verwaltung des Sales-Moduls",
          level: "admin",
          permissions: []
        },
        {
          id: "4",
          name: "HR Manager",
          description: "Verwaltung des HR-Moduls",
          level: "admin",
          permissions: []
        },
        {
          id: "5",
          name: "Content Creator",
          description: "Erstellung und Verwaltung von Inhalten",
          level: "user",
          permissions: []
        },
        {
          id: "6",
          name: "Viewer",
          description: "Nur Lesezugriff auf zugewiesene Module",
          level: "user",
          permissions: []
        }
      ])

      setTenants([
        { id: "all", name: "All Tenants", domain: "wegroup.com", userCount: 1, isActive: true },
        { id: "tenant1", name: "WeGroup Internal", domain: "internal.wegroup.com", userCount: 45, isActive: true },
        { id: "tenant2", name: "Client Corp", domain: "client.wegroup.com", userCount: 23, isActive: true },
        { id: "tenant3", name: "Partner Solutions", domain: "partner.wegroup.com", userCount: 12, isActive: true }
      ])

      setLoading(false)
    }, 1000)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      inactive: "secondary",
      pending: "outline",
      suspended: "destructive"
    } as const
    
    const labels = {
      active: "Aktiv",
      inactive: "Inaktiv",
      pending: "Ausstehend",
      suspended: "Gesperrt"
    }
    
    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const getRoleIcon = (level: string) => {
    switch (level) {
      case 'super_admin': return <Crown className="w-4 h-4 text-purple-500" />
      case 'admin': return <Shield className="w-4 h-4 text-blue-500" />
      case 'user': return <Users className="w-4 h-4 text-green-500" />
      default: return <Users className="w-4 h-4 text-gray-500" />
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus
    const matchesTenant = selectedTenant === "all" || user.tenantId === selectedTenant
    const matchesRole = selectedRole === "all" || user.roles.some(role => role.id === selectedRole)
    return matchesSearch && matchesStatus && matchesTenant && matchesRole
  })

  const totalUsers = users.length
  const activeUsers = users.filter(u => u.status === 'active').length
  const pendingUsers = users.filter(u => u.status === 'pending').length
  const verifiedUsers = users.filter(u => u.isVerified).length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Benutzerverwaltung</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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
          <h1 className="text-3xl font-bold text-gray-900">Benutzerverwaltung</h1>
          <p className="text-gray-600 mt-1">Verwaltung von Benutzern, Rollen und Berechtigungen</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Exportieren
          </Button>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Neuer Benutzer
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gesamt Benutzer</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                <p className="text-xs text-green-600">+3 diese Woche</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktive Benutzer</p>
                <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
                <p className="text-xs text-gray-500">{Math.round((activeUsers/totalUsers)*100)}% der Basis</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ausstehend</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingUsers}</p>
                <p className="text-xs text-yellow-600">Bestätigung nötig</p>
              </div>
              <Key className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verifiziert</p>
                <p className="text-2xl font-bold text-purple-600">{verifiedUsers}</p>
                <p className="text-xs text-purple-600">{Math.round((verifiedUsers/totalUsers)*100)}% verifiziert</p>
              </div>
              <Crown className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Actions Alert */}
      {pendingUsers > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Key className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>{pendingUsers} Benutzer benötigen Aufmerksamkeit!</strong> Bestätigungen oder Aktivierungen ausstehend.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Benutzer</TabsTrigger>
          <TabsTrigger value="roles">Rollen</TabsTrigger>
          <TabsTrigger value="tenants">Mandanten</TabsTrigger>
          <TabsTrigger value="permissions">Berechtigungen</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Benutzer durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="active">Aktiv</SelectItem>
                <SelectItem value="pending">Ausstehend</SelectItem>
                <SelectItem value="suspended">Gesperrt</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTenant} onValueChange={setSelectedTenant}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Mandant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Mandanten</SelectItem>
                {tenants.map(tenant => (
                  <SelectItem key={tenant.id} value={tenant.id}>{tenant.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Rolle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Rollen</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                        <AvatarFallback>
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                          </h3>
                          {getStatusBadge(user.status)}
                          {user.roles.map((role) => (
                            <div key={role.id} className="flex items-center space-x-1">
                              {getRoleIcon(role.level)}
                              <Badge variant="outline" className="text-xs">{role.name}</Badge>
                            </div>
                          ))}
                        </div>
                        <p className="text-gray-600 mb-2">{user.position} - {user.department}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Mail className="w-3 h-3" />
                            <span>{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="w-3 h-3" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Seit {new Date(user.joinDate).toLocaleDateString('de-DE')}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Mandant: {user.tenantName}</span>
                          <span>Letzter Login: {new Date(user.lastLogin).toLocaleString('de-DE')}</span>
                          {user.isVerified && <Badge variant="outline" className="text-xs">✓ Verifiziert</Badge>}
                          {user.twoFactorEnabled && <Badge variant="outline" className="text-xs">🔐 2FA</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-1" />
                        Bearbeiten
                      </Button>
                      <Button size="sm">
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <div className="grid gap-4">
            {roles.map((role) => (
              <Card key={role.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getRoleIcon(role.level)}
                      <div>
                        <h3 className="font-semibold text-gray-900">{role.name}</h3>
                        <p className="text-sm text-gray-600">{role.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={role.level === 'super_admin' ? 'default' : role.level === 'admin' ? 'secondary' : 'outline'}>
                            {role.level === 'super_admin' ? 'Super Admin' : role.level === 'admin' ? 'Administrator' : 'Benutzer'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {users.filter(u => u.roles.some(r => r.id === role.id)).length} Benutzer
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Berechtigungen
                      </Button>
                      <Button size="sm">
                        Bearbeiten
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-4">
          <div className="grid gap-4">
            {tenants.map((tenant) => (
              <Card key={tenant.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{tenant.name}</h3>
                        <p className="text-sm text-gray-600">{tenant.domain}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={tenant.isActive ? 'default' : 'secondary'}>
                            {tenant.isActive ? 'Aktiv' : 'Inaktiv'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {tenant.userCount} Benutzer
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Benutzer verwalten
                      </Button>
                      <Button size="sm">
                        Einstellungen
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Berechtigungsmatrix</CardTitle>
              <CardDescription>
                Übersicht über alle verfügbaren Systemberechtigungen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['WeCreate', 'WeSell', 'HR', 'Finance', 'Logistics', 'Settings'].map((module) => (
                  <div key={module} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">{module}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {['Lesen', 'Schreiben', 'Löschen', 'Administrator'].map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Switch defaultChecked={permission === 'Lesen'} />
                          <span className="text-sm text-gray-700">{permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
