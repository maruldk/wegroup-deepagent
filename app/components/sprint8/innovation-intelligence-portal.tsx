
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lightbulb, 
  Rocket, 
  Target, 
  TrendingUp, 
  Zap, 
  Brain, 
  Search, 
  BarChart3,
  PieChart,
  Activity,
  Sparkles,
  Trophy,
  ArrowRight,
  DollarSign,
  Users
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, AreaChart, Area, PieChart as RechartsPieChart, Cell, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

interface BusinessModel {
  id: string;
  name: string;
  type: 'SAAS' | 'MARKETPLACE' | 'SUBSCRIPTION' | 'FREEMIUM' | 'ECOSYSTEM' | 'PLATFORM';
  category: string;
  status: 'CONCEPTUAL' | 'PROTOTYPING' | 'TESTING' | 'SCALING' | 'LAUNCHED';
  revenue_potential: number;
  implementation_score: number;
  market_fit: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  ai_confidence: number;
}

interface InnovationPipeline {
  id: string;
  project_name: string;
  stage: 'IDEATION' | 'RESEARCH' | 'DEVELOPMENT' | 'TESTING' | 'DEPLOYMENT';
  progress: number;
  investment: number;
  team_size: number;
  expected_roi: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface MarketOpportunity {
  id: string;
  market_name: string;
  size: number;
  growth_rate: number;
  competition_level: 'LOW' | 'MEDIUM' | 'HIGH';
  entry_barrier: 'LOW' | 'MEDIUM' | 'HIGH';
  ai_recommendation: number;
  timeframe: string;
}

const businessModels: BusinessModel[] = [
  {
    id: 'bm-001',
    name: 'AI-Powered Analytics Platform',
    type: 'SAAS',
    category: 'Enterprise Software',
    status: 'TESTING',
    revenue_potential: 50000000,
    implementation_score: 87,
    market_fit: 92,
    risk_level: 'MEDIUM',
    ai_confidence: 89
  },
  {
    id: 'bm-002',
    name: 'Quantum Computing Marketplace',
    type: 'MARKETPLACE',
    category: 'Technology Infrastructure',
    status: 'PROTOTYPING',
    revenue_potential: 120000000,
    implementation_score: 73,
    market_fit: 85,
    risk_level: 'HIGH',
    ai_confidence: 78
  },
  {
    id: 'bm-003',
    name: 'Sustainability Insights Subscription',
    type: 'SUBSCRIPTION',
    category: 'ESG & Compliance',
    status: 'SCALING',
    revenue_potential: 35000000,
    implementation_score: 94,
    market_fit: 88,
    risk_level: 'LOW',
    ai_confidence: 95
  }
];

const innovationPipeline: InnovationPipeline[] = [
  {
    id: 'ip-001',
    project_name: 'Quantum-Enhanced ML Models',
    stage: 'DEVELOPMENT',
    progress: 68,
    investment: 2500000,
    team_size: 12,
    expected_roi: 4.5,
    priority: 'CRITICAL'
  },
  {
    id: 'ip-002',
    project_name: 'Autonomous Supply Chain',
    stage: 'TESTING',
    progress: 82,
    investment: 1800000,
    team_size: 8,
    expected_roi: 3.2,
    priority: 'HIGH'
  },
  {
    id: 'ip-003',
    project_name: 'Personalized Customer Experience Engine',
    stage: 'DEPLOYMENT',
    progress: 95,
    investment: 1200000,
    team_size: 6,
    expected_roi: 5.8,
    priority: 'HIGH'
  }
];

const marketOpportunities: MarketOpportunity[] = [
  {
    id: 'mo-001',
    market_name: 'AI-Powered Financial Services',
    size: 240000000,
    growth_rate: 28.5,
    competition_level: 'MEDIUM',
    entry_barrier: 'HIGH',
    ai_recommendation: 87,
    timeframe: '6-12 months'
  },
  {
    id: 'mo-002',
    market_name: 'Quantum Security Solutions',
    size: 180000000,
    growth_rate: 45.2,
    competition_level: 'LOW',
    entry_barrier: 'HIGH',
    ai_recommendation: 92,
    timeframe: '12-18 months'
  },
  {
    id: 'mo-003',
    market_name: 'Sustainable Technology Platform',
    size: 95000000,
    growth_rate: 32.1,
    competition_level: 'MEDIUM',
    entry_barrier: 'MEDIUM',
    ai_recommendation: 84,
    timeframe: '3-6 months'
  }
];

const innovationMetrics = [
  { month: 'Jan', ideas: 45, prototypes: 12, launched: 3, revenue: 2.4 },
  { month: 'Feb', ideas: 52, prototypes: 15, launched: 4, revenue: 3.1 },
  { month: 'Mar', ideas: 48, prototypes: 18, launched: 5, revenue: 4.2 },
  { month: 'Apr', ideas: 61, prototypes: 22, launched: 6, revenue: 5.8 },
  { month: 'May', ideas: 58, prototypes: 25, launched: 8, revenue: 7.5 },
  { month: 'Jun', ideas: 67, prototypes: 28, launched: 10, revenue: 9.2 }
];

const competitorAnalysis = [
  { category: 'Innovation Speed', us: 85, competitor1: 72, competitor2: 68, industry: 65 },
  { category: 'Technology Stack', us: 92, competitor1: 78, competitor2: 81, industry: 70 },
  { category: 'Market Share', us: 78, competitor1: 85, competitor2: 73, industry: 60 },
  { category: 'Customer Satisfaction', us: 91, competitor1: 76, competitor2: 79, industry: 72 },
  { category: 'Investment in R&D', us: 88, competitor1: 71, competitor2: 74, industry: 65 },
  { category: 'AI Adoption', us: 95, competitor1: 68, competitor2: 71, industry: 55 }
];

const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#80D8C3'];

export function InnovationIntelligencePortal() {
  const [totalProjects, setTotalProjects] = useState(0);
  const [avgROI, setAvgROI] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [successRate, setSuccessRate] = useState(0);

  useEffect(() => {
    const projects = innovationPipeline.length;
    const roi = innovationPipeline.reduce((sum, p) => sum + p.expected_roi, 0) / innovationPipeline.length;
    const investment = innovationPipeline.reduce((sum, p) => sum + p.investment, 0);
    const success = 87.5; // Calculated success rate
    
    setTotalProjects(projects);
    setAvgROI(roi);
    setTotalInvestment(investment);
    setSuccessRate(success);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LAUNCHED': return 'bg-green-500';
      case 'SCALING': return 'bg-blue-500';
      case 'TESTING': return 'bg-yellow-500';
      case 'DEPLOYMENT': return 'bg-green-500';
      case 'DEVELOPMENT': return 'bg-blue-500';
      case 'PROTOTYPING': return 'bg-orange-500';
      case 'CONCEPTUAL': return 'bg-gray-500';
      case 'IDEATION': return 'bg-purple-500';
      case 'RESEARCH': return 'bg-indigo-500';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl">
              <Lightbulb className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Innovation Intelligence Portal
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI-Generated Business Models & Market Opportunity Discovery Engine
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Active Projects</p>
                  <p className="text-3xl font-bold text-purple-900">{totalProjects}</p>
                </div>
                <Rocket className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Average ROI</p>
                  <p className="text-3xl font-bold text-green-900">{avgROI.toFixed(1)}x</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Investment</p>
                  <p className="text-3xl font-bold text-blue-900">
                    ${(totalInvestment / 1000000).toFixed(1)}M
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Success Rate</p>
                  <p className="text-3xl font-bold text-orange-900">{successRate}%</p>
                </div>
                <Trophy className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="models" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="models">Business Models</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="competitive">Competitive</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="models" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Generated Business Models
              </h3>
              {businessModels.map((model) => (
                <Card key={model.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold">{model.name}</h4>
                        <p className="text-sm text-gray-500">{model.category}</p>
                        <p className="text-sm font-medium text-green-600 mt-1">
                          Revenue Potential: ${(model.revenue_potential / 1000000).toFixed(0)}M
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={`${getStatusColor(model.status)} text-white`}>
                          {model.status}
                        </Badge>
                        <Badge className={getRiskColor(model.risk_level)}>
                          {model.risk_level} Risk
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Implementation Score</span>
                          <span>{model.implementation_score}%</span>
                        </div>
                        <Progress value={model.implementation_score} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Market Fit</span>
                          <span>{model.market_fit}%</span>
                        </div>
                        <Progress value={model.market_fit} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>AI Confidence</span>
                          <span>{model.ai_confidence}%</span>
                        </div>
                        <Progress value={model.ai_confidence} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Target className="h-5 w-5" />
                Innovation Pipeline
              </h3>
              {innovationPipeline.map((project) => (
                <Card key={project.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold">{project.project_name}</h4>
                        <p className="text-sm text-gray-500">
                          Investment: ${(project.investment / 1000000).toFixed(1)}M | Team: {project.team_size} people
                        </p>
                        <p className="text-sm font-medium text-green-600 mt-1">
                          Expected ROI: {project.expected_roi}x
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={`${getStatusColor(project.stage)} text-white`}>
                          {project.stage}
                        </Badge>
                        <Badge className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Search className="h-5 w-5" />
                Market Opportunities
              </h3>
              {marketOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold">{opportunity.market_name}</h4>
                        <p className="text-sm text-gray-500">
                          Market Size: ${(opportunity.size / 1000000).toFixed(0)}M | Growth: {opportunity.growth_rate}%
                        </p>
                        <p className="text-sm font-medium text-blue-600 mt-1">
                          Entry Timeframe: {opportunity.timeframe}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {opportunity.ai_recommendation}%
                          </div>
                          <div className="text-xs text-gray-500">AI Recommendation</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Competition</span>
                        <Badge className={getRiskColor(opportunity.competition_level)}>
                          {opportunity.competition_level}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Entry Barrier</span>
                        <Badge className={getRiskColor(opportunity.entry_barrier)}>
                          {opportunity.entry_barrier}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="competitive" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Competitive Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <RadarChart data={competitorAnalysis}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" tick={{ fontSize: 9 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 8 }} />
                      <Radar 
                        name="WeGroup" 
                        dataKey="us" 
                        stroke="#60B5FF" 
                        fill="#60B5FF" 
                        fillOpacity={0.6} 
                      />
                      <Radar 
                        name="Competitor A" 
                        dataKey="competitor1" 
                        stroke="#FF9149" 
                        fill="#FF9149" 
                        fillOpacity={0.3} 
                      />
                      <Radar 
                        name="Industry Avg" 
                        dataKey="industry" 
                        stroke="#80D8C3" 
                        fill="#80D8C3" 
                        fillOpacity={0.2} 
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Competitive Advantages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { advantage: 'AI Integration Depth', score: 95, description: 'Advanced AI across all business functions' },
                    { advantage: 'Quantum Computing Access', score: 100, description: 'Exclusive quantum processing capabilities' },
                    { advantage: 'Innovation Speed', score: 85, description: 'Rapid prototyping and deployment' },
                    { advantage: 'Ecosystem Integration', score: 92, description: 'Seamless partner network connectivity' },
                    { advantage: 'Sustainability Focus', score: 88, description: 'Industry-leading ESG initiatives' }
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium">{item.advantage}</span>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                        <span className="font-bold text-green-600">{item.score}%</span>
                      </div>
                      <Progress value={item.score} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
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
                    Innovation Metrics Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={innovationMetrics}>
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line 
                        type="monotone" 
                        dataKey="ideas" 
                        stroke="#60B5FF" 
                        strokeWidth={2}
                        name="Ideas Generated"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="prototypes" 
                        stroke="#FF9149" 
                        strokeWidth={2}
                        name="Prototypes"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="launched" 
                        stroke="#80D8C3" 
                        strokeWidth={2}
                        name="Launched"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Innovation ROI Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={innovationMetrics}>
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(value) => [`$${value}M`, 'Revenue']} />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#FF90BB" 
                        fill="#FF90BB" 
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
