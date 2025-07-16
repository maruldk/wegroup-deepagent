
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mail, Send, Reply, Clock, Users, Plus, Search, Filter } from 'lucide-react'

export default function CommunicationMessagesPage() {
  const messages = [
    {
      id: 1,
      sender: 'Anna Schmidt',
      subject: 'Quarterly Review Meeting',
      preview: 'Please join us for the quarterly review meeting scheduled for next Tuesday...',
      timestamp: '2024-01-15 10:30',
      status: 'unread',
      priority: 'high',
      department: 'HR'
    },
    {
      id: 2,
      sender: 'Max Müller',
      subject: 'Logistics Update',
      preview: 'The shipment tracking system has been updated with new features...',
      timestamp: '2024-01-15 09:15',
      status: 'read',
      priority: 'medium',
      department: 'Logistics'
    },
    {
      id: 3,
      sender: 'Lisa Weber',
      subject: 'Budget Approval Required',
      preview: 'We need approval for the Q2 marketing budget. Please review the attached...',
      timestamp: '2024-01-14 16:45',
      status: 'unread',
      priority: 'high',
      department: 'Finance'
    },
    {
      id: 4,
      sender: 'Klaus Müller',
      subject: 'Team Building Event',
      preview: 'Save the date for our upcoming team building event on March 15th...',
      timestamp: '2024-01-14 14:20',
      status: 'read',
      priority: 'low',
      department: 'HR'
    }
  ]

  const stats = [
    { title: 'Total Messages', value: '247', change: '+15', icon: Mail },
    { title: 'Unread Messages', value: '12', change: '+3', icon: Clock },
    { title: 'Active Conversations', value: '8', change: '+2', icon: Users },
    { title: 'Sent Today', value: '18', change: '+5', icon: Send }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-blue-100 text-blue-800'
      case 'read': return 'bg-gray-100 text-gray-800'
      case 'replied': return 'bg-green-100 text-green-800'
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Manage your internal communications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Compose
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

      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Inbox
          </CardTitle>
          <CardDescription>
            Your recent messages and conversations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors ${message.status === 'unread' ? 'bg-blue-50 border-blue-200' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {message.sender.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${message.status === 'unread' ? 'text-blue-900' : 'text-gray-900'}`}>
                        {message.subject}
                      </h3>
                      <Badge className={getPriorityColor(message.priority)}>
                        {message.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{message.sender} • {message.department}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">{message.preview}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-2">
                    {message.timestamp}
                  </div>
                  <Badge className={getStatusColor(message.status)}>
                    {message.status}
                  </Badge>
                  <div className="flex gap-1 mt-2">
                    <Button size="sm" variant="outline">
                      <Reply className="w-3 h-3" />
                    </Button>
                  </div>
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
              <Send className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Send Message</h3>
                <p className="text-sm text-gray-600">Create new message</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold">Group Chat</h3>
                <p className="text-sm text-gray-600">Start group conversation</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="font-semibold">Schedule Message</h3>
                <p className="text-sm text-gray-600">Send message later</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
