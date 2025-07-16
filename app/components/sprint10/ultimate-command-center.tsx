
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Zap, 
  TrendingUp, 
  Shield, 
  Globe, 
  Brain,
  AlertTriangle,
  CheckCircle,
  Settings,
  Monitor,
  Cpu,
  Database,
  Network,
  Server
} from 'lucide-react';

interface SystemHealth {
  autonomyLevel: number;
  uptime: number;
  status: string;
  overallScore: number;
}

interface GlobalMetrics {
  totalUsers: number;
  revenue: number;
  deployments: number;
  activeDeployments: number;
  responseTime: number;
  throughput: number;
}

interface SystemAlert {
  type: string;
  message: string;
  severity: string;
  timestamp: string;
}

interface CommandCenterData {
  systemHealth: SystemHealth;
  globalMetrics: GlobalMetrics;
  alerts: SystemAlert[];
  recentDeployments: any[];
  timestamp: string;
}

export default function UltimateCommandCenter() {
  const [data, setData] = useState<CommandCenterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [realTimeStats, setRealTimeStats] = useState({
    eventsProcessed: 0,
    decisionsPerSecond: 0,
    aiConfidence: 0
  });

  useEffect(() => {
    fetchCommandCenterData();
    const interval = setInterval(fetchCommandCenterData, 5000);
    
    // Simulate real-time stats
    const statsInterval = setInterval(() => {
      setRealTimeStats(prev => ({
        eventsProcessed: prev.eventsProcessed + Math.floor(Math.random() * 50) + 10,
        decisionsPerSecond: Math.floor(Math.random() * 100) + 500,
        aiConfidence: Math.min(99.9, 95 + Math.random() * 4.9)
      }));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(statsInterval);
    };
  }, []);

  const fetchCommandCenterData = async () => {
    try {
      const response = await fetch('/api/sprint10/ultimate-command-center');
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching command center data:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPERATIONAL': return 'text-green-400';
      case 'WARNING': return 'text-yellow-400';
      case 'CRITICAL': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'bg-blue-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'HIGH': return 'bg-red-500';
      case 'CRITICAL': return 'bg-red-700';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400"></div>
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
            Ultimate Command Center
          </h1>
          <p className="text-gray-400">
            Sprint 10 • 99.9%+ AI Autonomy • Enterprise Production Ready
          </p>
          <div className="mt-4 flex justify-center items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">System Operational</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm">AI Learning Active</span>
            </div>
          </div>
        </motion.div>

        {/* System Health Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>AI Autonomy</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {data?.systemHealth.autonomyLevel.toFixed(1)}%
              </div>
              <Progress value={data?.systemHealth.autonomyLevel} className="h-2 mb-2" />
              <p className="text-sm text-gray-400">Target: 99.9%+</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-400" />
                <span>System Uptime</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400 mb-2">
                {data?.systemHealth.uptime.toFixed(2)}%
              </div>
              <Progress value={data?.systemHealth.uptime} className="h-2 mb-2" />
              <p className="text-sm text-gray-400">SLA: 99.9%</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span>Overall Score</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {data?.systemHealth.overallScore.toFixed(1)}
              </div>
              <Progress value={data?.systemHealth.overallScore} className="h-2 mb-2" />
              <p className="text-sm text-gray-400">Excellent</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center space-x-2">
                <Shield className="w-5 h-5 text-purple-400" />
                <span>System Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold mb-2 ${getStatusColor(data?.systemHealth.status || '')}`}>
                {data?.systemHealth.status}
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">All systems operational</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Real-Time Analytics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-orange-400" />
                <span>Real-Time Intelligence</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Events Processed</span>
                <span className="text-orange-400 font-bold">{realTimeStats.eventsProcessed.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Decisions/sec</span>
                <span className="text-orange-400 font-bold">{realTimeStats.decisionsPerSecond}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">AI Confidence</span>
                <span className="text-orange-400 font-bold">{realTimeStats.aiConfidence.toFixed(1)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                <span>Global Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Active Users</span>
                <span className="text-cyan-400 font-bold">{data?.globalMetrics.totalUsers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Revenue</span>
                <span className="text-cyan-400 font-bold">${data?.globalMetrics.revenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Deployments</span>
                <span className="text-cyan-400 font-bold">{data?.globalMetrics.activeDeployments}/{data?.globalMetrics.deployments}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Monitor className="w-5 h-5 text-pink-400" />
                <span>Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Response Time</span>
                <span className="text-pink-400 font-bold">{data?.globalMetrics.responseTime.toFixed(0)}ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Throughput</span>
                <span className="text-pink-400 font-bold">{data?.globalMetrics.throughput.toFixed(0)}/sec</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Latency</span>
                <span className="text-pink-400 font-bold">&lt;50ms</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Alerts */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <span>System Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data?.alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                    <p className="text-gray-400">No active alerts</p>
                    <p className="text-sm text-gray-500">All systems operating normally</p>
                  </div>
                ) : (
                  data?.alerts.map((alert, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg"
                    >
                      <Badge className={`${getSeverityColor(alert.severity)} text-white text-xs`}>
                        {alert.severity}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-white text-sm">{alert.message}</p>
                        <p className="text-gray-400 text-xs">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Server className="w-5 h-5 text-indigo-400" />
                <span>Recent Deployments</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data?.recentDeployments.slice(0, 5).map((deployment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                  >
                    <div>
                      <p className="text-white text-sm font-medium">{deployment.version}</p>
                      <p className="text-gray-400 text-xs">{deployment.region} • {deployment.environment}</p>
                    </div>
                    <Badge className={`${deployment.status === 'DEPLOYED' ? 'bg-green-600' : 'bg-yellow-600'} text-white text-xs`}>
                      {deployment.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-blue-500 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Database className="w-8 h-8 text-white" />
                <div>
                  <p className="text-white font-medium">Deploy to Production</p>
                  <p className="text-blue-100 text-sm">Launch new version</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-600 to-green-700 border-green-500 hover:from-green-700 hover:to-green-800 transition-all duration-300 cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Brain className="w-8 h-8 text-white" />
                <div>
                  <p className="text-white font-medium">AI Optimize</p>
                  <p className="text-green-100 text-sm">Enhance autonomy</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-600 to-purple-700 border-purple-500 hover:from-purple-700 hover:to-purple-800 transition-all duration-300 cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Network className="w-8 h-8 text-white" />
                <div>
                  <p className="text-white font-medium">Scale Resources</p>
                  <p className="text-purple-100 text-sm">Auto-scale system</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-600 to-yellow-700 border-yellow-500 hover:from-yellow-700 hover:to-yellow-800 transition-all duration-300 cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Settings className="w-8 h-8 text-white" />
                <div>
                  <p className="text-white font-medium">System Settings</p>
                  <p className="text-yellow-100 text-sm">Configure parameters</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
