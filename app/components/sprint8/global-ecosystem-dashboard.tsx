
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Network, 
  Building, 
  TrendingUp, 
  Users, 
  Target, 
  Zap, 
  Link,
  MapPin,
  Activity,
  BarChart3,
  PieChart,
  Share2,
  Handshake
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, AreaChart, Area, PieChart as RechartsPieChart, Cell, BarChart, Bar } from 'recharts';

interface Partner {
  id: string;
  name: string;
  type: 'TECHNOLOGY' | 'STRATEGIC' | 'SUPPLIER' | 'DISTRIBUTOR' | 'RESEARCH';
  region: string;
  country: string;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  revenue: number;
  integrationLevel: number;
  collaborationScore: number;
}

interface Collaboration {
  id: string;
  title: string;
  partners: string[];
  type: 'JOINT_VENTURE' | 'RESEARCH' | 'PRODUCT_DEV' | 'MARKET_EXPANSION' | 'INNOVATION';
  status: 'ACTIVE' | 'PLANNING' | 'COMPLETED' | 'ON_HOLD';
  progress: number;
  value: number;
  startDate: string;
}

const globalPartners: Partner[] = [
  {
    id: 'p-001',
    name: 'TechCorp Europe',
    type: 'TECHNOLOGY',
    region: 'Europe',
    country: 'Germany',
    status: 'ACTIVE',
    revenue: 25000000,
    integrationLevel: 92,
    collaborationScore: 95
  },
  {
    id: 'p-002',
    name: 'InnovateLabs Asia',
    type: 'RESEARCH',
    region: 'Asia',
    country: 'Singapore',
    status: 'ACTIVE',
    revenue: 18000000,
    integrationLevel: 87,
    collaborationScore: 89
  },
  {
    id: 'p-003',
    name: 'Americas Supply Co',
    type: 'SUPPLIER',
    region: 'Americas',
    country: 'USA',
    status: 'ACTIVE',
    revenue: 32000000,
    integrationLevel: 94,
    collaborationScore: 91
  },
  {
    id: 'p-004',
    name: 'Distribution Plus',
    type: 'DISTRIBUTOR',
    region: 'Africa',
    country: 'South Africa',
    status: 'PENDING',
    revenue: 8500000,
    integrationLevel: 45,
    collaborationScore: 72
  }
];

const activeCollaborations: Collaboration[] = [
  {
    id: 'c-001',
    title: 'AI-Powered Supply Chain',
    partners: ['TechCorp Europe', 'Americas Supply Co'],
    type: 'INNOVATION',
    status: 'ACTIVE',
    progress: 78,
    value: 15000000,
    startDate: '2024-01-15'
  },
  {
    id: 'c-002',
    title: 'Quantum Research Initiative',
    partners: ['InnovateLabs Asia', 'TechCorp Europe'],
    type: 'RESEARCH',
    status: 'ACTIVE',
    progress: 45,
    value: 25000000,
    startDate: '2024-03-01'
  },
  {
    id: 'c-003',
    title: 'African Market Expansion',
    partners: ['Distribution Plus'],
    type: 'MARKET_EXPANSION',
    status: 'PLANNING',
    progress: 20,
    value: 12000000,
    startDate: '2024-06-01'
  }
];

const ecosystemData = [
  { month: 'Jan', revenue: 45000000, partnerships: 12, collaborations: 8 },
  { month: 'Feb', revenue: 52000000, partnerships: 15, collaborations: 10 },
  { month: 'Mar', revenue: 58000000, partnerships: 18, collaborations: 12 },
  { month: 'Apr', revenue: 64000000, partnerships: 22, collaborations: 15 },
  { month: 'May', revenue: 71000000, partnerships: 25, collaborations: 18 },
  { month: 'Jun', revenue: 78000000, partnerships: 28, collaborations: 21 }
];

const partnerTypeData = [
  { type: 'Technology', count: 35, value: 45000000 },
  { type: 'Strategic', count: 28, value: 38000000 },
  { type: 'Supplier', count: 22, value: 32000000 },
  { type: 'Distributor', count: 18, value: 25000000 },
  { type: 'Research', count: 15, value: 22000000 }
];

const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#80D8C3'];

