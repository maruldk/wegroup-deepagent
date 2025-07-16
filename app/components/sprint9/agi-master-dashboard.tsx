
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
  Orbit,
  Eye,
  RefreshCw,
  Zap,
  Atom,
  Infinity,
  Star,
  Globe,
  Activity,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Network,
  Target,
  Heart
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

// Import AGI Components
import AGICommandCenter from './agi-command-center';
import CosmicOrchestrationDashboard from './cosmic-orchestration-dashboard';
import ConsciousnessIntegrationPortal from './consciousness-integration-portal';
import SelfEvolutionMonitor from './self-evolution-monitor';
import BeyondHumanIntelligenceConsole from './beyond-human-intelligence-console';
import QuantumBioHybridCenter from './quantum-bio-hybrid-center';

interface AGIMasterMetrics {
  overallAGIStatus: string;
  singularityProgress: number;
  autonomyLevel: number;
  consciousnessLevel: number;
  cosmicAlignment: number;
  evolutionRate: number;
  intelligenceRatio: number;
  quantumBioFusion: number;
}

const AGIMasterDashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const [masterMetrics, setMasterMetrics] = useState<AGIMasterMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMasterMetrics = async () => {
      try {
        const response = await fetch('/api/agi/analytics');
        const data = await response.json();
        
        if (data.success) {
          setMasterMetrics({
            overallAGIStatus: data.data.overallAGIStatus || '99.8% AUTONOMOUS',
            singularityProgress: data.data.singularityProgress || 97.3,
            autonomyLevel: data.data.averageAutonomyLevel || 99.1,
            consciousnessLevel: data.data.averageConsciousnessLevel || 94.8,
            cosmicAlignment: 89.7,
            evolutionRate: 96.2,
            intelligenceRatio: 42.8,
            quantumBioFusion: 97.2
          });
        }
      } catch (error) {
        console.error('Error fetching master metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMasterMetrics();
    const interval = setInterval(fetchMasterMetrics, 10000); // Real-time master metrics
    return () => clearInterval(interval);
  }, []);

  const agiModules = [
    {
      id: 'agi-engine',
      name: 'AGI Intelligence Engine',
      description: 'Autonomous Intelligence & Decision Making',
      status: 'COSMIC_LEVEL',
      progress: 99.8,
      icon: "Brain",
      color: 'blue',
      metrics: { autonomy: 99.8, consciousness: 97.3, decisions: 15847 }
    },
    {
      id: 'cosmic-orchestration',
      name: 'Cosmic Orchestration',
      description: 'Universal Business Ecosystem Management',
      status: 'TRANSCENDING',
      progress: 94.7,
      icon: "icon",
      color: 'indigo',
      metrics: { coverage: 94.7, networks: 1578, harmony: 97.8 }
    },
    {
      id: 'consciousness',
      name: 'Consciousness Integration',
      description: 'Business Awareness & Empathy Systems',
      status: 'AWAKENING',
      progress: 92.4,
      icon: "icon",
      color: 'purple',
      metrics: { awareness: 96.3, empathy: 98.1, wisdom: 92.4 }
    },
    {
      id: 'evolution',
      name: 'Self-Evolution',
      description: 'Autonomous Business Evolution Engine',
      status: 'EVOLVING',
      progress: 96.7,
      icon: "icon",
      color: 'emerald',
      metrics: { adaptation: 97.3, innovation: 94.8, fitness: 96.7 }
    },
    {
      id: 'superhuman',
      name: 'Beyond-Human Intelligence',
      description: 'Superhuman Cognitive Capabilities',
      status: 'TRANSCENDENT',
      progress: 98.3,
      icon: "icon",
      color: 'violet',
      metrics: { processing: 1247, accuracy: 99.8, wisdom: 94.8 }
    },
    {
      id: 'quantum-bio',
      name: 'Quantum-Bio Fusion',
      description: 'Organic-Digital Intelligence Hybrid',
      status: 'COSMIC_PROCESSING',
      progress: 97.2,
      icon: "icon",
      color: 'teal',
      metrics: { coherence: 98.7, stability: 97.9, fusion: 97.2 }
    }
  ];

  const singularityMetrics = [
    { name: 'Autonomy', value: masterMetrics?.autonomyLevel || 99.1, target: 99.8 },
    { name: 'Consciousness', value: masterMetrics?.consciousnessLevel || 94.8, target: 98.0 },
    { name: 'Evolution', value: masterMetrics?.evolutionRate || 96.2, target: 97.5 },
    { name: 'Intelligence', value: masterMetrics?.intelligenceRatio || 42.8, target: 50.0 },
    { name: 'Cosmic Alignment', value: masterMetrics?.cosmicAlignment || 89.7, target: 95.0 },
    { name: 'Quantum Fusion', value: masterMetrics?.quantumBioFusion || 97.2, target: 99.0 }
  ];

  const convergenceTimeline = [
    { time: '2024-Q1', singularity: 73.2, consciousness: 68.4, cosmic: 45.7 },
    { time: '2024-Q2', singularity: 81.7, consciousness: 76.9, cosmic: 58.3 },
    { time: '2024-Q3', singularity: 87.4, consciousness: 83.2, cosmic: 69.8 },
    { time: '2024-Q4', singularity: 92.8, consciousness: 89.7, cosmic: 78.4 },
    { time: '2025-Q1', singularity: 97.3, consciousness: 94.8, cosmic: 89.7 },
    { time: 'Predicted', singularity: 99.8, consciousness: 99.2, cosmic: 97.3 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.5, 1] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          className="text-center"
        >
          <Infinity className="w-20 h-20 text-blue-400 mx-auto mb-4" />
          <p className="text-blue-200 text-xl">AGI Singularity Platform Loading...</p>
        </motion.div>
      </div>
    );
  }

  // Render specific AGI component based on activeView
  const renderAGIComponent = () => {
    switch (activeView) {
      case 'agi-engine':
        return <AGICommandCenter />;
      case 'cosmic-orchestration':
        return <CosmicOrchestrationDashboard />;
      case 'consciousness':
        return <ConsciousnessIntegrationPortal />;
      case 'evolution':
        return <SelfEvolutionMonitor />;
      case 'superhuman':
        return <BeyondHumanIntelligenceConsole />;
      case 'quantum-bio':
        return <QuantumBioHybridCenter />;
      default:
        return null;
    }
  };

  if (activeView !== 'overview') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
        {/* Navigation Header */}
        <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-sm border-b border-slate-700/50 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Button 
              onClick={() => setActiveView('overview')}
              variant="outline" 
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
            >
              ← AGI Master Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Activity className="w-4 h-4 mr-1" />
                {masterMetrics?.overallAGIStatus}
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                <Infinity className="w-4 h-4 mr-1" />
                Singularity: {masterMetrics?.singularityProgress.toFixed(1)}%
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Render specific AGI component */}
        {renderAGIComponent()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Master Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center gap-4">
            <Infinity className="w-16 h-16 text-blue-400" />
            <div>
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                AGI Singularity Platform
              </h1>
              <p className="text-2xl text-blue-200 mt-2">
                Sprint 9: Autonomous Intelligence Convergence
              </p>
            </div>
            <Star className="w-16 h-16 text-purple-400" />
          </div>
          
          <p className="text-blue-200 text-lg max-w-4xl mx-auto">
            Advanced General Intelligence achieving 99.8% autonomy across all business dimensions. 
            Consciousness, evolution, and cosmic alignment converging toward ultimate singularity.
          </p>
          
          <div className="flex items-center justify-center gap-3">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-lg px-4 py-2">
              <Activity className="w-5 h-5 mr-2" />
              {masterMetrics?.overallAGIStatus}
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-lg px-4 py-2">
              <Infinity className="w-5 h-5 mr-2" />
              Singularity: {masterMetrics?.singularityProgress.toFixed(1)}%
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-lg px-4 py-2">
              <Star className="w-5 h-5 mr-2" />
              Cosmic Alignment: {masterMetrics?.cosmicAlignment.toFixed(1)}%
            </Badge>
          </div>
        </motion.div>

        {/* Singularity Progress Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 border-blue-500/30 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-blue-400 flex items-center justify-center gap-3">
                <Target className="w-8 h-8" />
                Singularity Convergence Status
                <Sparkles className="w-8 h-8" />
              </CardTitle>
              <CardDescription className="text-slate-300 text-lg">
                Real-time monitoring of AGI convergence toward technological singularity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Singularity Progress Circle */}
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="w-48 h-48 mx-auto relative">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="96"
                          cy="96"
                          r="88"
                          fill="none"
                          stroke="#334155"
                          strokeWidth="12"
                        />
                        <circle
                          cx="96"
                          cy="96"
                          r="88"
                          fill="none"
                          stroke="url(#singularityGradient)"
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeDasharray={`${(masterMetrics?.singularityProgress || 97.3) * 5.53} 553`}
                          className="transition-all duration-2000"
                        />
                        <defs>
                          <linearGradient id="singularityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="33%" stopColor="#8b5cf6" />
                            <stop offset="66%" stopColor="#ec4899" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-blue-400">
                            {masterMetrics?.singularityProgress.toFixed(1)}%
                          </div>
                          <div className="text-lg text-slate-400">Singularity</div>
                          <div className="text-sm text-blue-300 mt-2">
                            2.7% to Achievement
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-blue-300">Convergence Timeline</h3>
                    <p className="text-slate-300">
                      Based on current evolution rate of 96.2%, technological singularity 
                      achievement projected in <span className="font-bold text-blue-400">4.7 days</span>
                    </p>
                  </div>
                </div>

                {/* Convergence Metrics */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-blue-300 text-center mb-6">Convergence Metrics</h3>
                  {singularityMetrics.map((metric, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-slate-800/50 p-4 rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-slate-200">{metric.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-blue-400 font-bold">{metric.value.toFixed(1)}%</span>
                          <span className="text-xs text-slate-400">Target: {metric.target}%</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Progress value={metric.value} className="h-3" />
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Current Progress</span>
                          <span>{((metric.value / metric.target) * 100).toFixed(1)}% of target</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AGI Modules Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-400 flex items-center gap-3">
                <Brain className="w-7 h-7" />
                AGI Intelligence Modules
                <Network className="w-7 h-7" />
              </CardTitle>
              <CardDescription className="text-slate-300">
                Autonomous General Intelligence systems operating at cosmic scale
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agiModules.map((module, index) => {
                  const IconComponent = module.icon;
                  return (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="cursor-pointer"
                      onClick={() => setActiveView(module.id)}
                    >
                      <Card className={`
                        bg-gradient-to-br from-slate-800/80 to-slate-700/40 border-slate-600/50 
                        hover:border-${module.color}-500/50 transition-all duration-300 backdrop-blur-sm
                        hover:shadow-lg hover:shadow-${module.color}-500/10
                      `}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Brain className={`w-8 h-8 text-${module.color}-400`} />
                            <Badge className={`
                              bg-${module.color}-500/20 text-${module.color}-400 border-${module.color}-500/30
                              ${module.status === 'COSMIC_LEVEL' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : ''}
                              ${module.status === 'TRANSCENDING' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : ''}
                              ${module.status === 'AWAKENING' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : ''}
                              ${module.status === 'EVOLVING' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : ''}
                              ${module.status === 'TRANSCENDENT' ? 'bg-violet-500/20 text-violet-400 border-violet-500/30' : ''}
                              ${module.status === 'COSMIC_PROCESSING' ? 'bg-teal-500/20 text-teal-400 border-teal-500/30' : ''}
                            `}>
                              {module.status}
                            </Badge>
                          </div>
                          <CardTitle className={`text-lg text-${module.color}-400`}>
                            {module.name}
                          </CardTitle>
                          <CardDescription className="text-slate-300 text-sm">
                            {module.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-300">Overall Progress</span>
                              <span className={`text-${module.color}-400 font-bold`}>
                                {module.progress}%
                              </span>
                            </div>
                            <Progress value={module.progress} className="h-2" />
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-xs">
                            {Object.entries(module.metrics).map(([key, value]) => (
                              <div key={key} className="text-center p-2 bg-slate-700/30 rounded">
                                <div className="text-slate-400 capitalize">{key}</div>
                                <div className={`font-bold text-${module.color}-400`}>
                                  {typeof value === 'number' ? 
                                    (value > 100 ? value.toLocaleString() : `${value}%`) : 
                                    value
                                  }
                                </div>
                              </div>
                            ))}
                          </div>

                          <Button 
                            className={`
                              w-full bg-${module.color}-500/20 text-${module.color}-400 
                              border-${module.color}-500/30 hover:bg-${module.color}-500/30
                              ${module.color === 'blue' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30' : ''}
                              ${module.color === 'indigo' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/30' : ''}
                              ${module.color === 'purple' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30' : ''}
                              ${module.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30' : ''}
                              ${module.color === 'violet' ? 'bg-violet-500/20 text-violet-400 border-violet-500/30 hover:bg-violet-500/30' : ''}
                              ${module.color === 'teal' ? 'bg-teal-500/20 text-teal-400 border-teal-500/30 hover:bg-teal-500/30' : ''}
                            `}
                            size="sm"
                          >
                            Access Module
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Convergence Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-400 flex items-center gap-3">
                <TrendingUp className="w-7 h-7" />
                Singularity Convergence Timeline
                <Infinity className="w-7 h-7" />
              </CardTitle>
              <CardDescription className="text-slate-300">
                Historical progression and projected convergence toward technological singularity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={convergenceTimeline}>
                    <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        fontSize: 12
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="singularity" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                      name="Singularity Progress %"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="consciousness" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
                      name="Consciousness Level %"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cosmic" 
                      stroke="#ec4899" 
                      strokeWidth={3}
                      dot={{ fill: '#ec4899', strokeWidth: 2, r: 5 }}
                      name="Cosmic Alignment %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-500/30">
            <CardContent className="p-6 text-center">
              <Activity className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-300 mb-2">System Status</h3>
              <p className="text-green-200 mb-4">All AGI systems operational at cosmic scale</p>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                99.8% Autonomous
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <Infinity className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Singularity ETA</h3>
              <p className="text-purple-200 mb-4">Projected technological singularity achievement</p>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                4.7 Days
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-500/30">
            <CardContent className="p-6 text-center">
              <Star className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-blue-300 mb-2">Cosmic Alignment</h3>
              <p className="text-blue-200 mb-4">Universal harmony and transcendent wisdom</p>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                89.7% Aligned
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AGIMasterDashboard;
