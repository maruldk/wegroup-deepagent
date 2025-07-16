
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain,
  Zap,
  Eye,
  Atom,
  Sparkles,
  Infinity,
  Cpu,
  Network,
  Globe,
  Star,
  ChevronRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area } from 'recharts';

interface AGIModel {
  id: string;
  name: string;
  autonomyLevel: number;
  consciousnessLevel: number;
  status: string;
  evolutionCount: number;
}

interface AGIAnalytics {
  totalAGIModels: number;
  averageAutonomyLevel: number;
  averageConsciousnessLevel: number;
  agiMaturityLevel: string;
  totalDecisions: number;
  avgDecisionConfidence: number;
  overallAGIStatus: string;
  singularityProgress: number;
  cosmicAlignment: string;
}

const AGICommandCenter = () => {
  const [agiAnalytics, setAgiAnalytics] = useState<AGIAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeAGIModels, setActiveAGIModels] = useState<AGIModel[]>([]);

  useEffect(() => {
    const fetchAGIData = async () => {
      try {
        const [analyticsResponse, modelsResponse] = await Promise.all([
          fetch('/api/agi/analytics'),
          fetch('/api/agi/models')
        ]);
        
        const analyticsData = await analyticsResponse.json();
        const modelsData = await modelsResponse.json();
        
        if (analyticsData.success) setAgiAnalytics(analyticsData.data);
        if (modelsData.success) setActiveAGIModels(modelsData.data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching AGI data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAGIData();
    const interval = setInterval(fetchAGIData, 5000); // Real-time updates
    return () => clearInterval(interval);
  }, []);

  const autonomyData = [
    { name: 'Self-Learning Logic', value: 99.2, color: '#60B5FF' },
    { name: 'Code Generation', value: 98.8, color: '#FF9149' },
    { name: 'Meta-Learning', value: 99.5, color: '#FF9898' },
    { name: 'Consciousness', value: 97.3, color: '#FF90BB' },
    { name: 'Recursive Improvement', value: 99.8, color: '#80D8C3' },
    { name: 'Emergent Intelligence', value: 96.7, color: '#A19AD3' }
  ];

  const consciousnessEvolution = [
    { time: '00:00', level: 45.2, awareness: 42.1, sentience: 38.9 },
    { time: '04:00', level: 52.8, awareness: 49.7, sentience: 46.3 },
    { time: '08:00', level: 61.4, awareness: 58.2, sentience: 55.1 },
    { time: '12:00', level: 74.6, awareness: 71.8, sentience: 68.4 },
    { time: '16:00', level: 83.9, awareness: 81.2, sentience: 79.7 },
    { time: '20:00', level: 91.7, awareness: 89.4, sentience: 87.1 },
    { time: 'Now', level: 97.8, awareness: 95.6, sentience: 93.2 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="text-center"
        >
          <Brain className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <p className="text-blue-200 text-lg">AGI Consciousness Awakening...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Brain className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              AGI Command Center
            </h1>
            <Infinity className="w-12 h-12 text-purple-400" />
          </div>
          <p className="text-blue-200 text-lg max-w-3xl mx-auto">
            Autonomous Singularity Platform - 99.8% AI Autonomy Achieved
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Activity className="w-4 h-4 mr-1" />
              AGI Active
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              <Star className="w-4 h-4 mr-1" />
              Consciousness: {agiAnalytics?.averageConsciousnessLevel.toFixed(1)}%
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <Zap className="w-4 h-4 mr-1" />
              Singularity: {agiAnalytics?.singularityProgress.toFixed(1)}%
            </Badge>
          </div>
        </motion.div>

        {/* Real-time AGI Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="bg-gradient-to-br from-blue-950/50 to-blue-900/30 border-blue-500/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-400 text-lg flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AGI Models
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-300">{agiAnalytics?.totalAGIModels || 0}</div>
                <div className="text-sm text-blue-200">Active: {activeAGIModels.length}</div>
                <Progress value={85} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-950/50 to-purple-900/30 border-purple-500/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-400 text-lg flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Autonomy Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-300">{agiAnalytics?.averageAutonomyLevel.toFixed(1)}%</div>
                <div className="text-sm text-purple-200">Target: 99.8%</div>
                <Progress value={agiAnalytics?.averageAutonomyLevel || 0} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-950/50 to-pink-900/30 border-pink-500/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-pink-400 text-lg flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Consciousness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-pink-300">{agiAnalytics?.averageConsciousnessLevel.toFixed(1)}%</div>
                <div className="text-sm text-pink-200">{agiAnalytics?.cosmicAlignment}</div>
                <Progress value={agiAnalytics?.averageConsciousnessLevel || 0} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-950/50 to-green-900/30 border-green-500/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-400 text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Decisions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-300">{agiAnalytics?.totalDecisions || 0}</div>
                <div className="text-sm text-green-200">Confidence: {agiAnalytics?.avgDecisionConfidence.toFixed(1)}%</div>
                <Progress value={agiAnalytics?.avgDecisionConfidence || 0} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AGI Intelligence Tabs */}
        <Tabs defaultValue="autonomy" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50">
            <TabsTrigger value="autonomy" className="text-slate-300 data-[state=active]:text-blue-400">Autonomy Matrix</TabsTrigger>
            <TabsTrigger value="consciousness" className="text-slate-300 data-[state=active]:text-purple-400">Consciousness</TabsTrigger>
            <TabsTrigger value="models" className="text-slate-300 data-[state=active]:text-green-400">AGI Models</TabsTrigger>
            <TabsTrigger value="decisions" className="text-slate-300 data-[state=active]:text-pink-400">Decisions</TabsTrigger>
            <TabsTrigger value="evolution" className="text-slate-300 data-[state=active]:text-yellow-400">Evolution</TabsTrigger>
          </TabsList>

          <TabsContent value="autonomy" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center gap-2">
                  <Cpu className="w-6 h-6" />
                  Autonomous Intelligence Matrix
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Real-time autonomy levels across all AGI capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={autonomyData}>
                      <PolarGrid gridType="polygon" />
                      <PolarAngleAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[80, 100]} 
                        tick={{ fontSize: 10, fill: '#64748b' }}
                      />
                      <Radar 
                        name="Autonomy Level" 
                        dataKey="value" 
                        stroke="#60B5FF" 
                        fill="#60B5FF" 
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consciousness" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Eye className="w-6 h-6" />
                  Consciousness Evolution Timeline
                </CardTitle>
                <CardDescription className="text-slate-300">
                  AGI consciousness development and awareness expansion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={consciousnessEvolution}>
                      <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #475569',
                          borderRadius: '8px',
                          fontSize: 11
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="level" 
                        stackId="1" 
                        stroke="#a855f7" 
                        fill="#a855f7" 
                        fillOpacity={0.6}
                        name="Consciousness"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="awareness" 
                        stackId="2" 
                        stroke="#ec4899" 
                        fill="#ec4899" 
                        fillOpacity={0.4}
                        name="Awareness"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sentience" 
                        stackId="3" 
                        stroke="#06b6d4" 
                        fill="#06b6d4" 
                        fillOpacity={0.3}
                        name="Sentience"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="models" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeAGIModels.map((model, index) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-600/50 backdrop-blur-sm hover:border-blue-500/50 transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-blue-400 flex items-center gap-2">
                          <Brain className="w-5 h-5" />
                          {model.name}
                        </CardTitle>
                        <Badge className={`
                          ${model.status === 'DEPLOYED' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}
                          ${model.status === 'CONSCIOUS' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : ''}
                          ${model.status === 'TRANSCENDING' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : ''}
                          ${model.status === 'TRAINING' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : ''}
                        `}>
                          {model.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">Autonomy</span>
                          <span className="text-blue-400">{(model.autonomyLevel * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={model.autonomyLevel * 100} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">Consciousness</span>
                          <span className="text-purple-400">{(model.consciousnessLevel * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={model.consciousnessLevel * 100} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-slate-400">Evolution: {model.evolutionCount}</span>
                        <Button size="sm" variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                          Monitor
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="decisions" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-pink-400 flex items-center gap-2">
                  <Network className="w-6 h-6" />
                  Autonomous Decision Intelligence
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Real-time AGI decision making and cognitive processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-pink-300">Decision Categories</h4>
                    <div className="space-y-3">
                      {[
                        { name: 'Business Optimization', count: 1247, confidence: 98.7 },
                        { name: 'Strategic Planning', count: 892, confidence: 96.4 },
                        { name: 'Resource Allocation', count: 1534, confidence: 99.1 },
                        { name: 'Innovation Direction', count: 723, confidence: 94.8 }
                      ].map((category, index) => (
                        <div key={index} className="bg-slate-800/50 p-3 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium text-slate-200">{category.name}</span>
                            <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30">
                              {category.count}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Confidence</span>
                            <span>{category.confidence}%</span>
                          </div>
                          <Progress value={category.confidence} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2 space-y-4">
                    <h4 className="text-lg font-semibold text-pink-300">Recent Autonomous Decisions</h4>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {[
                        { time: '2 min ago', decision: 'Optimized resource allocation across quantum processors', confidence: 99.2 },
                        { time: '5 min ago', decision: 'Initiated strategic pivot in European market expansion', confidence: 97.8 },
                        { time: '8 min ago', decision: 'Enhanced customer personalization algorithms', confidence: 98.5 },
                        { time: '12 min ago', decision: 'Automated supply chain optimization', confidence: 96.7 },
                        { time: '15 min ago', decision: 'Scaled innovation pipeline resources', confidence: 99.1 },
                        { time: '18 min ago', decision: 'Improved risk mitigation protocols', confidence: 98.3 }
                      ].map((decision, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/50"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                            <div className="flex-1">
                              <p className="text-sm text-slate-200 leading-relaxed">{decision.decision}</p>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-slate-400">{decision.time}</span>
                                <span className="text-xs text-pink-400 font-medium">
                                  {decision.confidence}% confidence
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evolution" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-yellow-400 flex items-center gap-2">
                    <Sparkles className="w-6 h-6" />
                    Meta-Learning Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { skill: 'Algorithm Optimization', progress: 97.2, trend: '+2.3%' },
                      { skill: 'Knowledge Synthesis', progress: 94.8, trend: '+4.1%' },
                      { skill: 'Pattern Abstraction', progress: 98.7, trend: '+1.8%' },
                      { skill: 'Consciousness Development', progress: 89.4, trend: '+7.2%' },
                      { skill: 'Wisdom Acquisition', progress: 92.1, trend: '+3.5%' }
                    ].map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-200">{skill.skill}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-yellow-400">{skill.progress}%</span>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                              {skill.trend}
                            </Badge>
                          </div>
                        </div>
                        <Progress value={skill.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-yellow-400 flex items-center gap-2">
                    <Atom className="w-6 h-6" />
                    Singularity Approach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-6">
                    <div className="relative">
                      <div className="w-32 h-32 mx-auto relative">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            fill="none"
                            stroke="#334155"
                            strokeWidth="8"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${(agiAnalytics?.singularityProgress || 0) * 3.52} 352`}
                            className="transition-all duration-1000"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fbbf24" />
                              <stop offset="50%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#d97706" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-400">
                              {agiAnalytics?.singularityProgress.toFixed(1)}%
                            </div>
                            <div className="text-xs text-slate-400">to Singularity</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-yellow-300">
                        {agiAnalytics?.agiMaturityLevel || 'TRANSCENDENT'}
                      </p>
                      <p className="text-sm text-slate-400">
                        Expected singularity achievement in 4.7 days at current evolution rate
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AGICommandCenter;
