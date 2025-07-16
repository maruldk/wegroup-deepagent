
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const salesData = [
  { name: "Jan", umsatz: 2400, kosten: 1800 },
  { name: "Feb", umsatz: 1398, kosten: 1200 },
  { name: "Mar", umsatz: 9800, kosten: 7200 },
  { name: "Apr", umsatz: 3908, kosten: 2800 },
  { name: "Mai", umsatz: 4800, kosten: 3200 },
  { name: "Jun", umsatz: 3800, kosten: 2600 },
]

const performanceData = [
  { name: "Mo", requests: 4000, responseTime: 240 },
  { name: "Di", requests: 3000, responseTime: 220 },
  { name: "Mi", requests: 2000, responseTime: 200 },
  { name: "Do", requests: 2780, responseTime: 280 },
  { name: "Fr", requests: 1890, responseTime: 250 },
  { name: "Sa", requests: 2390, responseTime: 210 },
  { name: "So", requests: 3490, responseTime: 190 },
]

const moduleUsageData = [
  { name: "HR", value: 35, color: "#60B5FF" },
  { name: "Logistik", value: 28, color: "#FF9149" },
  { name: "Finanzen", value: 22, color: "#FF9898" },
  { name: "weCREATE", value: 10, color: "#80D8C3" },
  { name: "weSELL", value: 5, color: "#A19AD3" },
]

export function ChartGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Sales Trend */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            Umsatz vs. Kosten Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10 }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ fontSize: 11 }}
              />
              <Legend 
                verticalAlign="top"
                wrapperStyle={{ fontSize: 11 }}
              />
              <Line 
                type="monotone" 
                dataKey="umsatz" 
                stroke="#60B5FF" 
                strokeWidth={2}
                name="Umsatz (€)"
              />
              <Line 
                type="monotone" 
                dataKey="kosten" 
                stroke="#FF9149" 
                strokeWidth={2}
                name="Kosten (€)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Module Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Modul-Nutzung</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={moduleUsageData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {moduleUsageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ fontSize: 11 }}
              />
              <Legend 
                verticalAlign="top"
                wrapperStyle={{ fontSize: 11 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* System Performance */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>System Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name"
                tick={{ fontSize: 10 }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ fontSize: 11 }}
              />
              <Legend
                verticalAlign="top"
                wrapperStyle={{ fontSize: 11 }}
              />
              <Area 
                type="monotone" 
                dataKey="requests" 
                stackId="1"
                stroke="#72BF78" 
                fill="#72BF78"
                fillOpacity={0.6}
                name="Requests"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Response Time */}
      <Card>
        <CardHeader>
          <CardTitle>Response Times</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name"
                tick={{ fontSize: 10 }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ fontSize: 11 }}
              />
              <Bar 
                dataKey="responseTime" 
                fill="#FF90BB"
                name="Response Time (ms)"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
