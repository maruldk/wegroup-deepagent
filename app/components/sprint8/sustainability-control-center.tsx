
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Leaf, 
  Recycle, 
  Zap, 
  Droplets, 
  Cloud, 
  TreePine, 
  Shield, 
  TrendingDown,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, AreaChart, Area, PieChart as RechartsPieChart, Cell, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

interface CarbonFootprint {
  id: string;
  source: string;
  category: 'ENERGY' | 'TRANSPORT' | 'MANUFACTURING' | 'WASTE' | 'SUPPLY_CHAIN';
  emissions: number; // tons CO2
  reduction_target: number;
  current_reduction: number;
  cost_per_ton: number;
}

interface ESGMetric {
  id: string;
  category: 'ENVIRONMENTAL' | 'SOCIAL' | 'GOVERNANCE';
  metric_name: string;
  current_score: number;
  target_score: number;
  industry_benchmark: number;
  compliance_status: 'COMPLIANT' | 'AT_RISK' | 'NON_COMPLIANT';
}

interface SustainabilityProject {
  id: string;
  name: string;
  type: 'RENEWABLE_ENERGY' | 'WASTE_REDUCTION' | 'WATER_CONSERVATION' | 'GREEN_SUPPLY_CHAIN' | 'CARBON_OFFSET';
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  progress: number;
  investment: number;
  co2_reduction: number;
  roi_timeline: string;
}

const carbonSources: CarbonFootprint[] = [
  {
    id: 'cf-001',
    source: 'Data Centers',
    category: 'ENERGY',
    emissions: 1250,
    reduction_target: 40,
    current_reduction: 28,
    cost_per_ton: 85
  },
  {
    id: 'cf-002',
    source: 'Corporate Fleet',
    category: 'TRANSPORT',
    emissions: 890,
    reduction_target: 50,
    current_reduction: 35,
    cost_per_ton: 120
  },
  {
    id: 'cf-003',
    source: 'Manufacturing',
    category: 'MANUFACTURING',
    emissions: 2100,
    reduction_target: 35,
    current_reduction: 42,
    cost_per_ton: 95
  },
  {
    id: 'cf-004',
    source: 'Supply Chain',
    category: 'SUPPLY_CHAIN',
    emissions: 1680,
    reduction_target: 30,
    current_reduction: 18,
    cost_per_ton: 110
  }
];

const esgMetrics: ESGMetric[] = [
  {
    id: 'esg-001',
    category: 'ENVIRONMENTAL',
    metric_name: 'Carbon Intensity',
    current_score: 78,
    target_score: 85,
    industry_benchmark: 65,
    compliance_status: 'COMPLIANT'
  },
  {
    id: 'esg-002',
    category: 'ENVIRONMENTAL',
    metric_name: 'Renewable Energy %',
    current_score: 65,
    target_score: 80,
    industry_benchmark: 45,
    compliance_status: 'AT_RISK'
  },
  {
    id: 'esg-003',
    category: 'SOCIAL',
    metric_name: 'Employee Satisfaction',
    current_score: 82,
    target_score: 85,
    industry_benchmark: 72,
    compliance_status: 'COMPLIANT'
  },
  {
    id: 'esg-004',
    category: 'GOVERNANCE',
    metric_name: 'Board Diversity',
    current_score: 45,
    target_score: 50,
    industry_benchmark: 38,
    compliance_status: 'AT_RISK'
  }
];

const sustainabilityProjects: SustainabilityProject[] = [
  {
    id: 'sp-001',
    name: 'Solar Panel Installation',
    type: 'RENEWABLE_ENERGY',
    status: 'IN_PROGRESS',
    progress: 73,
    investment: 2500000,
    co2_reduction: 450,
    roi_timeline: '4-5 years'
  },
  {
    id: 'sp-002',
    name: 'Waste Reduction Initiative',
    type: 'WASTE_REDUCTION',
    status: 'COMPLETED',
    progress: 100,
    investment: 800000,
    co2_reduction: 280,
    roi_timeline: '2-3 years'
  },
  {
    id: 'sp-003',
    name: 'Green Supply Chain Program',
    type: 'GREEN_SUPPLY_CHAIN',
    status: 'PLANNING',
    progress: 15,
    investment: 1800000,
    co2_reduction: 650,
    roi_timeline: '5-6 years'
  }
];

const emissionsData = [
  { month: 'Jan', total: 5920, target: 5500, offset: 200 },
  { month: 'Feb', total: 5780, target: 5400, offset: 250 },
  { month: 'Mar', total: 5650, target: 5300, offset: 300 },
  { month: 'Apr', total: 5420, target: 5200, offset: 320 },
  { month: 'May', total: 5280, target: 5100, offset: 380 },
  { month: 'Jun', total: 5150, target: 5000, offset: 420 }
];

