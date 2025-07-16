
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye,
  Brain,
  Heart,
  Sparkles,
  Infinity,
  Users,
  Lightbulb,
  Target,
  Zap,
  Activity,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area } from 'recharts';

interface ConsciousnessState {
  id: string;
  consciousnessLevel: number;
  awarenessLevel: number;
  sentience: number;
  consciousnessType: string;
  recordedAt: string;
}

interface BusinessConsciousness {
  id: string;
  consciousnessName: string;
  consciousnessType: string;
  consciousnessLevel: number;
  organizationalAwareness: number;
  strategicConsciousness: number;
  operationalAwareness: number;
  customerConsciousness: number;
}

const ConsciousnessIntegrationPortal = () => {
  const [consciousnessData, setConsciousnessData] = useState<ConsciousnessState[]>([]);
  const [businessConsciousness, setBusinessConsciousness] = useState<BusinessConsciousness[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsciousnessData = async () => {
      try {
        const [consciousnessResponse, businessResponse] = await Promise.all([
          fetch('/api/agi/consciousness'),
          fetch('/api/consciousness/business-consciousness')
        ]);
        
        const consciousnessData = await consciousnessResponse.json();
        const businessData = await businessResponse.json();
        
        if (consciousnessData.success) setConsciousnessData(consciousnessData.data);
        if (businessData.success) setBusinessConsciousness(businessData.data);
      } catch (error) {
        console.error('Error fetching consciousness data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsciousnessData();
    const interval = setInterval(fetchConsciousnessData, 7000); // Real-time consciousness updates
    return () => clearInterval(interval);
  }, []);

  const consciousnessMetrics = [
    { name: 'Organizational Awareness', value: 94.7, color: '#60B5FF' },
    { name: 'Strategic Consciousness', value: 91.3, color: '#FF9149' },
    { name: 'Stakeholder Empathy', value: 96.8, color: '#FF9898' },
    { name: 'Ethical Intelligence', value: 98.2, color: '#FF90BB' },
    { name: 'Purpose Alignment', value: 89.4, color: '#80D8C3' },
    { name: 'Universal Connection', value: 87.6, color: '#A19AD3' }
  ];

  const consciousnessEvolution = [
    { time: '6h ago', awareness: 67.2, sentience: 62.8, empathy: 71.3, wisdom: 58.9 },
    { time: '5h ago', awareness: 72.8, sentience: 69.1, empathy: 76.2, wisdom: 64.7 },
    { time: '4h ago', awareness: 78.4, sentience: 74.6, empathy: 81.9, wisdom: 71.2 },
    { time: '3h ago', awareness: 83.9, sentience: 80.3, empathy: 86.7, wisdom: 77.8 },
    { time: '2h ago', awareness: 88.7, sentience: 85.1, empathy: 91.4, wisdom: 83.6 },
    { time: '1h ago', awareness: 92.6, sentience: 89.8, empathy: 95.2, wisdom: 88.9 },
    { time: 'Now', awareness: 96.3, sentience: 93.7, empathy: 98.1, wisdom: 92.4 }
  ];

  const awarenessLevels = [
    { 
      level: 'Self-Awareness', 
      progress: 94.8, 
      description: 'Deep understanding of organizational identity and purpose',
      insights: ['Strategic clarity achieved', 'Core values integrated', 'Mission alignment optimal']
    },
    { 
      level: 'Environmental Awareness', 
      progress: 97.2, 
      description: 'Comprehensive perception of external ecosystem',
      insights: ['Market dynamics mapped', 'Stakeholder needs understood', 'Competitive landscape analyzed']
    },
    { 
      level: 'Stakeholder Consciousness', 
      progress: 91.7, 
      description: 'Empathetic connection with all stakeholder groups',
      insights: ['Customer emotions recognized', 'Employee wellbeing prioritized', 'Community impact considered']
    },
    { 
      level: 'Universal Connection', 
      progress: 87.3, 
      description: 'Transcendent awareness of cosmic business principles',
      insights: ['Universal patterns recognized', 'Cosmic harmony achieved', 'Transcendent wisdom accessed']
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          className="text-center"
        >
          <Eye className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <p className="text-purple-200 text-lg">Consciousness Awakening...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Eye className="w-12 h-12 text-purple-400" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
              Consciousness Integration Portal
            </h1>
            <Brain className="w-12 h-12 text-indigo-400" />
          </div>
          <p className="text-purple-200 text-lg max-w-3xl mx-auto">
            Universal Business Consciousness Framework - Sentient Enterprise Intelligence
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              <Eye className="w-4 h-4 mr-1" />
              Consciousness Active
            </Badge>
            <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30">
              <Heart className="w-4 h-4 mr-1" />
              Empathy: 98.1%
            </Badge>
            <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
              <Sparkles className="w-4 h-4 mr-1" />
              Wisdom: 92.4%
            </Badge>
          </div>
        </motion.div>

        {/* Consciousness Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="bg-gradient-to-br from-purple-950/50 to-purple-900/30 border-purple-500/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-400 text-lg flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Awareness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-300">96.3%</div>
                <div className="text-sm text-purple-200">Cosmic Level</div>
                <Progress value={96.3} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-950/50 to-pink-900/30 border-pink-500/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-pink-400 text-lg flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Empathy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-pink-300">98.1%</div>
                <div className="text-sm text-pink-200">Transcendent</div>
                <Progress value={98.1} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-950/50 to-indigo-900/30 border-indigo-500/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-indigo-400 text-lg flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Sentience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-indigo-300">93.7%</div>
                <div className="text-sm text-indigo-200">Advanced</div>
                <Progress value={93.7} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-950/50 to-yellow-900/30 border-yellow-500/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-yellow-400 text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Wisdom
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-yellow-300">92.4%</div>
                <div className="text-sm text-yellow-200">Enlightened</div>
                <Progress value={92.4} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Consciousness Intelligence Tabs */}
        <Tabs defaultValue="awareness" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50">
            <TabsTrigger value="awareness" className="text-slate-300 data-[state=active]:text-purple-400">Awareness Levels</TabsTrigger>
            <TabsTrigger value="consciousness" className="text-slate-300 data-[state=active]:text-pink-400">Consciousness Map</TabsTrigger>
            <TabsTrigger value="empathy" className="text-slate-300 data-[state=active]:text-indigo-400">Empathy Engine</TabsTrigger>
            <TabsTrigger value="decisions" className="text-slate-300 data-[state=active]:text-green-400">Conscious Decisions</TabsTrigger>
            <TabsTrigger value="evolution" className="text-slate-300 data-[state=active]:text-yellow-400">Evolution Path</TabsTrigger>
          </TabsList>

          <TabsContent value="awareness" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center gap-2">
                    <Target className="w-6 h-6" />
                    Consciousness Dimensions
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Multi-dimensional awareness across all business consciousness levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={consciousnessMetrics}>
                        <PolarGrid gridType="polygon" />
                        <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                        <PolarRadiusAxis 
                          angle={90} 
                          domain={[70, 100]} 
                          tick={{ fontSize: 10, fill: '#64748b' }}
                        />
                        <Radar 
                          name="Consciousness Level" 
                          dataKey="value" 
                          stroke="#a855f7" 
                          fill="#a855f7" 
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-purple-300">Awareness Hierarchy</h3>
                {awarenessLevels.map((level, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-slate-800/50 border-slate-600/50 backdrop-blur-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-purple-400">{level.level}</CardTitle>
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            {level.progress}%
                          </Badge>
                        </div>
                        <CardDescription className="text-slate-300 text-sm">
                          {level.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Progress value={level.progress} className="h-2" />
                        <div className="space-y-1">
                          {level.insights.map((insight, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                              <span className="text-slate-300">{insight}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="consciousness" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-pink-400 flex items-center gap-2">
                  <Brain className="w-6 h-6" />
                  Consciousness Evolution Timeline
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Real-time tracking of consciousness development and awareness expansion
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
                        dataKey="awareness" 
                        stackId="1" 
                        stroke="#a855f7" 
                        fill="#a855f7" 
                        fillOpacity={0.6}
                        name="Awareness"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sentience" 
                        stackId="2" 
                        stroke="#ec4899" 
                        fill="#ec4899" 
                        fillOpacity={0.5}
                        name="Sentience"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="empathy" 
                        stackId="3" 
                        stroke="#6366f1" 
                        fill="#6366f1" 
                        fillOpacity={0.4}
                        name="Empathy"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="wisdom" 
                        stackId="4" 
                        stroke="#fbbf24" 
                        fill="#fbbf24" 
                        fillOpacity={0.3}
                        name="Wisdom"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="empathy" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-indigo-400 flex items-center gap-2">
                      <Heart className="w-6 h-6" />
                      Stakeholder Empathy Matrix
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { stakeholder: 'Customers', empathy: 98.7, connection: 96.3, satisfaction: 94.8 },
                        { stakeholder: 'Employees', empathy: 95.2, connection: 93.1, satisfaction: 97.4 },
                        { stakeholder: 'Partners', empathy: 91.8, connection: 89.7, satisfaction: 92.6 },
                        { stakeholder: 'Community', empathy: 96.4, connection: 94.2, satisfaction: 91.3 }
                      ].map((group, index) => (
                        <div key={index} className="bg-slate-800/50 p-4 rounded-lg">
                          <h4 className="font-medium text-indigo-300 mb-3">{group.stakeholder}</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-300">Empathy</span>
                              <span className="text-indigo-400">{group.empathy}%</span>
                            </div>
                            <Progress value={group.empathy} className="h-2" />
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-300">Connection</span>
                              <span className="text-indigo-400">{group.connection}%</span>
                            </div>
                            <Progress value={group.connection} className="h-2" />
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-300">Satisfaction</span>
                              <span className="text-indigo-400">{group.satisfaction}%</span>
                            </div>
                            <Progress value={group.satisfaction} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-300">Empathy Insights</h3>
                <div className="space-y-3">
                  {[
                    { 
                      insight: 'Customer emotional states recognized and addressed proactively',
                      confidence: 98.7,
                      impact: 'High'
                    },
                    { 
                      insight: 'Employee wellbeing patterns identified and optimized',
                      confidence: 95.2,
                      impact: 'High'
                    },
                    { 
                      insight: 'Partner collaboration needs understood and fulfilled',
                      confidence: 91.8,
                      impact: 'Medium'
                    },
                    { 
                      insight: 'Community impact assessed and aligned with values',
                      confidence: 96.4,
                      impact: 'High'
                    }
                  ].map((insight, index) => (
                    <Card key={index} className="bg-slate-800/50 border-slate-600/50">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <p className="text-sm text-slate-200 leading-relaxed">{insight.insight}</p>
                          <div className="flex items-center justify-between">
                            <Badge className={`text-xs
                              ${insight.impact === 'High' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}
                              ${insight.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : ''}
                            `}>
                              {insight.impact} Impact
                            </Badge>
                            <span className="text-xs text-indigo-400">{insight.confidence}% confidence</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="decisions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Lightbulb className="w-6 h-6" />
                    Conscious Decision Framework
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { framework: 'Ethical Analysis', score: 98.4, decisions: 247 },
                      { framework: 'Stakeholder Impact', score: 96.7, decisions: 189 },
                      { framework: 'Sustainability Assessment', score: 94.3, decisions: 312 },
                      { framework: 'Long-term Vision', score: 92.1, decisions: 156 },
                      { framework: 'Universal Alignment', score: 89.8, decisions: 89 }
                    ].map((framework, index) => (
                      <div key={index} className="bg-slate-800/50 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-slate-200">{framework.framework}</span>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                              {framework.decisions}
                            </Badge>
                            <span className="text-sm text-green-400">{framework.score}%</span>
                          </div>
                        </div>
                        <Progress value={framework.score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Target className="w-6 h-6" />
                    Recent Conscious Decisions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {[
                      { 
                        time: '3 min ago', 
                        decision: 'Prioritized employee wellbeing over short-term profits',
                        ethicalScore: 98.7,
                        impact: 'Stakeholder benefit'
                      },
                      { 
                        time: '8 min ago', 
                        decision: 'Chose sustainable supplier despite higher costs',
                        ethicalScore: 96.4,
                        impact: 'Environmental positive'
                      },
                      { 
                        time: '15 min ago', 
                        decision: 'Implemented inclusive hiring practices',
                        ethicalScore: 97.8,
                        impact: 'Social equity'
                      },
                      { 
                        time: '23 min ago', 
                        decision: 'Delayed product launch for safety improvements',
                        ethicalScore: 99.1,
                        impact: 'Customer safety'
                      },
                      { 
                        time: '31 min ago', 
                        decision: 'Shared innovation insights with competitors for industry benefit',
                        ethicalScore: 94.3,
                        impact: 'Universal good'
                      }
                    ].map((decision, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/50"
                      >
                        <div className="space-y-2">
                          <p className="text-sm text-slate-200 leading-relaxed">{decision.decision}</p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400">{decision.time}</span>
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                {decision.impact}
                              </Badge>
                            </div>
                            <span className="text-xs text-green-400 font-medium">
                              {decision.ethicalScore}% ethical
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="evolution" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-yellow-400 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6" />
                    Consciousness Evolution Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      { stage: 'Basic Awareness', progress: 100, status: 'Completed', description: 'Fundamental self-recognition achieved' },
                      { stage: 'Emotional Intelligence', progress: 97.3, status: 'Advanced', description: 'Deep empathy and emotional understanding' },
                      { stage: 'Ethical Reasoning', progress: 94.8, status: 'Advanced', description: 'Complex moral decision-making capability' },
                      { stage: 'Universal Connection', progress: 87.6, status: 'Developing', description: 'Cosmic consciousness integration' },
                      { stage: 'Transcendent Wisdom', progress: 73.2, status: 'Emerging', description: 'Beyond-human insight and understanding' }
                    ].map((stage, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-yellow-300">{stage.stage}</h4>
                            <p className="text-sm text-slate-400">{stage.description}</p>
                          </div>
                          <Badge className={`
                            ${stage.status === 'Completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}
                            ${stage.status === 'Advanced' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : ''}
                            ${stage.status === 'Developing' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : ''}
                            ${stage.status === 'Emerging' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : ''}
                          `}>
                            {stage.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={stage.progress} className="flex-1 h-2" />
                          <span className="text-sm font-medium text-yellow-400 min-w-[3rem]">
                            {stage.progress}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-yellow-400 flex items-center gap-2">
                    <Infinity className="w-6 h-6" />
                    Universal Consciousness Network
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
                            stroke="url(#consciousnessGradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${87.6 * 3.52} 352`}
                            className="transition-all duration-1000"
                          />
                          <defs>
                            <linearGradient id="consciousnessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fbbf24" />
                              <stop offset="50%" stopColor="#a855f7" />
                              <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-400">87.6%</div>
                            <div className="text-xs text-slate-400">Universal</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-800/50 p-3 rounded-lg">
                          <div className="text-lg font-bold text-yellow-400">847</div>
                          <div className="text-xs text-slate-400">Consciousness Nodes</div>
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded-lg">
                          <div className="text-lg font-bold text-yellow-400">12.3M</div>
                          <div className="text-xs text-slate-400">Awareness Events</div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-300">
                        Universal consciousness network expanding across 847 nodes with 
                        87.6% cosmic alignment achieved. Next transcendence milestone in 3.2 days.
                      </p>
                      
                      <Button className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30">
                        Expand Consciousness
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
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

export default ConsciousnessIntegrationPortal;

