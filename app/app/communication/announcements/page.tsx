
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Megaphone, Calendar, Users, Eye, Plus, Edit, Trash2 } from 'lucide-react'

export default function CommunicationAnnouncementsPage() {
  const announcements = [
    {
      id: 1,
      title: 'Company-wide Meeting - Q1 Results',
      content: 'Join us for the quarterly results presentation on Friday, January 26th at 2:00 PM in the main conference room...',
      author: 'Anna Schmidt',
      department: 'Management',
      date: '2024-01-15',
      priority: 'high',
      status: 'active',
      views: 156,
      audience: 'all'
    },
    {
      id: 2,
      title: 'New Safety Protocols',
      content: 'We are implementing new safety protocols effective immediately. Please review the updated guidelines...',
      author: 'Klaus Müller',
      department: 'Safety',
      date: '2024-01-14',
      priority: 'high',
      status: 'active',
      views: 203,
      audience: 'logistics'
    },
    {
      id: 3,
      title: 'Holiday Schedule Update',
      content: 'Please note the updated holiday schedule for March. The office will be closed on March 8th and 15th...',
      author: 'Lisa Weber',
      department: 'HR',
      date: '2024-01-12',
      priority: 'medium',
      status: 'active',
      views: 89,
      audience: 'all'
    },
    {
      id: 4,
      title: 'System Maintenance Window',
      content: 'Scheduled maintenance of our IT systems will take place this Saturday from 10:00 PM to 2:00 AM...',
      author: 'Max Müller',
      department: 'IT',
      date: '2024-01-10',
      priority: 'medium',
      status: 'expired',
      views: 134,
      audience: 'all'
    }
  ]

  const stats = [
    { title: 'Active Announcements', value: '8', change: '+2', icon: Megaphone },
    { title: 'Total Views', value: '1,247', change: '+15%', icon: Eye },
    { title: 'This Month', value: '12', change: '+3', icon: Calendar },
    { title: 'Departments', value: '6', change: '+1', icon: Users }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'expired': return 'bg-gray-100 text-gray-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAudienceText = (audience: string) => {
    switch (audience) {
      case 'all': return 'All Employees'
      case 'logistics': return 'Logistics Team'
      case 'hr': return 'HR Department'
      case 'finance': return 'Finance Team'
      default: return 'Specific Group'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600">Manage company-wide communications</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Announcement
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Announcements List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5" />
            Recent Announcements
          </CardTitle>
          <CardDescription>
            Latest company announcements and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                    <Megaphone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                      <Badge className={getPriorityColor(announcement.priority)}>
                        {announcement.priority}
                      </Badge>
                      <Badge className={getStatusColor(announcement.status)}>
                        {announcement.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{announcement.content}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>By {announcement.author}</span>
                      <span>•</span>
                      <span>{announcement.department}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {announcement.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {announcement.views} views
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {getAudienceText(announcement.audience)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Plus className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Create Announcement</h3>
                <p className="text-sm text-gray-600">Draft new company announcement</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold">Schedule Announcement</h3>
                <p className="text-sm text-gray-600">Set up future announcements</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="font-semibold">Analytics</h3>
                <p className="text-sm text-gray-600">View engagement metrics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
