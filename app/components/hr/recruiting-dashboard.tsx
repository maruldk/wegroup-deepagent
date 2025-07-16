
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  UserPlus, 
  Clock, 
  CheckCircle, 
  Brain, 
  Target,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  Star
} from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'

interface JobPosting {
  id: string
  title: string
  department: string
  location: string
  type: 'full_time' | 'part_time' | 'contract'
  urgency: 'low' | 'medium' | 'high' | 'critical'
  applications: number
  posted_date: string
  ai_score: number
  status: 'active' | 'paused' | 'filled'
}

interface Candidate {
  id: string
  name: string
  position: string
  email: string
  phone: string
  experience: number
  ai_match_score: number
  skills: string[]
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected'
  interview_date?: string
  salary_expectation: number
}

export function RecruitingDashboard() {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecruitingData()
  }, [])

  const loadRecruitingData = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setJobPostings([
        {
          id: '1',
          title: 'Senior Full-Stack Developer',
          department: 'Engineering',
          location: 'Berlin',
          type: 'full_time',
          urgency: 'high',
          applications: 45,
          posted_date: '2024-01-10',
          ai_score: 92,
          status: 'active'
        },
        {
          id: '2',
          title: 'Product Manager',
          department: 'Product',
          location: 'München',
          type: 'full_time',
          urgency: 'medium',
          applications: 28,
          posted_date: '2024-01-08',
          ai_score: 87,
          status: 'active'
        },
        {
          id: '3',
          title: 'UX Designer',
          department: 'Design',
          location: 'Hamburg',
          type: 'full_time',
          urgency: 'low',
          applications: 62,
          posted_date: '2024-01-05',
          ai_score: 95,
          status: 'active'
        }
      ])

      setCandidates([
        {
          id: '1',
          name: 'Anna Schmidt',
          position: 'Senior Full-Stack Developer',
          email: 'anna.schmidt@email.com',
          phone: '+49 123 456789',
          experience: 5,
          ai_match_score: 94,
          skills: ['React', 'Node.js', 'TypeScript', 'Python'],
          status: 'interview',
          interview_date: '2024-01-18T14:00:00',
          salary_expectation: 75000
        },
        {
          id: '2',
          name: 'Michael Weber',
          position: 'Product Manager',
          email: 'm.weber@email.com',
          phone: '+49 123 456790',
          experience: 7,
          ai_match_score: 89,
          skills: ['Product Strategy', 'Agile', 'Analytics', 'Leadership'],
          status: 'screening',
          salary_expectation: 85000
        },
        {
          id: '3',
          name: 'Sarah König',
          position: 'UX Designer',
          email: 's.koenig@email.com',
          phone: '+49 123 456791',
          experience: 4,
          ai_match_score: 91,
          skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
          status: 'offer',
          salary_expectation: 62000
        },
        {
          id: '4',
          name: 'Thomas Müller',
          position: 'Senior Full-Stack Developer',
          email: 't.mueller@email.com',
          phone: '+49 123 456792',
          experience: 6,
          ai_match_score: 87,
          skills: ['Vue.js', 'Python', 'AWS', 'Docker'],
          status: 'new',
          salary_expectation: 78000
        }
      ])
      setLoading(false)
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-700',
      screening: 'bg-yellow-100 text-yellow-700',
      interview: 'bg-purple-100 text-purple-700',
      offer: 'bg-green-100 text-green-700',
      hired: 'bg-green-200 text-green-800',
      rejected: 'bg-red-100 text-red-700'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-orange-100 text-orange-700',
      critical: 'bg-red-100 text-red-700'
    }
    return colors[urgency as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  const recruitingMetrics = [
    { month: 'Okt', applications: 120, hired: 8, conversion: 6.7 },
    { month: 'Nov', applications: 145, hired: 12, conversion: 8.3 },
    { month: 'Dez', applications: 98, hired: 6, conversion: 6.1 },
    { month: 'Jan', applications: 135, hired: 9, conversion: 6.7 }
  ]

  const pipelineData = [
    { name: 'Neue Bewerbungen', value: 45, color: '#60B5FF' },
    { name: 'Screening', value: 28, color: '#FF9149' },
    { name: 'Interviews', value: 15, color: '#FF9898' },
    { name: 'Angebote', value: 8, color: '#80D8C3' },
    { name: 'Einstellungen', value: 3, color: '#A19AD3' }
  ]

  const totalApplications = candidates.length
  const interviewsScheduled = candidates.filter(c => c.status === 'interview').length
  const offersExtended = candidates.filter(c => c.status === 'offer').length
  const avgMatchScore = Math.round(candidates.reduce((acc, c) => acc + c.ai_match_score, 0) / candidates.length)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">KI-Recruiting</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">KI-Recruiting Dashboard</h1>
          <p className="text-gray-600 mt-1">Intelligente Kandidatenanalyse mit 94% Genauigkeit</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Brain className="w-4 h-4 mr-2" />
            KI-Analyse
          </Button>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Neue Stelle
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bewerbungen</p>
                <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
                <p className="text-xs text-green-600">+12% vs. letzter Monat</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Interviews</p>
                <p className="text-2xl font-bold text-purple-600">{interviewsScheduled}</p>
                <p className="text-xs text-gray-500">Diese Woche</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Angebote</p>
                <p className="text-2xl font-bold text-green-600">{offersExtended}</p>
                <p className="text-xs text-green-600">Ausstehend</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">KI-Match Score</p>
                <p className="text-2xl font-bold text-orange-600">{avgMatchScore}%</p>
                <p className="text-xs text-orange-600">Durchschnitt</p>
              </div>
              <Brain className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recruiting Performance</CardTitle>
            <CardDescription>Bewerbungen und Einstellungen pro Monat</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={recruitingMetrics}>
                <XAxis 
                  dataKey="month" 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip />
                <Bar dataKey="applications" fill="#60B5FF" name="Bewerbungen" />
                <Bar dataKey="hired" fill="#80D8C3" name="Einstellungen" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recruiting Pipeline</CardTitle>
            <CardDescription>Aktuelle Kandidaten nach Status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pipelineData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="positions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="positions">Offene Stellen</TabsTrigger>
          <TabsTrigger value="candidates">Kandidaten</TabsTrigger>
          <TabsTrigger value="analytics">KI-Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="space-y-4">
          <div className="grid gap-4">
            {jobPostings.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <Badge className={getUrgencyColor(job.urgency)}>
                          {job.urgency === 'low' && 'Niedrig'}
                          {job.urgency === 'medium' && 'Mittel'}
                          {job.urgency === 'high' && 'Hoch'}
                          {job.urgency === 'critical' && 'Kritisch'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          KI-Score: {job.ai_score}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Abteilung: </span>
                          {job.department}
                        </div>
                        <div>
                          <span className="font-medium">Standort: </span>
                          {job.location}
                        </div>
                        <div>
                          <span className="font-medium">Typ: </span>
                          {job.type === 'full_time' ? 'Vollzeit' : job.type === 'part_time' ? 'Teilzeit' : 'Freelance'}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span>{job.applications} Bewerbungen</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>Seit {new Date(job.posted_date).toLocaleDateString('de-DE')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Bearbeiten
                      </Button>
                      <Button size="sm">
                        Kandidaten
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          <div className="grid gap-4">
            {candidates.map((candidate) => (
              <Card key={candidate.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                        <Badge className={getStatusColor(candidate.status)}>
                          {candidate.status === 'new' && 'Neu'}
                          {candidate.status === 'screening' && 'Screening'}
                          {candidate.status === 'interview' && 'Interview'}
                          {candidate.status === 'offer' && 'Angebot'}
                          {candidate.status === 'hired' && 'Eingestellt'}
                          {candidate.status === 'rejected' && 'Abgelehnt'}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{candidate.ai_match_score}%</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{candidate.position}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{candidate.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{candidate.phone}</span>
                        </div>
                        <div>
                          <span className="font-medium">Erfahrung: </span>
                          {candidate.experience} Jahre
                        </div>
                      </div>
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {candidate.interview_date && (
                        <div className="text-sm text-purple-600">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Interview: {new Date(candidate.interview_date).toLocaleString('de-DE')}
                        </div>
                      )}
                      <div className="mt-2">
                        <Progress 
                          value={candidate.ai_match_score} 
                          className="w-32"
                        />
                        <p className="text-xs text-gray-500 mt-1">KI-Match Score</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        €{candidate.salary_expectation.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mb-3">Gehaltsvorstellung</p>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Profil
                        </Button>
                        <Button size="sm">
                          Interview
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>KI-Performance Metrics</CardTitle>
                <CardDescription>Algorithmus-Genauigkeit und Lernfortschritt</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Kandidaten-Matching</span>
                  <span className="font-bold">94.2%</span>
                </div>
                <Progress value={94.2} />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Interview-Erfolgsrate</span>
                  <span className="font-bold">87.5%</span>
                </div>
                <Progress value={87.5} />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Einstellungs-Präzision</span>
                  <span className="font-bold">91.8%</span>
                </div>
                <Progress value={91.8} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kosteneinsparungen</CardTitle>
                <CardDescription>Durch KI-Automatisierung erreichte Einsparungen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">€142,500</p>
                  <p className="text-sm text-gray-600">Jährliche Einsparungen</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Zeitersparnis</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Reduzierte Fehleinstellungen</span>
                    <span className="font-medium">-78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Automatisierte Vorselektion</span>
                    <span className="font-medium">92%</span>
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
