
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  Users, 
  Calendar, 
  MoreHorizontal,
  Image,
  FileText,
  Play,
  Settings
} from 'lucide-react'
import { motion } from 'framer-motion'
import { CreateProjectForm, CreativeProjectType } from '@/lib/types'

interface Project {
  id: string
  title: string
  description?: string
  projectType: string
  status: string
  isCollaborative: boolean
  currentCollaborators?: number
  maxCollaborators?: number
  workflowStage?: string
  deadlineDate?: string
  tags: string[]
  assetCount: number
  createdAt: string
  updatedAt: string
}

export default function WeCreateProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newProject, setNewProject] = useState<CreateProjectForm>({
    title: '',
    description: '',
    projectType: CreativeProjectType.GENERAL,
    isCollaborative: false,
    maxCollaborators: 5,
    deadlineDate: '',
    tags: []
  })

  useEffect(() => {
    fetchProjects()
  }, [statusFilter, typeFilter])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const mockProjects: Project[] = [
        {
          id: '1',
          title: 'Brand Identity Refresh 2024',
          description: 'Komplette Überarbeitung der visuellen Markenidentität mit KI-Unterstützung',
          projectType: 'BRAND_IDENTITY',
          status: 'IN_PROGRESS',
          isCollaborative: true,
          currentCollaborators: 3,
          maxCollaborators: 5,
          workflowStage: 'DEVELOPMENT',
          deadlineDate: '2024-02-15',
          tags: ['branding', 'logo', 'identity'],
          assetCount: 24,
          createdAt: '2024-01-10T10:00:00Z',
          updatedAt: '2024-01-12T15:30:00Z'
        },
        {
          id: '2',
          title: 'Social Media Campaign Q1',
          description: 'Umfassende Social Media Kampagne für das erste Quartal',
          projectType: 'SOCIAL_MEDIA',
          status: 'REVIEW',
          isCollaborative: true,
          currentCollaborators: 2,
          maxCollaborators: 4,
          workflowStage: 'REVIEW',
          deadlineDate: '2024-01-30',
          tags: ['social', 'campaign', 'q1'],
          assetCount: 18,
          createdAt: '2024-01-08T09:00:00Z',
          updatedAt: '2024-01-12T12:15:00Z'
        },
        {
          id: '3',
          title: 'Product Launch Presentation',
          description: 'Interaktive Präsentation für den neuen Produktlaunch',
          projectType: 'PRESENTATION',
          status: 'DRAFT',
          isCollaborative: false,
          currentCollaborators: 1,
          workflowStage: 'IDEATION',
          deadlineDate: '2024-02-28',
          tags: ['product', 'launch', 'presentation'],
          assetCount: 8,
          createdAt: '2024-01-11T14:00:00Z',
          updatedAt: '2024-01-11T16:45:00Z'
        },
        {
          id: '4',
          title: 'AI Avatar Development',
          description: 'Entwicklung personalisierter KI-Avatare für Kundeninteraktion',
          projectType: 'AI_AVATAR_CREATION',
          status: 'IN_PROGRESS',
          isCollaborative: true,
          currentCollaborators: 4,
          maxCollaborators: 6,
          workflowStage: 'DEVELOPMENT',
          deadlineDate: '2024-03-15',
          tags: ['ai', 'avatar', 'customer'],
          assetCount: 15,
          createdAt: '2024-01-09T11:30:00Z',
          updatedAt: '2024-01-12T14:20:00Z'
        }
      ]
      
      setProjects(mockProjects)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setLoading(false)
    }
  }

  const handleCreateProject = async () => {
    try {
      // Here would be the actual API call
      console.log('Creating project:', newProject)
      
      // Reset form and close dialog
      setNewProject({
        title: '',
        description: '',
        projectType: CreativeProjectType.GENERAL,
        isCollaborative: false,
        maxCollaborators: 5,
        deadlineDate: '',
        tags: []
      })
      setCreateDialogOpen(false)
      
      // Refresh projects
      fetchProjects()
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesType = typeFilter === 'all' || project.projectType === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'REVIEW': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'COMPLETED': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case 'BRAND_IDENTITY': return <Sparkles className="w-4 h-4" />
      case 'SOCIAL_MEDIA': return <Users className="w-4 h-4" />
      case 'PRESENTATION': return <Play className="w-4 h-4" />
      case 'AI_AVATAR_CREATION': return <Sparkles className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  if (loading) {
    return <ProjectsSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kreativprojekte</h1>
          <p className="text-gray-600 mt-1">
            Verwalten Sie Ihre Projekte mit KI-Unterstützung und Team-Collaboration
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Neues Projekt
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Neues Kreativprojekt</DialogTitle>
              <DialogDescription>
                Erstellen Sie ein neues Projekt mit KI-Unterstützung und Collaboration-Features.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Projekttitel</Label>
                <Input
                  id="title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="Geben Sie einen Projekttitel ein..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Projektbeschreibung..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Projekttyp</Label>
                <Select 
                  value={newProject.projectType} 
                  onValueChange={(value) => setNewProject({ ...newProject, projectType: value as CreativeProjectType })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wählen Sie einen Projekttyp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GENERAL">Allgemein</SelectItem>
                    <SelectItem value="MARKETING_CAMPAIGN">Marketing Kampagne</SelectItem>
                    <SelectItem value="SOCIAL_MEDIA">Social Media</SelectItem>
                    <SelectItem value="PRESENTATION">Präsentation</SelectItem>
                    <SelectItem value="VIDEO_CONTENT">Video Content</SelectItem>
                    <SelectItem value="GRAPHIC_DESIGN">Grafik Design</SelectItem>
                    <SelectItem value="BRAND_IDENTITY">Brand Identity</SelectItem>
                    <SelectItem value="INTERACTIVE_STORY">Interactive Story</SelectItem>
                    <SelectItem value="AI_AVATAR_CREATION">KI-Avatar Erstellung</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="collaborative"
                  checked={newProject.isCollaborative}
                  onCheckedChange={(checked) => setNewProject({ ...newProject, isCollaborative: checked as boolean })}
                />
                <Label htmlFor="collaborative">Team-Collaboration aktivieren</Label>
              </div>
              {newProject.isCollaborative && (
                <div className="space-y-2">
                  <Label htmlFor="maxCollaborators">Max. Kollaborateure</Label>
                  <Input
                    id="maxCollaborators"
                    type="number"
                    value={newProject.maxCollaborators}
                    onChange={(e) => setNewProject({ ...newProject, maxCollaborators: parseInt(e.target.value) })}
                    min={2}
                    max={20}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleCreateProject} disabled={!newProject.title}>
                Projekt erstellen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Projekte durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status filtern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            <SelectItem value="DRAFT">Entwurf</SelectItem>
            <SelectItem value="IN_PROGRESS">In Bearbeitung</SelectItem>
            <SelectItem value="REVIEW">Review</SelectItem>
            <SelectItem value="APPROVED">Genehmigt</SelectItem>
            <SelectItem value="COMPLETED">Abgeschlossen</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Typ filtern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Typen</SelectItem>
            <SelectItem value="BRAND_IDENTITY">Brand Identity</SelectItem>
            <SelectItem value="SOCIAL_MEDIA">Social Media</SelectItem>
            <SelectItem value="PRESENTATION">Präsentation</SelectItem>
            <SelectItem value="AI_AVATAR_CREATION">KI-Avatar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getProjectTypeIcon(project.projectType)}
                    <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                      {project.title}
                    </CardTitle>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription className="text-sm line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status and Type */}
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {project.projectType.replace('_', ' ')}
                  </Badge>
                </div>

                {/* Collaboration Info */}
                {project.isCollaborative && (
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {project.currentCollaborators}/{project.maxCollaborators} Team
                    </div>
                    <div className="flex items-center">
                      <Image className="w-4 h-4 mr-1" />
                      {project.assetCount} Assets
                    </div>
                  </div>
                )}

                {/* Deadline */}
                {project.deadlineDate && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    Deadline: {new Date(project.deadlineDate).toLocaleDateString('de-DE')}
                  </div>
                )}

                {/* Tags */}
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Öffnen
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Keine Projekte gefunden
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || statusFilter !== 'all' || typeFilter !== 'all' 
              ? 'Versuchen Sie andere Filter oder erstellen Sie ein neues Projekt.'
              : 'Erstellen Sie Ihr erstes Kreativprojekt mit KI-Unterstützung.'
            }
          </p>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Erstes Projekt erstellen
          </Button>
        </div>
      )}
    </div>
  )
}

function ProjectsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
      <div className="flex gap-4">
        <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  <div className="h-8 bg-gray-200 rounded w-10"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
