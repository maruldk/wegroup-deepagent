
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Star,
  Filter,
  Clock
} from 'lucide-react'

interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  position: string
  startDate: string
  location: string
  status: 'active' | 'inactive' | 'pending'
  avatar: string
  rating: number
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [loading, setLoading] = useState(true)

  // Mock data
  const mockEmployees: Employee[] = [
    {
      id: '1',
      firstName: 'Anna',
      lastName: 'Schmidt',
      email: 'a.schmidt@wegroup.de',
      phone: '+49 123 456789',
      department: 'Engineering',
      position: 'Senior Developer',
      startDate: '2022-03-15',
      location: 'Berlin',
      status: 'active',
      avatar: 'AS',
      rating: 4.8
    },
    {
      id: '2',
      firstName: 'Marco',
      lastName: 'Weber',
      email: 'm.weber@wegroup.de',
      phone: '+49 123 456790',
      department: 'Logistics',
      position: 'Operations Manager',
      startDate: '2021-08-20',
      location: 'Hamburg',
      status: 'active',
      avatar: 'MW',
      rating: 4.6
    },
    {
      id: '3',
      firstName: 'Lisa',
      lastName: 'Müller',
      email: 'l.mueller@wegroup.de',
      phone: '+49 123 456791',
      department: 'Finance',
      position: 'Financial Analyst',
      startDate: '2023-01-10',
      location: 'München',
      status: 'active',
      avatar: 'LM',
      rating: 4.9
    },
    {
      id: '4',
      firstName: 'Thomas',
      lastName: 'Koch',
      email: 't.koch@wegroup.de',
      phone: '+49 123 456792',
      department: 'HR',
      position: 'HR Specialist',
      startDate: '2022-11-05',
      location: 'Frankfurt',
      status: 'pending',
      avatar: 'TK',
      rating: 4.5
    }
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setEmployees(mockEmployees)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment
    
    return matchesSearch && matchesDepartment
  })

  const departments = ['all', ...Array.from(new Set(employees.map(emp => emp.department)))]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'inactive': return 'bg-red-100 text-red-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Users className="w-8 h-8 text-blue-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Lade Mitarbeiterdaten...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mitarbeiter</h1>
          <p className="text-gray-600 mt-1">Verwalten Sie Ihr Team und Mitarbeiterinformationen</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Neuer Mitarbeiter
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gesamt</p>
                <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktiv</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.filter(emp => emp.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.filter(emp => emp.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(employees.reduce((acc, emp) => acc + emp.rating, 0) / employees.length).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Suche nach Name, E-Mail oder Abteilung..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'Alle Abteilungen' : dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle>Mitarbeiterliste ({filteredEmployees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {employee.avatar}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </h3>
                    <Badge className={getStatusColor(employee.status)}>
                      {employee.status}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{employee.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 mt-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>{employee.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>{employee.phone}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{employee.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>seit {new Date(employee.startDate).toLocaleDateString('de-DE')}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      {employee.department} • {employee.position}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Bearbeiten
                  </Button>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