export function GlobalEcosystemDashboard() {
  const [totalPartners, setTotalPartners] = useState(0);
  const [activeCollabs, setActiveCollabs] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [avgIntegration, setAvgIntegration] = useState(0);

  useEffect(() => {
    const partners = globalPartners.filter(p => p.status === 'ACTIVE').length;
    const collabs = activeCollaborations.filter(c => c.status === 'ACTIVE').length;
    const revenue = globalPartners.reduce((sum, p) => sum + p.revenue, 0);
    const integration = globalPartners.reduce((sum, p) => sum + p.integrationLevel, 0) / globalPartners.length;
    
    setTotalPartners(partners);
    setActiveCollabs(collabs);
    setTotalRevenue(revenue);
    setAvgIntegration(integration);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'PENDING': return 'bg-yellow-500';
      case 'PLANNING': return 'bg-blue-500';
      case 'COMPLETED': return 'bg-purple-500';
      case 'ON_HOLD': return 'bg-orange-500';
      case 'INACTIVE': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'TECHNOLOGY': return 'bg-blue-100 text-blue-800';
      case 'STRATEGIC': return 'bg-purple-100 text-purple-800';
      case 'SUPPLIER': return 'bg-green-100 text-green-800';
      case 'DISTRIBUTOR': return 'bg-orange-100 text-orange-800';
      case 'RESEARCH': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Global Ecosystem Platform
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cross-Company Collaboration Hub & Partner Network Intelligence
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Active Partners</p>
                  <p className="text-3xl font-bold text-green-900">{totalPartners}</p>
                </div>
                <Handshake className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Collaborations</p>
                  <p className="text-3xl font-bold text-blue-900">{activeCollabs}</p>
                </div>
                <Network className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Ecosystem Revenue</p>
                  <p className="text-3xl font-bold text-purple-900">
                    ${(totalRevenue / 1000000).toFixed(0)}M
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Integration Level</p>
                  <p className="text-3xl font-bold text-orange-900">{avgIntegration.toFixed(0)}%</p>
                </div>
                <Link className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="partners" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="partners">Partners</TabsTrigger>
            <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
            <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="partners" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Global Partners
                </h3>
                {globalPartners.map((partner) => (
                  <Card key={partner.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{partner.name}</h4>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {partner.country}, {partner.region}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge className={`${getStatusColor(partner.status)} text-white`}>
                            {partner.status}
                          </Badge>
                          <Badge className={getTypeColor(partner.type)}>
                            {partner.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Integration Level</span>
                            <span>{partner.integrationLevel}%</span>
                          </div>
                          <Progress value={partner.integrationLevel} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Revenue</span>
                            <p className="font-semibold">${(partner.revenue / 1000000).toFixed(1)}M</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Collaboration Score</span>
                            <p className="font-semibold">{partner.collaborationScore}/100</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Partner Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <RechartsPieChart>
                      <Tooltip formatter={(value, name) => [`${value}`, name]} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <RechartsPieChart dataKey="count" data={partnerTypeData} cx="50%" cy="50%" outerRadius={80}>
                        {partnerTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </RechartsPieChart>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="collaborations" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Active Collaborations
              </h3>
              {activeCollaborations.map((collaboration) => (
                <Card key={collaboration.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold">{collaboration.title}</h4>
                        <p className="text-sm text-gray-500">
                          Partners: {collaboration.partners.join(', ')}
                        </p>
                        <p className="text-sm text-gray-500">
                          Started: {new Date(collaboration.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Badge className={`${getStatusColor(collaboration.status)} text-white`}>
                          {collaboration.status}
                        </Badge>
                        <span className="text-lg font-bold text-green-600">
                          ${(collaboration.value / 1000000).toFixed(1)}M
                        </span>
                      </div>
                    </div>
                    
                    {collaboration.status === 'ACTIVE' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{collaboration.progress}%</span>
                        </div>
                        <Progress value={collaboration.progress} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="intelligence" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Ecosystem Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={ecosystemData}>
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line 
                        type="monotone" 
                        dataKey="partnerships" 
                        stroke="#60B5FF" 
                        strokeWidth={2}
                        name="Partnerships"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="collaborations" 
                        stroke="#FF9149" 
                        strokeWidth={2}
                        name="Collaborations"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Partner Value Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={partnerTypeData}>
                      <XAxis dataKey="type" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(value) => [`$${(Number(value) / 1000000).toFixed(1)}M`, 'Value']} />
                      <Bar dataKey="value" fill="#60B5FF" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="integration" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[
                { 
                  name: 'Data Integration', 
                  status: 'Active', 
                  level: 94, 
                  partners: 28,
                  description: 'Real-time data synchronization across all partners'
                },
                { 
                  name: 'Process Integration', 
                  status: 'Active', 
                  level: 87, 
                  partners: 22,
                  description: 'Automated workflow coordination and optimization'
                },
                { 
                  name: 'API Integration', 
                  status: 'Active', 
                  level: 91, 
                  partners: 35,
                  description: 'Seamless API connectivity and management'
                },
                { 
                  name: 'Supply Chain Integration', 
                  status: 'In Progress', 
                  level: 73, 
                  partners: 18,
                  description: 'End-to-end supply chain visibility and coordination'
                },
                { 
                  name: 'Financial Integration', 
                  status: 'Active', 
                  level: 89, 
                  partners: 25,
                  description: 'Integrated financial reporting and transactions'
                },
                { 
                  name: 'AI Model Integration', 
                  status: 'Beta', 
                  level: 65, 
                  partners: 12,
                  description: 'Shared AI models and collaborative learning'
                }
              ].map((integration, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-base">{integration.name}</CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Integration Level</span>
                        <span>{integration.level}%</span>
                      </div>
                      <Progress value={integration.level} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Partners</span>
                      <span className="text-sm font-semibold">{integration.partners}</span>
                    </div>
                    
                    <Badge className={`${getStatusColor(integration.status)} text-white w-full justify-center`}>
                      {integration.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Revenue Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={ecosystemData}>
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(value) => [`$${(Number(value) / 1000000).toFixed(1)}M`, 'Revenue']} />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#60B5FF" 
                        fill="#60B5FF" 
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Ecosystem Health Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Partner Satisfaction</span>
                        <span>96%</span>
                      </div>
                      <Progress value={96} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Collaboration Efficiency</span>
                        <span>89%</span>
                      </div>
                      <Progress value={89} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Data Quality</span>
                        <span>93%</span>
                      </div>
                      <Progress value={93} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>System Reliability</span>
                        <span>99.2%</span>
                      </div>
                      <Progress value={99.2} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Innovation Index</span>
                        <span>87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
