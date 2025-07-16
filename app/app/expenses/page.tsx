
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Euro, Plus, Calendar, TrendingUp, TrendingDown, CreditCard, Receipt } from 'lucide-react'

export default function ExpensesPage() {
  const expenses = [
    {
      id: 1,
      category: 'Office Supplies',
      amount: 1250.50,
      date: '2024-01-15',
      status: 'approved',
      description: 'Monthly office supplies and stationery'
    },
    {
      id: 2,
      category: 'Travel',
      amount: 850.00,
      date: '2024-01-14',
      status: 'pending',
      description: 'Business trip to Munich'
    },
    {
      id: 3,
      category: 'Software',
      amount: 299.99,
      date: '2024-01-13',
      status: 'approved',
      description: 'Annual software licensing'
    },
    {
      id: 4,
      category: 'Marketing',
      amount: 2100.00,
      date: '2024-01-12',
      status: 'rejected',
      description: 'Digital marketing campaign'
    }
  ]

  const stats = [
    { title: 'Total Expenses', value: '€24,847', change: '+12%', icon: Euro, trend: 'up' },
    { title: 'Pending Approval', value: '€3,250', change: '+25%', icon: Receipt, trend: 'up' },
    { title: 'This Month', value: '€8,450', change: '-8%', icon: Calendar, trend: 'down' },
    { title: 'Average/Day', value: '€156', change: '+5%', icon: TrendingUp, trend: 'up' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600">Track and manage your business expenses</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
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
                <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Recent Expenses
          </CardTitle>
          <CardDescription>
            Your latest expense submissions and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Euro className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{expense.category}</h3>
                    <p className="text-sm text-gray-600">{expense.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {expense.date}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900 mb-1">
                    €{expense.amount.toFixed(2)}
                  </div>
                  <Badge className={getStatusColor(expense.status)}>
                    {expense.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
