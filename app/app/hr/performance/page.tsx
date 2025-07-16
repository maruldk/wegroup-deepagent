
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Award,
  BarChart3,
  Users,
  Calendar,
  Brain
} from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

interface PerformanceMetric {
  id: string
  employeeId: string
  employeeName: string
  department: string
  position: string
  overallScore: number
  goals: Goal[]
  skills: SkillAssessment[]
  feedback: FeedbackItem[]
  period: string
  trend: 'up' | 'down' | 'stable'
}

interface Goal {
  id: string
  title: string
  description: string
  progress: number
  dueDate: string
  status: 'completed' | 'on_track' | 'at_risk' | 'overdue'
  weight: number
}

interface SkillAssessment {
  skill: string
  current: number
  target: number
  improvement: number
}

interface FeedbackItem {
  date: string
  type: '360' | 'peer' | 'manager' | 'self'
  score: number
  comments: string
}

export default function PerformancePage() {
  const [performanceData, setPerformanceData] = useState<PerformanceMetric[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('current_quarter')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPerformanceData()
  }, [selectedPeriod, selectedDepartment])

  const loadPerformanceData = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setPerformanceData([
        {
          id: '1',
          employeeId: 'emp_001',
          employeeName: 'Anna Schmidt',
          department: 'Engineering',
          position: 'Senior Developer',
          overallScore: 87,
          period: 'Q1 2024',
          trend: 'up',
          goals: [
            {
              id: 'g1',
              title: 'Feature Development',
              description: 'Complete 3 major features',
              progress: 85,
              dueDate: '2024-03-31',
              status: 'on_track',
              weight: 40
            },
            {
              id: 'g2',
              title: 'Team Mentoring',
              description: 'Mentor 2 junior developers',
              progress: 100,
              dueDate: '2024-03-15',
              status: 'completed',
              weight: 30
            },
            {
              id: 'g3',
              title: 'Technical Documentation',
              description: 'Update system documentation',
              progress: 60,
              dueDate: '2024-04-01',
              status: 'at_risk',
              weight: 30
            }
          ],
          skills: [
            { skill: 'Technical Expertise', current: 90, target: 95, improvement: 5 },
            { skill: 'Communication', current: 85, target: 90, improvement: 8 },
            { skill: 'Leadership', current: 78, target: 85, improvement: 12 },
            { skill: 'Problem Solving', current: 92, target: 95, improvement: 3 },
            { skill: 'Teamwork', current: 88, target: 90, improvement: 4 }
          ],
          feedback: [
            {
              date: '2024-01-15',
              type: 'manager',
              score: 88,
              comments: 'Excellent technical skills, great mentor'
            },
            {
              date: '2024-01-20',
              type: 'peer',
              score: 86,
              comments: 'Very collaborative, always helpful'
            }
          ]
        },
        {
          id: '2',
          employeeId: 'emp_002',
          employeeName: 'Michael Weber',
          department: 'Marketing',
          position: 'Marketing Manager',
          overallScore: 82,
          period: 'Q1 2024',
          trend: 'stable',
          goals: [
            {
              id: 'g4',
              title: 'Campaign ROI',
              description: 'Achieve 25% ROI improvement',
              progress: 78,
              dueDate: '2024-03-31',
              status: 'on_track',
              weight: 50
            },
            {
              id: 'g5',
              title: 'Team Development',
              description: 'Upskill marketing team',
              progress: 90,
              dueDate: '2024-02-28',
              status: 'completed',
              weight: 25
            },
            {
              id: 'g6',
              title: 'Brand Awareness',
              description: 'Increase brand awareness by 15%',
              progress: 45,
              dueDate: '2024-04-15',
              status: 'at_risk',
              weight: 25
            }
          ],
          skills: [
            { skill: 'Strategic Thinking', current: 85, target: 90, improvement: 7 },
            { skill: 'Creativity', current: 88, target: 92, improvement: 5 },
            { skill: 'Data Analysis', current: 75, target: 85, improvement: 15 },
            { skill: 'Communication', current: 90, target: 92, improvement: 3 },
            { skill: 'Leadership', current: 80, target: 88, improvement: 10 }
          ],
          feedback: [
            {
              date: '2024-01-10',
              type: 'manager',
              score: 83,
              comments: 'Strong creative vision, needs data skills improvement'
            }
          ]
        }
      ])
      setLoading(false)
    }, 1000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getGoalStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-700',
      on_track: 'bg-blue-100 text-blue-700',
      at_risk: 'bg-yellow-100 text-yellow-700',
      overdue: 'bg-red-100 text-red-700'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <BarChart3 className="w-4 h-4 text-gray-500" />
    }
  }

  const departmentPerformance = [
    { department: 'Engineering', avgScore: 85, employees: 12 },
    { department: 'Marketing', avgScore: 82, employees: 8 },
    { department: 'Sales', avgScore: 79, employees: 15 },
    { department: 'Operations', avgScore: 83, employees: 10 },
    { department: 'Finance', avgScore: 86, employees: 6 }
  ]

  const performanceTrends = [
    { month: 'Okt', score: 78, engagement: 82 },
    { month: 'Nov', score: 81, engagement: 85 },
    { month: 'Dez', score: 83, engagement: 83 },
    { month: 'Jan', score: 85, engagement: 87 }
  ]

  const avgPerformanceScore = Math.round(performanceData.reduce((acc, emp) => acc + emp.overallScore, 0) / performanceData.length)
  const topPerformers = performanceData.filter(emp => emp.overallScore >= 85).length
  const improvementNeeded = performanceData.filter(emp => emp.overallScore < 75).length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Performance Management</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">KI-Performance Management</h1>
          <p className="text-gray-600 mt-1">Datengestützte Leistungsbewertung mit 360°-Feedback</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Zeitraum wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current_quarter">Aktuelles Quartal</SelectItem>
              <SelectItem value="last_quarter">Letztes Quartal</SelectItem>
              <SelectItem value="ytd">Year-to-Date</SelectItem>
              <SelectItem value="annual">Jahresansicht</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Brain className="w-4 h-4 mr-2" />
            KI-Analyse
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ø Performance</p>
                <p className={`text-2xl font-bold ${getScoreColor(avgPerformanceScore)}`}>{avgPerformanceScore}</p>
                <p className="text-xs text-blue-600">von 100 Punkten</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Performer</p>
                <p className="text-2xl font-bold text-green-600">{topPerformers}</p>
                <p className="text-xs text-green-600">≥85 Punkte</p>
              </div>
              <Award className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verbesserung nötig</p>
                <p className="text-2xl font-bold text-orange-600">{improvementNeeded}</p>
                <p className="text-xs text-orange-600">&lt;75 Punkte</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktive Reviews</p>
                <p className="text-2xl font-bold text-purple-600">{performanceData.length}</p>
                <p className="text-xs text-purple-600">Dieses Quartal</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>Leistungsentwicklung über Zeit</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceTrends}>
                <XAxis 
                  dataKey="month" 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  label={{ value: 'Score', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#60B5FF" 
                  strokeWidth={2}
                  name="Performance Score"
                />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#80D8C3" 
                  strokeWidth={2}
                  name="Engagement Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Abteilungs-Performance</CardTitle>
            <CardDescription>Durchschnittswerte nach Abteilung</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentPerformance}>
                <XAxis 
                  dataKey="department" 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  label={{ value: 'Ø Score', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                />
                <Tooltip />
                <Bar dataKey="avgScore" fill="#60B5FF" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="individual" className="space-y-4">
        <TabsList>
          <TabsTrigger value="individual">Individuelle Performance</TabsTrigger>
          <TabsTrigger value="goals">Ziele & KPIs</TabsTrigger>
          <TabsTrigger value="skills">Skill Assessment</TabsTrigger>
          <TabsTrigger value="feedback">360°-Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4">
          <div className="grid gap-4">
            {performanceData.map((employee) => (
              <Card key={employee.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{employee.employeeName}</h3>
                        <Badge variant="outline" className="text-xs">
                          {employee.department} • {employee.position}
                        </Badge>
                        {getTrendIcon(employee.trend)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-500">Gesamt-Score: </span>
                          <span className={`font-bold ${getScoreColor(employee.overallScore)}`}>
                            {employee.overallScore}/100
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Ziele erreicht: </span>
                          <span className="font-medium">
                            {employee.goals.filter(g => g.status === 'completed').length}/{employee.goals.length}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Zeitraum: </span>
                          <span className="font-medium">{employee.period}</span>
                        </div>
                      </div>

                      {/* Goals Progress */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 mb-2">Aktuelle Ziele</h4>
                        {employee.goals.slice(0, 3).map((goal) => (
                          <div key={goal.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-sm font-medium">{goal.title}</span>
                                <Badge className={getGoalStatusColor(goal.status)}>
                                  {goal.status === 'completed' && 'Abgeschlossen'}
                                  {goal.status === 'on_track' && 'Im Plan'}
                                  {goal.status === 'at_risk' && 'Risiko'}
                                  {goal.status === 'overdue' && 'Überfällig'}
                                </Badge>
                              </div>
                              <Progress value={goal.progress} className="h-2" />
                            </div>
                            <span className="text-sm font-medium ml-4">{goal.progress}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="mb-4">
                        <div className="text-3xl font-bold mb-1">
                          <Star className="w-6 h-6 text-yellow-400 fill-current inline mr-1" />
                          <span className={getScoreColor(employee.overallScore)}>
                            {employee.overallScore}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Performance Score</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                        <Button size="sm">
                          Review
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          {performanceData.map((employee) => (
            <Card key={employee.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{employee.employeeName} - Skill Assessment</CardTitle>
                <CardDescription>Aktuelle Fähigkeiten vs. Zielwerte</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {employee.skills.map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{skill.skill}</span>
                          <span className="text-sm text-gray-600">
                            {skill.current}/{skill.target}
                          </span>
                        </div>
                        <div className="relative">
                          <Progress value={(skill.current / 100) * 100} className="h-2" />
                          <div 
                            className="absolute top-0 h-2 bg-red-200 rounded"
                            style={{ 
                              left: `${skill.current}%`,
                              width: `${skill.target - skill.current}%`
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Aktuell: {skill.current}</span>
                          <span className={skill.improvement > 10 ? 'text-orange-600' : 'text-green-600'}>
                            {skill.improvement > 0 ? '+' : ''}{skill.improvement}% Verbesserungsbedarf
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={employee.skills}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10 }} />
                        <PolarRadiusAxis 
                          angle={0} 
                          domain={[0, 100]} 
                          tick={{ fontSize: 8 }}
                        />
                        <Radar
                          name="Aktuell"
                          dataKey="current"
                          stroke="#60B5FF"
                          fill="#60B5FF"
                          fillOpacity={0.3}
                        />
                        <Radar
                          name="Ziel"
                          dataKey="target"
                          stroke="#80D8C3"
                          fill="transparent"
                          strokeDasharray="5 5"
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feedback-Übersicht</CardTitle>
                <CardDescription>360°-Feedback Statistiken</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Manager Feedback</span>
                  <span className="font-bold">85.5</span>
                </div>
                <Progress value={85.5} />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Peer Feedback</span>
                  <span className="font-bold">83.2</span>
                </div>
                <Progress value={83.2} />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Self Assessment</span>
                  <span className="font-bold">78.9</span>
                </div>
                <Progress value={78.9} />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">360° Durchschnitt</span>
                  <span className="font-bold text-blue-600">82.5</span>
                </div>
                <Progress value={82.5} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>KI-Empfehlungen</CardTitle>
                <CardDescription>Datengestützte Entwicklungsvorschläge</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Leadership Training empfohlen</p>
                      <p className="text-xs text-gray-600">Für Anna Schmidt - Potenzial für Führungsrolle</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Target className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Data Analytics Kurs</p>
                      <p className="text-xs text-gray-600">Für Michael Weber - Skill Gap identifiziert</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Award className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Leistungsanerkennung</p>
                      <p className="text-xs text-gray-600">Mentoring-Erfolg sollte gewürdigt werden</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
