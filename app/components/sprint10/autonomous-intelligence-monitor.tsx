
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Activity, 
  Target, 
  Atom,
  Eye,
  Settings,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Lightbulb,
  Cpu,
  Database,
  Network,
  Clock,
  BarChart3
} from 'lucide-react';

interface AutonomousIntelligenceData {
  aiLearningData: any;
  predictiveInsights: any;
  quantumReadiness: any;
  autonomousDecisions: any;
}

export default function AutonomousIntelligenceMonitor() {
  const [data, setData] = useState<AutonomousIntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('learning');

  useEffect(() => {
    fetchIntelligenceData();
    const interval = setInterval(fetchIntelligenceData, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchIntelligenceData = async () => {
    try {
      const response = await fetch('/api/sprint10/autonomous-intelligence');
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching intelligence data:', error);
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-400';
    if (confidence >= 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'HIGH': return 'bg-red-600';
      case 'MEDIUM': return 'bg-yellow-600';
      case 'LOW': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getReadinessColor = (readiness: number) => {
    if (readiness >= 0.8) return 'text-green-400';
    if (readiness >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400"></div>
        </div>
      </div>
    );
  }

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
            Autonomous Intelligence Monitor
          </h1>
          <p className="text-gray-400">
            AI Learning Analytics • Predictive Intelligence • Quantum Readiness • Decision Trees
          </p>
          <div className="mt-4 flex justify-center items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-purple-400 text-sm">AI Learning Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm">Predictive Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <Atom className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm">Quantum Ready</span>
            </div>
          </div>
        </motion.div>

        {/* AI Performance Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span>AI Autonomy</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {data?.autonomousDecisions?.autonomyLevel.toFixed(1)}%
              </div>
              <Progress value={data?.autonomousDecisions?.autonomyLevel} className="h-2 mb-2" />
              <p className="text-sm text-gray-400">Target: 99.9%</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>Decisions/Hour</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {data?.autonomousDecisions?.decisionsPerHour.toLocaleString()}
              </div>
              <p className="text-sm text-gray-400">Real-time processing</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-400" />
                <span>Accuracy Rate</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400 mb-2">
                {(data?.autonomousDecisions?.accuracyRate * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-gray-400">Learning accuracy</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-400" />
                <span>Adaptation Speed</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {(data?.autonomousDecisions?.adaptationSpeed * 100).toFixed(0)}%
              </div>
              <p className="text-sm text-gray-400">Learning adaptation</p>
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
              <TabsTrigger value="learning" className="data-[state=active]:bg-purple-600">AI Learning</TabsTrigger>
              <TabsTrigger value="insights" className="data-[state=active]:bg-purple-600">Predictive</TabsTrigger>
              <TabsTrigger value="quantum" className="data-[state=active]:bg-purple-600">Quantum</TabsTrigger>
              <TabsTrigger value="decisions" className="data-[state=active]:bg-purple-600">Decisions</TabsTrigger>
            </TabsList>

            <TabsContent value="learning" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-purple-400" />
                      <span>Learning Sessions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Active Sessions</span>
                      <span className="text-purple-400 font-bold">{data?.aiLearningData?.activeSessions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Completed</span>
                      <span className="text-purple-400 font-bold">{data?.aiLearningData?.completedSessions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Average Accuracy</span>
                      <span className="text-purple-400 font-bold">{(data?.aiLearningData?.averageAccuracy * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">F1 Score</span>
                      <span className="text-purple-400 font-bold">{(data?.aiLearningData?.f1Score * 100).toFixed(1)}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Settings className="w-5 h-5 text-orange-400" />
                      <span>Model Training</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Current Epoch</span>
                      <span className="text-orange-400 font-bold">{data?.aiLearningData?.currentEpoch}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Epochs</span>
                      <span className="text-orange-400 font-bold">{data?.aiLearningData?.totalEpochs}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Learning Rate</span>
                      <span className="text-orange-400 font-bold">{data?.aiLearningData?.learningRate.toFixed(4)}</span>
                    </div>
                    <div className="mt-4">
                      <Progress value={(data?.aiLearningData?.currentEpoch / data?.aiLearningData?.totalEpochs) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <span>Performance Trends</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Accuracy Improvement</span>
                      <span className="text-green-400 font-bold">+{data?.aiLearningData?.trends?.accuracyImprovement}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Efficiency Gain</span>
                      <span className="text-green-400 font-bold">+{data?.aiLearningData?.trends?.efficiencyGain}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Autonomy Increase</span>
                      <span className="text-green-400 font-bold">+{data?.aiLearningData?.trends?.autonomyIncrease}%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="mt-6">
              <div className="grid grid-cols-1 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Eye className="w-5 h-5 text-blue-400" />
                      <span>Predictive Insights</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {data?.predictiveInsights?.activeInsights?.map((insight: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-slate-700/30 rounded-lg border border-slate-600"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={`${getImpactColor(insight.impact)} text-white text-xs`}>
                              {insight.impact}
                            </Badge>
                            <span className={`text-sm font-medium ${getConfidenceColor(insight.confidence)}`}>
                              {(insight.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                          <h3 className="text-white font-medium mb-2">{insight.title}</h3>
                          <p className="text-gray-400 text-sm mb-3">{insight.description}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">{insight.timeHorizon}h horizon</span>
                            <div className="flex items-center space-x-1">
                              <Lightbulb className="w-3 h-3 text-yellow-400" />
                              <span className="text-yellow-400">{insight.type}</span>
                            </div>
                          </div>
                          <div className="mt-3 p-2 bg-slate-600/30 rounded text-xs text-gray-300">
                            {insight.recommendation}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center space-x-2">
                        <Target className="w-5 h-5 text-cyan-400" />
                        <span>Insights Overview</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Insights</span>
                        <span className="text-cyan-400 font-bold">{data?.predictiveInsights?.totalInsights}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Avg Confidence</span>
                        <span className="text-cyan-400 font-bold">{(data?.predictiveInsights?.averageConfidence * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Success Rate</span>
                        <span className="text-cyan-400 font-bold">{(data?.predictiveInsights?.successRate * 100).toFixed(0)}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="quantum" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Atom className="w-5 h-5 text-cyan-400" />
                      <span>Quantum Readiness Assessment</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Current Level</span>
                      <Badge className="bg-cyan-600 text-white">
                        {data?.quantumReadiness?.currentLevel}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Target Level</span>
                      <Badge className="bg-blue-600 text-white">
                        {data?.quantumReadiness?.targetLevel}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Overall Readiness</span>
                      <span className={`font-bold ${getReadinessColor(data?.quantumReadiness?.overallReadiness)}`}>
                        {(data?.quantumReadiness?.overallReadiness * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Estimated Completion</span>
                      <span className="text-white">{data?.quantumReadiness?.estimatedCompletion}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-orange-400" />
                      <span>Readiness Metrics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-400">Algorithm</span>
                          <span className="text-orange-400">{(data?.quantumReadiness?.readinessMetrics?.algorithmReadiness * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={data?.quantumReadiness?.readinessMetrics?.algorithmReadiness * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-400">Data</span>
                          <span className="text-orange-400">{(data?.quantumReadiness?.readinessMetrics?.dataReadiness * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={data?.quantumReadiness?.readinessMetrics?.dataReadiness * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-400">Hardware</span>
                          <span className="text-orange-400">{(data?.quantumReadiness?.readinessMetrics?.hardwareReadiness * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={data?.quantumReadiness?.readinessMetrics?.hardwareReadiness * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-400">Team</span>
                          <span className="text-orange-400">{(data?.quantumReadiness?.readinessMetrics?.teamReadiness * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={data?.quantumReadiness?.readinessMetrics?.teamReadiness * 100} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-purple-400" />
                      <span>Migration Timeline</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(data?.quantumReadiness?.migrationPlan || {}).map(([phase, description], index) => (
                        <div key={phase} className="flex items-center space-x-4 p-3 bg-slate-700/30 rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">{index + 1}</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{phase}</h4>
                            <p className="text-gray-400 text-sm">{String(description)}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="decisions" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Cpu className="w-5 h-5 text-green-400" />
                      <span>Recent Autonomous Decisions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data?.autonomousDecisions?.recentDecisions?.map((decision: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-4 p-3 bg-slate-700/30 rounded-lg"
                        >
                          <div className="flex-shrink-0">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-white font-medium">{decision.type}</h4>
                              <Badge className="bg-green-600 text-white text-xs">{decision.outcome}</Badge>
                            </div>
                            <p className="text-gray-400 text-sm">{decision.decision}</p>
                            <div className="flex items-center justify-between mt-2 text-xs">
                              <span className="text-gray-500">Confidence: {(decision.confidence * 100).toFixed(0)}%</span>
                              <span className="text-gray-500">{new Date(decision.timestamp).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Database className="w-5 h-5 text-blue-400" />
                      <span>Decision Analytics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Self-Healing Events</span>
                      <span className="text-blue-400 font-bold">{data?.autonomousDecisions?.selfHealingEvents}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Predictive Accuracy</span>
                      <span className="text-blue-400 font-bold">{(data?.autonomousDecisions?.predictiveAccuracy * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Decision Confidence</span>
                      <span className="text-blue-400 font-bold">{(data?.autonomousDecisions?.accuracyRate * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Adaptation Speed</span>
                      <span className="text-blue-400 font-bold">{(data?.autonomousDecisions?.adaptationSpeed * 100).toFixed(0)}%</span>
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
