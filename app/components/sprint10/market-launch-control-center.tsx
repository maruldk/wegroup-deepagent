
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Star, 
  Globe, 
  Target,
  Handshake,
  MessageSquare,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Award,
  Building
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

interface MarketLaunchData {
  betaProgram: any;
  revenueAnalytics: any;
  partnerEcosystem: any;
  customerSuccess: any;
}

const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#FF6363', '#80D8C3'];

export default function MarketLaunchControlCenter() {
  const [data, setData] = useState<MarketLaunchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchMarketLaunchData();
    const interval = setInterval(fetchMarketLaunchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMarketLaunchData = async () => {
    try {
      const response = await fetch('/api/sprint10/market-launch-control');
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching market launch data:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <ArrowUpRight className="w-4 h-4 text-green-400" />
    ) : (
      <ArrowDownRight className="w-4 h-4 text-red-400" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-400' : 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-400"></div>
        </div>
      </div>
    );
  }

  const betaParticipantsData = [
    { name: 'Active', value: data?.betaProgram?.participants?.active || 0, color: COLORS[0] },
    { name: 'Completed', value: data?.betaProgram?.participants?.completed || 0, color: COLORS[1] },
    { name: 'Withdrawn', value: data?.betaProgram?.participants?.withdrawn || 0, color: COLORS[2] }
  ];

  const geographicData = Object.entries(data?.betaProgram?.geographicDistribution || {}).map(([name, value]) => ({
    name,
    value: (value as number) * 100,
    color: COLORS[Object.keys(data?.betaProgram?.geographicDistribution || {}).indexOf(name)]
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Market Launch Control Center
          </h1>
          <p className="text-gray-400">
            Beta Testing • Revenue Analytics • Partner Ecosystem • Customer Success
          </p>
          <div className="mt-4 flex justify-center items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Beta Program Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm">Revenue Growing</span>
            </div>
            <div className="flex items-center space-x-2">
              <Handshake className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm">Partners Integrated</span>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>Beta Participants</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {data?.betaProgram?.participants?.total.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">
                {data?.betaProgram?.participants?.active} active • {data?.betaProgram?.phase} phase
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span>Revenue</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400 mb-2">
                {formatCurrency(data?.revenueAnalytics?.currentPeriod?.revenue || 0)}
              </div>
              <div className="flex items-center space-x-1 text-sm">
                {getGrowthIcon(data?.revenueAnalytics?.currentPeriod?.growth)}
                <span className={getGrowthColor(data?.revenueAnalytics?.currentPeriod?.growth)}>
                  {data?.revenueAnalytics?.currentPeriod?.growth?.toFixed(1)}%
                </span>
                <span className="text-gray-400">vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center space-x-2">
                <Handshake className="w-5 h-5 text-purple-400" />
                <span>Active Partners</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {data?.partnerEcosystem?.activeIntegrations}
              </div>
              <div className="text-sm text-gray-400">
                {data?.partnerEcosystem?.totalPartners} total • {formatCurrency(data?.partnerEcosystem?.revenueShare)} revenue
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>Customer Satisfaction</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {data?.customerSuccess?.satisfaction?.score?.toFixed(1)}
              </div>
              <div className="text-sm text-gray-400">
                NPS: {data?.customerSuccess?.satisfaction?.nps} • {(data?.customerSuccess?.satisfaction?.csat * 100).toFixed(0)}% CSAT
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">Overview</TabsTrigger>
              <TabsTrigger value="beta" className="data-[state=active]:bg-blue-600">Beta Program</TabsTrigger>
              <TabsTrigger value="revenue" className="data-[state=active]:bg-blue-600">Revenue</TabsTrigger>
              <TabsTrigger value="partners" className="data-[state=active]:bg-blue-600">Partners</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-cyan-400" />
                      <span>Revenue Trends</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={data?.revenueAnalytics?.trends || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="period" stroke="#9CA3AF" fontSize={10} />
                        <YAxis stroke="#9CA3AF" fontSize={10} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            fontSize: 11
                          }} 
                        />
                        <Line type="monotone" dataKey="revenue" stroke="#60B5FF" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <PieChart className="w-5 h-5 text-orange-400" />
                      <span>Beta Participants</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={betaParticipantsData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {betaParticipantsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            fontSize: 11
                          }} 
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="beta" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Target className="w-5 h-5 text-green-400" />
                      <span>Program Status</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Status</span>
                      <Badge className="bg-green-600 text-white">
                        {data?.betaProgram?.programStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Phase</span>
                      <Badge className="bg-blue-600 text-white">
                        {data?.betaProgram?.phase}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Completion Rate</span>
                      <span className="text-white">{(data?.betaProgram?.engagement?.completionRate * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Avg Session</span>
                      <span className="text-white">{data?.betaProgram?.engagement?.averageSessionTime}min</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5 text-yellow-400" />
                      <span>Feedback Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Feedback</span>
                      <span className="text-white">{data?.betaProgram?.feedback?.totalFeedback}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Average Rating</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white">{data?.betaProgram?.feedback?.averageRating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">NPS Score</span>
                      <span className="text-white">{data?.betaProgram?.feedback?.npsScore}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-purple-400" />
                      <span>Geographic Distribution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {geographicData.map((region, index) => (
                        <div key={region.name} className="flex items-center justify-between">
                          <span className="text-gray-400">{region.name}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={region.value} className="h-2 w-20" />
                            <span className="text-white text-sm">{region.value.toFixed(0)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="revenue" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      <span>Revenue Breakdown</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Subscriptions</span>
                      <span className="text-green-400 font-bold">
                        {formatCurrency(data?.revenueAnalytics?.breakdown?.subscriptions || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Transactions</span>
                      <span className="text-green-400 font-bold">
                        {formatCurrency(data?.revenueAnalytics?.breakdown?.transactions || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Services</span>
                      <span className="text-green-400 font-bold">
                        {formatCurrency(data?.revenueAnalytics?.breakdown?.services || 0)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      <span>Forecasting</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Next Quarter</span>
                      <span className="text-blue-400 font-bold">
                        {formatCurrency(data?.revenueAnalytics?.forecasting?.nextQuarter || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Confidence</span>
                      <span className="text-blue-400 font-bold">
                        {(data?.revenueAnalytics?.forecasting?.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="text-gray-400 text-sm mb-2">Key Factors:</p>
                      <ul className="space-y-1">
                        {data?.revenueAnalytics?.forecasting?.factors?.map((factor: string, index: number) => (
                          <li key={index} className="text-white text-sm flex items-center space-x-2">
                            <Zap className="w-3 h-3 text-yellow-400" />
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="partners" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Building className="w-5 h-5 text-purple-400" />
                      <span>Top Partners</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data?.partnerEcosystem?.topPartners?.map((partner: any, index: number) => (
                        <motion.div
                          key={partner.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                        >
                          <div>
                            <p className="text-white font-medium">{partner.name}</p>
                            <p className="text-gray-400 text-sm">{partner.type} • {partner.integrationLevel}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-purple-400 font-bold">{formatCurrency(partner.revenue)}</p>
                            <Badge className="bg-green-600 text-white text-xs">{partner.status}</Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Award className="w-5 h-5 text-orange-400" />
                      <span>Performance Metrics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Response Time</span>
                      <span className="text-orange-400 font-bold">
                        {data?.partnerEcosystem?.performanceMetrics?.averageResponseTime}ms
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Success Rate</span>
                      <span className="text-orange-400 font-bold">
                        {(data?.partnerEcosystem?.performanceMetrics?.successRate * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Transaction Volume</span>
                      <span className="text-orange-400 font-bold">
                        {data?.partnerEcosystem?.performanceMetrics?.transactionVolume?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">New Requests</span>
                      <span className="text-orange-400 font-bold">
                        {data?.partnerEcosystem?.newPartnerRequests}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
