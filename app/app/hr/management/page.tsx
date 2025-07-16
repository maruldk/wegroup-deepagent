
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, UserPlus, Calendar, Clock, TrendingUp, AlertTriangle, CheckCircle, Search, Filter } from "lucide-react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Cell } from "recharts"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  department: string
  position: string
  startDate: string
  status: 'active' | 'onLeave' | 'terminated'
  performanceScore: number
  avatar?: string
}

interface Department {
  id: string
  name: string
  headCount: number
  budget: number
  avgSalary: number
  openPositions: number
}

interface PerformanceMetric {
  employeeId: string
  quarter: string
  score: number
  goals: number
  completed: number
}

export default function HRManagementPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHRData()
  }, [])

  const loadHRData = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setEmployees([
        {
          id: "1",
          firstName: "Anna",
          lastName: "Schmidt",
          email: "anna.schmidt@wegroup.com",
          department: "Engineering",
          position: "Senior Developer",
          startDate: "2022-03-15",
          status: "active",
          performanceScore: 92,
          avatar: "https://i.pinimg.com/originals/f9/f4/a9/f9f4a9ab04a9e13aaac330a0e4d2c438.jpg"
        },
        {
          id: "2",
          firstName: "Michael",
          lastName: "Weber",
          email: "michael.weber@wegroup.com",
          department: "Marketing",
          position: "Marketing Manager",
          startDate: "2021-08-22",
          status: "active",
          performanceScore: 88,
          avatar: "https://i.pinimg.com/originals/21/76/78/217678f7eb0ebcae251430dda3529ff0.jpg"
        },
        {
          id: "3",
          firstName: "Lisa",
          lastName: "Müller",
          email: "lisa.mueller@wegroup.com",
          department: "HR",
          position: "HR Specialist",
          startDate: "2023-01-10",
          status: "onLeave",
          performanceScore: 85,
          avatar: "https://i.pinimg.com/736x/6c/e2/c6/6ce2c6e74fcbeaed914355858d4224eb.jpg"
        },
        {
          id: "4",
          firstName: "Thomas",
          lastName: "Fischer",
          email: "thomas.fischer@wegroup.com",
          department: "Sales",
          position: "Sales Director",
          startDate: "2020-11-05",
          status: "active",
          performanceScore: 95,
          avatar: "https://i.pinimg.com/originals/6d/de/8a/6dde8a661a29a862108093fe54439844.jpg"
        },
        {
          id: "5",
          firstName: "Sarah",
          lastName: "Klein",
          email: "sarah.klein@wegroup.com",
          department: "Finance",
          position: "Financial Analyst",
          startDate: "2022-09-12",
          status: "active",
          performanceScore: 89,
          avatar: "https://i.pinimg.com/originals/53/57/13/535713a363b47b850760eddcb7cfb649.jpg"
        }
      ])

      setDepartments([
        { id: "1", name: "Engineering", headCount: 25, budget: 2500000, avgSalary: 85000, openPositions: 3 },
        { id: "2", name: "Marketing", headCount: 12, budget: 800000, avgSalary: 65000, openPositions: 2 },
        { id: "3", name: "Sales", headCount: 18, budget: 1200000, avgSalary: 70000, openPositions: 5 },
        { id: "4", name: "HR", headCount: 8, budget: 600000, avgSalary: 60000, openPositions: 1 },
        { id: "5", name: "Finance", headCount: 10, budget: 750000, avgSalary: 75000, openPositions: 2 }
      ])
      setLoading(false)
    }, 1000)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      onLeave: "secondary",
      terminated: "destructive"
    } as const
    
    const labels = {
      active: "Aktiv",
      onLeave: "Beurlaubt",
      terminated: "Gekündigt"
    }
    
    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment
    const matchesStatus = selectedStatus === "all" || employee.status === selectedStatus
    return matchesSearch && matchesDepartment && matchesStatus
  })

  // Sample chart data
  const headcountData = [
    { month: 'Aug', headcount: 68, newHires: 3, departures: 1 },
    { month: 'Sep', headcount: 71, newHires: 4, departures: 1 },
    { month: 'Okt', headcount: 72, newHires: 2, departures: 1 },
    { month: 'Nov', headcount: 75, newHires: 4, departures: 1 },
    { month: 'Dez', headcount: 73, newHires: 1, departures: 3 },
    { month: 'Jan', headcount: 76, newHires: 5, departures: 2 }
  ]

  const departmentDistribution = departments.map(dept => ({
    name: dept.name,
    value: dept.headCount,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`
  }))

  const totalEmployees = employees.length
  const activeEmployees = employees.filter(e => e.status === 'active').length
  const avgPerformance = Math.round(employees.reduce((sum, e) => sum + e.performanceScore, 0) / employees.length)
  const totalOpenPositions = departments.reduce((sum, d) => sum + d.openPositions, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Personalverwaltung</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">Personalverwaltung</h1>
          <p className="text-gray-600 mt-1">Umfassende Verwaltung von Mitarbeitern und HR-Prozessen</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Neuer Mitarbeiter
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gesamtmitarbeiter</p>
                <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
                <p className="text-xs text-green-600">+5 diesen Monat</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktive Mitarbeiter</p>
                <p className="text-2xl font-bold text-green-600">{activeEmployees}</p>
                <p className="text-xs text-gray-500">{Math.round((activeEmployees/totalEmployees)*100)}% der Belegschaft</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Durchschn. Performance</p>
                <p className="text-2xl font-bold text-purple-600">{avgPerformance}%</p>
                <Progress value={avgPerformance} className="mt-2" />
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Offene Stellen</p>
                <p className="text-2xl font-bold text-orange-600">{totalOpenPositions}</p>
                <p className="text-xs text-gray-500">Über alle Abteilungen</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mitarbeiterentwicklung</CardTitle>
            <CardDescription>Monatliche Entwicklung der Belegschaft</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={headcountData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  label={{ value: 'Anzahl', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                />
                <Tooltip />
                <Line type="monotone" dataKey="headcount" stroke="#3B82F6" strokeWidth={3} name="Gesamtbelegschaft" />
                <Line type="monotone" dataKey="newHires" stroke="#10B981" strokeWidth={2} name="Neueinstellungen" />
                <Line type="monotone" dataKey="departures" stroke="#EF4444" strokeWidth={2} name="Abgänge" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Abteilungsverteilung</CardTitle>
            <CardDescription>Mitarbeiterverteilung nach Abteilungen</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Tooltip formatter={(value) => [`${value} Mitarbeiter`, '']} />
                <PieChart dataKey="value" data={departmentDistribution} cx="50%" cy="50%" outerRadius={80}>
                  {departmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </PieChart>
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {departmentDistribution.map((dept) => (
                <div key={dept.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }}></div>
                  <span className="text-sm text-gray-600">{dept.name}: {dept.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="employees">Mitarbeiter</TabsTrigger>
          <TabsTrigger value="departments">Abteilungen</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="recruitment">Recruiting</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Mitarbeiter suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Abteilung" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Abteilungen</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="active">Aktiv</SelectItem>
                <SelectItem value="onLeave">Beurlaubt</SelectItem>
                <SelectItem value="terminated">Gekündigt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={employee.avatar} alt={`${employee.firstName} ${employee.lastName}`} />
                        <AvatarFallback>
                          {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{employee.position}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">{employee.department}</Badge>
                          {getStatusBadge(employee.status)}
                          <span className="text-xs text-gray-500">
                            Seit {new Date(employee.startDate).toLocaleDateString('de-DE')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-gray-600">Performance:</span>
                        <span className={`font-bold ${getPerformanceColor(employee.performanceScore)}`}>
                          {employee.performanceScore}%
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Profil
                        </Button>
                        <Button size="sm">
                          Bearbeiten
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="grid gap-4">
            {departments.map((department) => (
              <Card key={department.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{department.name}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-2">
                          <div>
                            <span className="text-gray-500">Mitarbeiter: </span>
                            <span className="font-medium">{department.headCount}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Offene Stellen: </span>
                            <span className="font-medium text-orange-600">{department.openPositions}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Budget: </span>
                            <span className="font-medium">€{department.budget.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Ø Gehalt: </span>
                            <span className="font-medium">€{department.avgSalary.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button>
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>
                Mitarbeiterleistung und Zielerreichung im Überblick
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{avgPerformance}%</div>
                  <div className="text-sm text-gray-600">Durchschnittliche Performance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">85%</div>
                  <div className="text-sm text-gray-600">Zielerreichung</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">4.2/5</div>
                  <div className="text-sm text-gray-600">Mitarbeiterzufriedenheit</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recruitment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recruiting Pipeline</CardTitle>
              <CardDescription>
                Übersicht über offene Stellen und Bewerbungsprozesse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{totalOpenPositions}</div>
                  <div className="text-sm text-gray-600">Offene Stellen</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">127</div>
                  <div className="text-sm text-gray-600">Bewerbungen</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">23</div>
                  <div className="text-sm text-gray-600">In Bearbeitung</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">8</div>
                  <div className="text-sm text-gray-600">Vorstellungsgespräche</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
