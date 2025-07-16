
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, UserPlus, Mail, Phone, MapPin, Calendar, TrendingUp, Activity } from 'lucide-react'

export default function MembersPage() {
  const members = [
    {
      id: 1,
      name: 'Anna Schmidt',
      role: 'HR Manager',
      email: 'anna.schmidt@wegroup.com',
      phone: '+49 30 12345678',
      location: 'Berlin',
      joinDate: '2023-01-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Max Müller',
      role: 'Logistics Coordinator',
      email: 'max.mueller@wegroup.com',
      phone: '+49 30 87654321',
      location: 'Hamburg',
      joinDate: '2023-02-20',
      status: 'active'
    },
    {
      id: 3,
      name: 'Lisa Weber',
      role: 'Financial Analyst',
      email: 'lisa.weber@wegroup.com',
      phone: '+49 30 55566677',
      location: 'München',
      joinDate: '2023-03-10',
      status: 'active'
    }
  ]

  const stats = [
    { title: 'Total Members', value: '2,847', change: '+12%', icon: Users },
    { title: 'Active Members', value: '2,743', change: '+8%', icon: Activity },
    { title: 'New This Month', value: '104', change: '+25%', icon: UserPlus },
    { title: 'Departments', value: '12', change: '+2%', icon: TrendingUp }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-600">Manage your team members and their roles</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Member
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

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Members
          </CardTitle>
          <CardDescription>
            Overview of all active team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.role}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {member.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {member.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="mb-2">
                    {member.status}
                  </Badge>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Joined {member.joinDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
