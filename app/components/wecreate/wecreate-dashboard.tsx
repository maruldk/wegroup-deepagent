
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Sparkles, 
  Palette, 
  Users, 
  Zap, 
  TrendingUp, 
  Plus, 
  FileText, 
  Image, 
  Play,
  BarChart3,
  Clock,
  Star
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AIContentGenerator from '@/components/wecreate/ai-content/ai-content-generator'

interface ProjectStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalAssets: number
  collaborators: number
  aiGenerated: number
}

interface RecentProject {
  id: string
  title: string
  type: string
  status: string
  progress: number
  lastUpdated: string
  collaboratorCount: number
  assetCount: number
}

export default function WeCreateDashboard() {
  const [stats, setStats] = useState<ProjectStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalAssets: 0,
    collaborators: 0,
    aiGenerated: 0
  })
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API calls - in real implementation, these would be actual API calls
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setStats({
          totalProjects: 24,
          activeProjects: 8,
          completedProjects: 16,
          totalAssets: 156,
          collaborators: 12,
          aiGenerated: 89
        })

        setRecentProjects([
          {
            id: '1',
            title: 'Brand Identity Refresh',
            type: 'BRAND_IDENTITY',
            status: 'IN_PROGRESS',
            progress: 75,
            lastUpdated: '2 hours ago',
            collaboratorCount: 3,
            assetCount: 12
          },
          {
            id: '2',
            title: 'Social Media Campaign',
            type: 'SOCIAL_MEDIA',
            status: 'REVIEW',
            progress: 90,
            lastUpdated: '1 day ago',
            collaboratorCount: 2,
            assetCount: 8
          },
          {
            id: '3',
            title: 'Product Launch Video',
            type: 'VIDEO_CONTENT',
            status: 'DRAFT',
            progress: 25,
            lastUpdated: '3 days ago',
            collaboratorCount: 4,
            assetCount: 5
          }
        ])
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <WeCreateDashboardSkeleton />
  }

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link href="/wecreate/projects">
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Neues Projekt
          </Button>
        </Link>
        <Button variant="outline" className="border-purple-200 hover:bg-purple-50">
          <Sparkles className="w-4 h-4 mr-2" />
          KI-Content erstellen
        </Button>
        <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
          <Image className="w-4 h-4 mr-2" />
          Asset-Bibliothek
        </Button>
        <Button variant="outline" className="border-indigo-200 hover:bg-indigo-50">
          <Play className="w-4 h-4 mr-2" />
          Story erstellen
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Project Overview</TabsTrigger>
          <TabsTrigger value="ai-content">AI Content Generator</TabsTrigger>
          <TabsTrigger value="analytics">Creative Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Aktive Projekte
              </CardTitle>
              <Sparkles className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">{stats.activeProjects}</div>
              <p className="text-xs text-gray-600 mt-1">
                +3 seit letzter Woche
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                KI-Assets
              </CardTitle>
              <Zap className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{stats.aiGenerated}</div>
              <p className="text-xs text-gray-600 mt-1">
                {Math.round((stats.aiGenerated / stats.totalAssets) * 100)}% aller Assets
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Team-Mitglieder
              </CardTitle>
              <Users className="w-4 h-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-700">{stats.collaborators}</div>
              <p className="text-xs text-gray-600 mt-1">
                Aktive Kollaborateure
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Abgeschlossen
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{stats.completedProjects}</div>
              <p className="text-xs text-gray-600 mt-1">
                Diese Woche: +4 Projekte
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Projects */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  Aktuelle Projekte
                </CardTitle>
                <Link href="/wecreate/projects">
                  <Button variant="ghost" size="sm">
                    Alle anzeigen
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group p-4 rounded-lg border hover:shadow-md transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                            {project.title}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {project.type.replace('_', ' ')}
                          </Badge>
                          <Badge 
                            variant={
                              project.status === 'IN_PROGRESS' ? 'default' :
                              project.status === 'REVIEW' ? 'secondary' : 'outline'
                            }
                            className="text-xs"
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {project.collaboratorCount}
                          </div>
                          <div className="flex items-center">
                            <Image className="w-4 h-4 mr-1" />
                            {project.assetCount} Assets
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {project.lastUpdated}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Fortschritt</span>
                            <span className="font-medium">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KI Performance */}
        <div className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-700">
                <BarChart3 className="w-5 h-5 mr-2" />
                KI-Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Content-Qualität</span>
                  <span className="font-semibold text-purple-700">92%</span>
                </div>
                <Progress value={92} className="h-3" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Automatisierung</span>
                  <span className="font-semibold text-blue-700">85%</span>
                </div>
                <Progress value={85} className="h-3" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">User Adoption</span>
                  <span className="font-semibold text-green-700">78%</span>
                </div>
                <Progress value={78} className="h-3" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Templates verwendet</span>
                <span className="font-semibold">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Stories erstellt</span>
                <span className="font-semibold">7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Durchschn. Rating</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-semibold ml-1">4.8</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Generierte Assets</span>
                <span className="font-semibold text-purple-600">{stats.aiGenerated}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
        </TabsContent>

        <TabsContent value="ai-content" className="space-y-6">
          <AIContentGenerator />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-700">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Content Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">AI-Generated Content</span>
                    <span className="font-semibold text-purple-700">89%</span>
                  </div>
                  <Progress value={89} className="h-3" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Content Quality Score</span>
                    <span className="font-semibold text-blue-700">92%</span>
                  </div>
                  <Progress value={92} className="h-3" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">User Engagement</span>
                    <span className="font-semibold text-green-700">78%</span>
                  </div>
                  <Progress value={78} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Creative Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">AI Templates Used</span>
                  <span className="font-semibold text-green-600">+127%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Collaboration Rate</span>
                  <span className="font-semibold text-blue-600">+45%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Asset Reusability</span>
                  <span className="font-semibold text-purple-600">+68%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Time to Create</span>
                  <span className="font-semibold text-red-600">-34%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function WeCreateDashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-96 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="space-y-6">
          <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
