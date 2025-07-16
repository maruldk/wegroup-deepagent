
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bell, CheckCircle, AlertTriangle, Info, Settings, Clock, Users } from 'lucide-react'

export default function CommunicationNotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: 'alert',
      title: 'System Maintenance Alert',
      message: 'Scheduled maintenance will begin in 30 minutes. Please save your work.',
      timestamp: '2024-01-15 14:30',
      status: 'unread',
      priority: 'high',
      category: 'system'
    },
    {
      id: 2,
      type: 'info',
      title: 'New Employee Onboarding',
      message: 'Welcome Maria Fischer to the Logistics team. Please help her get settled.',
      timestamp: '2024-01-15 12:15',
      status: 'read',
      priority: 'medium',
      category: 'hr'
    },
    {
      id: 3,
      type: 'success',
      title: 'Budget Approval Completed',
      message: 'Q2 marketing budget has been approved by the finance team.',
      timestamp: '2024-01-15 11:45',
      status: 'unread',
      priority: 'medium',
      category: 'finance'
    },
    {
      id: 4,
      type: 'warning',
      title: 'Low Inventory Alert',
      message: 'Safety equipment stock is running low. Please reorder immediately.',
      timestamp: '2024-01-15 10:20',
      status: 'read',
      priority: 'high',
      category: 'logistics'
    },
    {
      id: 5,
      type: 'info',
      title: 'Meeting Reminder',
      message: 'Quarterly review meeting starts in 1 hour in Conference Room A.',
      timestamp: '2024-01-15 09:30',
      status: 'unread',
      priority: 'medium',
      category: 'meeting'
    }
  ]

  const stats = [
    { title: 'Total Notifications', value: '47', change: '+8', icon: Bell },
    { title: 'Unread', value: '12', change: '+3', icon: Clock },
    { title: 'High Priority', value: '5', change: '+2', icon: AlertTriangle },
    { title: 'System Alerts', value: '8', change: '+1', icon: Settings }
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert': return AlertTriangle
      case 'success': return CheckCircle
      case 'warning': return AlertTriangle
      case 'info': return Info
      default: return Bell
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'alert': return 'text-red-600'
      case 'success': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'info': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-blue-100 text-blue-800'
      case 'read': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'system': return 'bg-purple-100 text-purple-800'
      case 'hr': return 'bg-green-100 text-green-800'
      case 'finance': return 'bg-blue-100 text-blue-800'
      case 'logistics': return 'bg-orange-100 text-orange-800'
      case 'meeting': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with system and team notifications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
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
                <span className="text-green-600">{stat.change}</span> from yesterday
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Recent Notifications
          </CardTitle>
          <CardDescription>
            Latest system and team notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => {
              const IconComponent = getTypeIcon(notification.type)
              return (
                <div key={notification.id} className={`flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors ${notification.status === 'unread' ? 'bg-blue-50 border-blue-200' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${notification.type === 'alert' ? 'bg-red-100' : notification.type === 'success' ? 'bg-green-100' : notification.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                      <IconComponent className={`w-6 h-6 ${getTypeColor(notification.type)}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`font-semibold ${notification.status === 'unread' ? 'text-blue-900' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        <Badge className={getPriorityColor(notification.priority)}>
                          {notification.priority}
                        </Badge>
                        <Badge className={getCategoryColor(notification.category)}>
                          {notification.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {notification.timestamp}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getStatusColor(notification.status)}>
                      {notification.status}
                    </Badge>
                    {notification.status === 'unread' && (
                      <Button size="sm" variant="outline">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Mark Read
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notification Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-sm">System</h3>
                <p className="text-xs text-gray-600">8 notifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-sm">HR</h3>
                <p className="text-xs text-gray-600">12 notifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <div>
                <h3 className="font-semibold text-sm">Logistics</h3>
                <p className="text-xs text-gray-600">15 notifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-sm">Finance</h3>
                <p className="text-xs text-gray-600">7 notifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Info className="w-6 h-6 text-indigo-600" />
              <div>
                <h3 className="font-semibold text-sm">Meetings</h3>
                <p className="text-xs text-gray-600">5 notifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
