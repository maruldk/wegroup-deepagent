
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FileText, 
  Search, 
  Plus, 
  Mail, 
  Calendar,
  User,
  Brain,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface JobApplication {
  id: string
  candidateName: string
  candidateEmail: string
  position: string
  resumeUrl?: string
  coverLetterUrl?: string
  status: string
  aiSuitabilityScore?: number
  aiSkillsMatch?: any
  aiPersonalityFit?: any
  aiRecommendation?: string
  confidenceScore?: number
  appliedDate: string
  lastContactDate?: string
  interviewDate?: string
  decision?: string
  assignedEmployee?: {
    id: string
    firstName: string
    lastName: string
  }
}

const statusLabels: { [key: string]: string } = {
  'RECEIVED': 'Eingegangen',
  'SCREENING': 'Screening',
  'INTERVIEW_SCHEDULED': 'Interview geplant',
  'INTERVIEWED': 'Interview erfolgt',
  'BACKGROUND_CHECK': 'Hintergrundprüfung',
  'OFFER_MADE': 'Angebot gemacht',
  'HIRED': 'Eingestellt',
  'REJECTED': 'Abgelehnt',
  'WITHDRAWN': 'Zurückgezogen'
}

const statusColors: { [key: string]: string } = {
  'RECEIVED': 'bg-blue-100 text-blue-800',
  'SCREENING': 'bg-yellow-100 text-yellow-800',
  'INTERVIEW_SCHEDULED': 'bg-purple-100 text-purple-800',
  'INTERVIEWED': 'bg-indigo-100 text-indigo-800',
  'BACKGROUND_CHECK': 'bg-orange-100 text-orange-800',
  'OFFER_MADE': 'bg-green-100 text-green-800',
  'HIRED': 'bg-green-100 text-green-800',
  'REJECTED': 'bg-red-100 text-red-800',
  'WITHDRAWN': 'bg-gray-100 text-gray-800'
}

export function JobApplicationsList() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [positionFilter, setPositionFilter] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [analyzing, setAnalyzing] = useState<string | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [page, statusFilter, positionFilter])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })
      
      if (statusFilter) params.append('status', statusFilter)
      if (positionFilter) params.append('position', positionFilter)

      const response = await fetch(`/api/hr/applications?${params}`)
      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications)
        setTotal(data.pagination.total)
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const analyzeApplication = async (applicationId: string) => {
    try {
      setAnalyzing(applicationId)
      toast.info('Starte KI-Analyse...')
      
      const response = await fetch(`/api/hr/applications/${applicationId}/analyze`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        setApplications(prev => 
          prev.map(app => 
            app.id === applicationId ? data.application : app
          )
        )
        toast.success('KI-Analyse abgeschlossen!')
      } else {
        throw new Error('Analysis failed')
      }
    } catch (error) {
      console.error('Analysis failed:', error)
      toast.error('KI-Analyse fehlgeschlagen')
    } finally {
      setAnalyzing(null)
    }
  }

  const filteredApplications = applications.filter(app => {
    if (!searchTerm) return true
    return app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           app.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
           app.position.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const getSuitabilityBadge = (score?: number) => {
    if (!score) return null
    
    if (score >= 80) {
      return (
        <Badge className="bg-green-100 text-green-800 text-xs">
          <CheckCircle className="h-3 w-3 mr-1" />
          Exzellent ({score}%)
        </Badge>
      )
    } else if (score >= 60) {
      return (
        <Badge className="bg-blue-100 text-blue-800 text-xs">
          <CheckCircle className="h-3 w-3 mr-1" />
          Gut ({score}%)
        </Badge>
      )
    } else if (score >= 40) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 text-xs">
          <AlertCircle className="h-3 w-3 mr-1" />
          Mittel ({score}%)
        </Badge>
      )
    } else {
      return (
        <Badge variant="destructive" className="text-xs">
          <XCircle className="h-3 w-3 mr-1" />
          Niedrig ({score}%)
        </Badge>
      )
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Bewerbungen</span>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Neue Bewerbung
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Suche nach Name, E-Mail oder Position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="RECEIVED">Eingegangen</SelectItem>
                <SelectItem value="SCREENING">Screening</SelectItem>
                <SelectItem value="INTERVIEW_SCHEDULED">Interview geplant</SelectItem>
                <SelectItem value="HIRED">Eingestellt</SelectItem>
                <SelectItem value="REJECTED">Abgelehnt</SelectItem>
              </SelectContent>
            </Select>
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Positionen</SelectItem>
                <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                <SelectItem value="Product Manager">Product Manager</SelectItem>
                <SelectItem value="Sales Manager">Sales Manager</SelectItem>
                <SelectItem value="Marketing Specialist">Marketing Specialist</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Applications List */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Lade Bewerbungen...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12 mt-1">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${application.candidateName}`} />
                        <AvatarFallback>
                          {application.candidateName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold truncate">
                            {application.candidateName}
                          </h3>
                          <Badge className={statusColors[application.status] || 'bg-gray-100 text-gray-800'}>
                            {statusLabels[application.status] || application.status}
                          </Badge>
                          {application.aiSuitabilityScore && getSuitabilityBadge(application.aiSuitabilityScore)}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>{application.candidateEmail}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span className="font-medium">{application.position}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Beworben: {new Date(application.appliedDate).toLocaleDateString('de-DE')}</span>
                            </div>
                            
                            {application.assignedEmployee && (
                              <div className="flex items-center space-x-1">
                                <User className="h-3 w-3" />
                                <span>Betreuer: {application.assignedEmployee.firstName} {application.assignedEmployee.lastName}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* KI Recommendations */}
                          {application.aiRecommendation && (
                            <div className="bg-blue-50 p-3 rounded-lg mt-3">
                              <div className="flex items-start space-x-2">
                                <Brain className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-blue-800 mb-1">KI-Empfehlung:</p>
                                  <p className="text-sm text-blue-700">{application.aiRecommendation}</p>
                                  {application.confidenceScore && (
                                    <p className="text-xs text-blue-600 mt-1">
                                      Confidence: {application.confidenceScore}%
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Skills Match */}
                          {application.aiSkillsMatch && Object.keys(application.aiSkillsMatch).length > 0 && (
                            <div className="space-y-2">
                              {application.aiSkillsMatch.technical && application.aiSkillsMatch.technical.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-gray-700 mb-1">Technische Skills:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {application.aiSkillsMatch.technical.map((skill: string, index: number) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-col items-end space-y-2 min-w-32">
                        {!application.aiSuitabilityScore ? (
                          <Button
                            size="sm"
                            onClick={() => analyzeApplication(application.id)}
                            disabled={analyzing === application.id}
                            className="bg-indigo-600 hover:bg-indigo-700"
                          >
                            {analyzing === application.id ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                Analysiere...
                              </>
                            ) : (
                              <>
                                <Brain className="h-3 w-3 mr-2" />
                                KI-Analyse
                              </>
                            )}
                          </Button>
                        ) : (
                          <div className="space-y-1 text-right">
                            <p className="text-xs text-gray-500">Analysiert</p>
                            <div className="flex items-center space-x-1">
                              <Brain className="h-3 w-3 text-indigo-600" />
                              <span className="text-xs text-indigo-600">KI-Ready</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex space-x-1">
                          {application.resumeUrl && (
                            <Button size="sm" variant="outline">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          )}
                          {application.interviewDate && (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              Interview
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredApplications.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Keine Bewerbungen gefunden</p>
                </div>
              )}
              
              {/* Pagination */}
              {total > 10 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-gray-600">
                    Zeige {Math.min(page * 10, total)} von {total} Bewerbungen
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
