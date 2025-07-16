
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  ShoppingCart,
  BarChart3,
  Euro
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function UniversalServicesAnalytics() {
  const [loading, setLoading] = useState(true);

  // Demo data
  const monthlyData = [
    { month: 'Jan', requests: 12, quotes: 24, orders: 8, revenue: 45000 },
    { month: 'Feb', requests: 19, quotes: 38, orders: 15, revenue: 78000 },
    { month: 'Mar', requests: 23, quotes: 46, orders: 18, revenue: 92000 },
    { month: 'Apr', requests: 27, quotes: 54, orders: 22, revenue: 110000 },
    { month: 'Mai', requests: 31, quotes: 62, orders: 28, revenue: 135000 },
    { month: 'Jun', requests: 35, quotes: 70, orders: 32, revenue: 158000 },
  ];

  const categoryData = [
    { name: 'IT Services', value: 35, revenue: 250000 },
    { name: 'Marketing', value: 25, revenue: 180000 },
    { name: 'HR Services', value: 20, revenue: 145000 },
    { name: 'Legal', value: 12, revenue: 95000 },
    { name: 'Finance', value: 8, revenue: 65000 },
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Services Analytics</h1>
        <p className="text-gray-600">Umfassende Analysen und KPIs für Ihr Service-Management</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Gesamt Requests', value: '147', icon: FileText, color: 'blue' },
          { title: 'Aktive RFQs', value: '32', icon: BarChart3, color: 'green' },
          { title: 'Abgeschlossene Aufträge', value: '98', icon: ShoppingCart, color: 'purple' },
          { title: 'Gesamtumsatz', value: '€2.4M', icon: Euro, color: 'orange' },
        ].map((kpi, index) => (
          <Card key={kpi.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${kpi.color}-100`}>
                  <kpi.icon className={`h-6 w-6 text-${kpi.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="categories">Kategorien</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monatliche Entwicklung</CardTitle>
                <CardDescription>Requests, Quotes und Orders über die Zeit</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="requests" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="quotes" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="orders" stroke="#F59E0B" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Umsatz-Entwicklung</CardTitle>
                <CardDescription>Monatlicher Umsatz in EUR</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `€${Number(value).toLocaleString()}`} />
                    <Bar dataKey="revenue" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service-Kategorien Verteilung</CardTitle>
              <CardDescription>Anteil der verschiedenen Service-Kategorien</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Conversion Rate', value: '68.5%', description: 'Request zu Order' },
              { title: 'Durchschn. Response Zeit', value: '4.2h', description: 'Zeit bis erste Antwort' },
              { title: 'Kundenzufriedenheit', value: '4.7/5', description: 'Durchschnittliche Bewertung' },
            ].map((metric) => (
              <Card key={metric.title}>
                <CardContent className="p-6 text-center">
                  <p className="text-2xl font-bold text-gray-900 mb-2">{metric.value}</p>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
