
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Mail, 
  Phone,
  Calendar,
  AlertTriangle,
  TrendingUp,
  User
} from 'lucide-react'

interface Employee {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  department?: string
  position?: string
  positionTitle?: string
  employmentStatus: string
  hireDate?: string
  salary?: number
  predictedChurnRisk?: number
  performanceScore?: number
  manager?: {
    id: string
    firstName: string
    lastName: string
  }
  _count?: {
    subordinates: number
  }
}

const statusLabels: { [key: string]: string } = {
  'ACTIVE': 'Aktiv',
  'INACTIVE': 'Inaktiv',
  'ON_LEAVE': 'Urlaub',
  'TERMINATED': 'Beendet',
  'RETIRED': 'Rente'
}

const statusColors: { [key: string]: string } = {
  'ACTIVE': 'bg-green-100 text-green-800',
  'INACTIVE': 'bg-gray-100 text-gray-800',
  'ON_LEAVE': 'bg-yellow-100 text-yellow-800',
  'TERMINATED': 'bg-red-100 text-red-800',
  'RETIRED': 'bg-blue-100 text-blue-800'
}

export function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchEmployees()
  }, [page, departmentFilter, statusFilter])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })
      
      if (departmentFilter) params.append('department', departmentFilter)
      if (statusFilter) params.append('status', statusFilter)

      const response = await fetch(`/api/hr/employees?${params}`)
      if (response.ok) {
        const data = await response.json()
        setEmployees(data.employees)
        setTotal(data.pagination.total)
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEmployees = employees.filter(employee => {
    if (!searchTerm) return true
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase()
    return fullName.includes(searchTerm.toLowerCase()) ||
           employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const getChurnRiskBadge = (risk?: number) => {
    if (!risk) return null
    
    if (risk >= 0.7) {
      return (
        <Badge variant="destructive" className="text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Hoch
        </Badge>
      )
    } else if (risk >= 0.4) {
      return (
        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
          Mittel
        </Badge>
      )
    } else {
      return (
        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
          Niedrig
        </Badge>
      )
    }
  }

  const getPerformanceColor = (score?: number) => {
    if (!score) return 'text-gray-500'
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Mitarbeiter Verwaltung</span>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Neuer Mitarbeiter
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Suche nach Name, E-Mail oder ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Abteilung" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Abteilungen</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Sales">Vertrieb</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="HR">Personal</SelectItem>
                <SelectItem value="Finance">Finanzen</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="ACTIVE">Aktiv</SelectItem>
                <SelectItem value="INACTIVE">Inaktiv</SelectItem>
                <SelectItem value="ON_LEAVE">Urlaub</SelectItem>
                <SelectItem value="TERMINATED">Beendet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Employee List */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Lade Mitarbeiter...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEmployees.map((employee) => (
                <Card key={employee.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${employee.firstName}+${employee.lastName}`} />
                        <AvatarFallback>
                          {employee.firstName[0]}{employee.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold truncate">
                            {employee.firstName} {employee.lastName}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {employee.employeeId}
                          </Badge>
                          <Badge className={statusColors[employee.employmentStatus] || 'bg-gray-100 text-gray-800'}>
                            {statusLabels[employee.employmentStatus] || employee.employmentStatus}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{employee.email}</span>
                          </div>
                          
                          {employee.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{employee.phone}</span>
                            </div>
                          )}
                          
                          {employee.department && (
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{employee.department}</span>
                            </div>
                          )}
                          
                          {employee.hireDate && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Seit {new Date(employee.hireDate).toLocaleDateString('de-DE')}</span>
                            </div>
                          )}
                        </div>
                        
                        {employee.position && (
                          <p className="text-sm text-gray-800 mt-1 font-medium">
                            {employee.position}
                          </p>
                        )}
                      </div>
                      
                      {/* KI Metrics */}
                      <div className="flex flex-col items-end space-y-2 min-w-32">
                        {employee.performanceScore !== null && employee.performanceScore !== undefined && (
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-3 w-3 text-gray-400" />
                            <span className={`text-sm font-medium ${getPerformanceColor(employee.performanceScore)}`}>
                              {employee.performanceScore.toFixed(0)}%
                            </span>
                          </div>
                        )}
                        
                        {employee.predictedChurnRisk !== null && employee.predictedChurnRisk !== undefined && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Fluktuation:</span>
                            {getChurnRiskBadge(employee.predictedChurnRisk)}
                          </div>
                        )}
                        
                        {employee._count && employee._count.subordinates > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {employee._count.subordinates} Teams
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredEmployees.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Keine Mitarbeiter gefunden</p>
                </div>
              )}
              
              {/* Pagination */}
              {total > 10 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-gray-600">
                    Zeige {Math.min(page * 10, total)} von {total} Mitarbeitern
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Zurück
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p + 1)}
                      disabled={page * 10 >= total}
                    >
                      Weiter
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