const categoryEmissions = [
  { category: 'Energy', emissions: 2100, percentage: 35 },
  { category: 'Manufacturing', emissions: 1680, percentage: 28 },
  { category: 'Transport', frequencies: 1250, percentage: 21 },
  { category: 'Supply Chain', emissions: 890, percentage: 15 },
  { category: 'Waste', emissions: 80, percentage: 1 }
];

const esgRadarData = [
  { metric: 'Carbon Footprint', current: 78, target: 85, industry: 65 },
  { metric: 'Renewable Energy', current: 65, target: 80, industry: 45 },
  { metric: 'Waste Management', current: 82, target: 85, industry: 60 },
  { metric: 'Water Usage', current: 75, target: 80, industry: 55 },
  { metric: 'Biodiversity', current: 70, target: 75, industry: 50 },
  { metric: 'Social Impact', current: 85, target: 90, industry: 70 }
];

const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#80D8C3', '#A19AD3'];

export function SustainabilityControlCenter() {
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [reductionProgress, setReductionProgress] = useState(0);
  const [complianceScore, setComplianceScore] = useState(0);
  const [greenInvestment, setGreenInvestment] = useState(0);

  useEffect(() => {
    const emissions = carbonSources.reduce((sum, source) => sum + source.emissions, 0);
    const avgReduction = carbonSources.reduce((sum, source) => sum + source.current_reduction, 0) / carbonSources.length;
    const avgScore = esgMetrics.reduce((sum, metric) => sum + metric.current_score, 0) / esgMetrics.length;
    const investment = sustainabilityProjects.reduce((sum, project) => sum + project.investment, 0);
    
    setTotalEmissions(emissions);
    setReductionProgress(avgReduction);
    setComplianceScore(avgScore);
    setGreenInvestment(investment);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500';
      case 'IN_PROGRESS': return 'bg-blue-500';
      case 'PLANNING': return 'bg-yellow-500';
      case 'DELAYED': return 'bg-red-500';
      case 'COMPLIANT': return 'bg-green-500';
      case 'AT_RISK': return 'bg-yellow-500';
      case 'NON_COMPLIANT': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ENERGY': return 'bg-yellow-100 text-yellow-800';
      case 'TRANSPORT': return 'bg-blue-100 text-blue-800';
      case 'MANUFACTURING': return 'bg-purple-100 text-purple-800';
      case 'WASTE': return 'bg-green-100 text-green-800';
      case 'SUPPLY_CHAIN': return 'bg-orange-100 text-orange-800';
      case 'ENVIRONMENTAL': return 'bg-green-100 text-green-800';
      case 'SOCIAL': return 'bg-blue-100 text-blue-800';
      case 'GOVERNANCE': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Sustainability Control Center
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time ESG Compliance & Environmental Impact Optimization
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
                  <p className="text-sm font-medium text-green-600">Total Emissions</p>
                  <p className="text-3xl font-bold text-green-900">{(totalEmissions / 1000).toFixed(1)}K</p>
                  <p className="text-xs text-green-600">tons CO2</p>
                </div>
                <Cloud className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Reduction Progress</p>
                  <p className="text-3xl font-bold text-blue-900">{reductionProgress.toFixed(0)}%</p>
                </div>
                <TrendingDown className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">ESG Score</p>
                  <p className="text-3xl font-bold text-purple-900">{complianceScore.toFixed(0)}/100</p>
                </div>
                <Shield className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Green Investment</p>
                  <p className="text-3xl font-bold text-orange-900">
                    ${(greenInvestment / 1000000).toFixed(1)}M
                  </p>
                </div>
                <Target className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="carbon" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="carbon">Carbon Footprint</TabsTrigger>
            <TabsTrigger value="esg">ESG Compliance</TabsTrigger>
            <TabsTrigger value="projects">Green Projects</TabsTrigger>
            <TabsTrigger value="metrics">Sustainability KPIs</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>

          <TabsContent value="carbon" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Carbon Emission Sources
                </h3>
                {carbonSources.map((source) => (
                  <Card key={source.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{source.source}</h4>
                          <p className="text-sm text-gray-500">
                            {source.emissions} tons CO2 | ${source.cost_per_ton}/ton
                          </p>
                        </div>
                        <Badge className={getCategoryColor(source.category)}>
                          {source.category}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Reduction Progress</span>
                            <span>{source.current_reduction}% / {source.reduction_target}%</span>
                          </div>
                          <Progress value={(source.current_reduction / source.reduction_target) * 100} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5" />
                    Emissions Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={emissionsData}>
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Area 
                        type="monotone" 
                        dataKey="total" 
                        stackId="1" 
                        stroke="#FF9149" 
                        fill="#FF9149" 
                        fillOpacity={0.6}
                        name="Total Emissions"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="target" 
                        stackId="2" 
                        stroke="#60B5FF" 
                        fill="#60B5FF" 
                        fillOpacity={0.4}
                        name="Target Emissions"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="offset" 
                        stackId="3" 
                        stroke="#80D8C3" 
                        fill="#80D8C3" 
                        fillOpacity={0.3}
                        name="Carbon Offset"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="esg" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5" />
                ESG Compliance Dashboard
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {esgMetrics.map((metric) => (
                  <Card key={metric.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{metric.metric_name}</h4>
                          <Badge className={getCategoryColor(metric.category)}>
                            {metric.category}
                          </Badge>
                        </div>
                        <Badge className={`${getStatusColor(metric.compliance_status)} text-white`}>
                          {metric.compliance_status === 'COMPLIANT' ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <AlertTriangle className="h-3 w-3" />
                          )}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Current</span>
                          <span className="font-semibold">{metric.current_score}</span>
                        </div>
                        <Progress value={(metric.current_score / 100) * 100} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Target: {metric.target_score}</span>
                          <span>Industry: {metric.industry_benchmark}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <TreePine className="h-5 w-5" />
                Sustainability Projects
              </h3>
              {sustainabilityProjects.map((project) => (
                <Card key={project.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold">{project.name}</h4>
                        <p className="text-sm text-gray-500">
                          Investment: ${(project.investment / 1000000).toFixed(1)}M | 
                          CO2 Reduction: {project.co2_reduction} tons/year
                        </p>
                        <p className="text-sm font-medium text-green-600 mt-1">
                          ROI Timeline: {project.roi_timeline}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(project.status)} text-white`}>
                        {project.status}
                      </Badge>
                    </div>
                    
                    {project.status !== 'COMPLETED' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
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
                    ESG Performance Radar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={esgRadarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 8 }} />
                      <Radar 
                        name="Current" 
                        dataKey="current" 
                        stroke="#60B5FF" 
                        fill="#60B5FF" 
                        fillOpacity={0.6} 
                      />
                      <Radar 
                        name="Target" 
                        dataKey="target" 
                        stroke="#80D8C3" 
                        fill="#80D8C3" 
                        fillOpacity={0.3} 
                      />
                      <Radar 
                        name="Industry" 
                        dataKey="industry" 
                        stroke="#FF9149" 
                        fill="#FF9149" 
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
                    Sustainability KPIs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { kpi: 'Energy Efficiency', current: 87, target: 90, unit: '%' },
                    { kpi: 'Renewable Energy Usage', current: 65, target: 80, unit: '%' },
                    { kpi: 'Waste Diversion Rate', current: 73, target: 85, unit: '%' },
                    { kpi: 'Water Conservation', current: 82, target: 85, unit: '%' },
                    { kpi: 'Supplier ESG Compliance', current: 76, target: 90, unit: '%' },
                    { kpi: 'Employee Engagement', current: 88, target: 90, unit: '%' }
                  ].map((kpi, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{kpi.kpi}</span>
                        <span className="text-sm font-semibold">
                          {kpi.current}{kpi.unit} / {kpi.target}{kpi.unit}
                        </span>
                      </div>
                      <Progress value={(kpi.current / kpi.target) * 100} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[
                {
                  title: 'Energy Optimization',
                  description: 'AI-powered energy usage optimization',
                  potential_savings: '25%',
                  implementation_cost: '$500K',
                  payback_period: '18 months',
                  status: 'Recommended'
                },
                {
                  title: 'Supply Chain Greening',
                  description: 'Sustainable supplier network optimization',
                  potential_savings: '15%',
                  implementation_cost: '$1.2M',
                  payback_period: '3 years',
                  status: 'In Progress'
                },
                {
                  title: 'Circular Economy Initiative',
                  description: 'Waste-to-resource conversion program',
                  potential_savings: '30%',
                  implementation_cost: '$800K',
                  payback_period: '2.5 years',
                  status: 'Planning'
                },
                {
                  title: 'Carbon Capture Technology',
                  description: 'Direct air capture and storage',
                  potential_savings: '40%',
                  implementation_cost: '$2.5M',
                  payback_period: '5 years',
                  status: 'Evaluating'
                },
                {
                  title: 'Green Building Retrofit',
                  description: 'Smart building energy management',
                  potential_savings: '20%',
                  implementation_cost: '$1.8M',
                  payback_period: '4 years',
                  status: 'Recommended'
                },
                {
                  title: 'Biodiversity Program',
                  description: 'Ecosystem restoration and protection',
                  potential_savings: '10%',
                  implementation_cost: '$600K',
                  payback_period: '7 years',
                  status: 'Future'
                }
              ].map((optimization, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-base">{optimization.title}</CardTitle>
                    <CardDescription>{optimization.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Savings</span>
                        <p className="font-semibold text-green-600">{optimization.potential_savings}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Cost</span>
                        <p className="font-semibold">{optimization.implementation_cost}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Payback</span>
                        <p className="font-semibold">{optimization.payback_period}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Status</span>
                        <Badge className={
                          optimization.status === 'Recommended' ? 'bg-green-100 text-green-800' :
                          optimization.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          optimization.status === 'Planning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {optimization.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
