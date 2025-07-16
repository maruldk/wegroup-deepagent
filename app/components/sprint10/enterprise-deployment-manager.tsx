
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  Server, 
  Activity, 
  TrendingUp, 
  Cloud, 
  Zap,
  Shield,
  BarChart3,
  Cpu,
  HardDrive,
  Network,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

interface RegionStat {
  region: string;
  total: number;
  active: number;
  averageResponseTime: number;
  averageErrorRate: number;
}

interface DeploymentData {
  deployments: any[];
  regionStats: RegionStat[];
  scalingMetrics: any;
  performanceData: any;
}

export default function EnterpriseDeploymentManager() {
  const [data, setData] = useState<DeploymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    fetchDeploymentData();
    const interval = setInterval(fetchDeploymentData, 10000);
    return () => clearInterval(interval);
  }, [selectedRegion]);

  const fetchDeploymentData = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedRegion !== 'all') {
        params.append('region', selectedRegion);
      }
      
      const response = await fetch(`/api/sprint10/enterprise-deployment?${params}`);
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching deployment data:', error);
      setLoading(false);
    }
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const response = await fetch('/api/sprint10/enterprise-deployment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version: `v${Date.now()}`,
          environment: 'PRODUCTION',
          region: selectedRegion === 'all' ? 'us-east-1' : selectedRegion
        })
      });
      
      if (response.ok) {
        await fetchDeploymentData();
      }
    } catch (error) {
      console.error('Error deploying:', error);
    } finally {
      setIsDeploying(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DEPLOYED': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'DEPLOYING': return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'FAILED': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DEPLOYED': return 'bg-green-600';
      case 'DEPLOYING': return 'bg-blue-600';
      case 'FAILED': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400"></div>
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
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Enterprise Deployment Manager
            </h1>
            <p className="text-gray-400">
              Multi-Region • Auto-Scaling • 99.9% Uptime SLA
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Button
              onClick={handleDeploy}
              disabled={isDeploying}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2"
            >
              {isDeploying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <Server className="w-4 h-4 mr-2" />
                  Deploy New Version
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Global Performance Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center space-x-2">
                <Cloud className="w-5 h-5 text-blue-400" />
                <span>Total Capacity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {data?.performanceData?.totalCapacity.toLocaleString()}
              </div>
              <p className="text-sm text-gray-400">Concurrent Users</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-400" />
                <span>Current Load</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400 mb-2">
                {(data?.performanceData?.currentLoad * 100).toFixed(1)}%
              </div>
              <Progress value={data?.performanceData?.currentLoad * 100} className="h-2" />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>Response Time</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {data?.performanceData?.averageResponseTime.toFixed(0)}ms
              </div>
              <p className="text-sm text-gray-400">Average Global</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center space-x-2">
                <Shield className="w-5 h-5 text-purple-400" />
                <span>Error Rate</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {data?.performanceData?.averageErrorRate.toFixed(2)}%
              </div>
              <p className="text-sm text-gray-400">Target: &lt;1%</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Regional Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                <span>Regional Deployment Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.regionStats.map((region, index) => (
                  <motion.div
                    key={region.region}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-cyan-400" />
                        <span className="text-white font-medium">{region.region}</span>
                      </div>
                      <Badge className="bg-cyan-600 text-white text-xs">
                        {region.active}/{region.total}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Response</p>
                        <p className="text-white">{region.averageResponseTime.toFixed(0)}ms</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Error Rate</p>
                        <p className="text-white">{region.averageErrorRate.toFixed(2)}%</p>
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
                <BarChart3 className="w-5 h-5 text-orange-400" />
                <span>Auto-Scaling Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Instances</span>
                <span className="text-orange-400 font-bold">{data?.scalingMetrics?.totalInstances}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Active Instances</span>
                <span className="text-orange-400 font-bold">{data?.scalingMetrics?.activeInstances}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Scaling Events</span>
                <span className="text-orange-400 font-bold">{data?.scalingMetrics?.scalingEvents}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Avg Scale Time</span>
                <span className="text-orange-400 font-bold">{data?.scalingMetrics?.averageScalingTime}s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Cost Savings</span>
                <span className="text-orange-400 font-bold">{data?.scalingMetrics?.costOptimization}%</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Deployments */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 gap-6"
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Server className="w-5 h-5 text-indigo-400" />
                <span>Production Deployments</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left text-gray-400 py-3">Version</th>
                      <th className="text-left text-gray-400 py-3">Environment</th>
                      <th className="text-left text-gray-400 py-3">Region</th>
                      <th className="text-left text-gray-400 py-3">Status</th>
                      <th className="text-left text-gray-400 py-3">Progress</th>
                      <th className="text-left text-gray-400 py-3">Performance</th>
                      <th className="text-left text-gray-400 py-3">Deployed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.deployments.map((deployment, index) => (
                      <motion.tr
                        key={deployment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-all duration-300"
                      >
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(deployment.status)}
                            <span className="text-white font-medium">{deployment.version}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge className={`${deployment.environment === 'PRODUCTION' ? 'bg-green-600' : 'bg-yellow-600'} text-white text-xs`}>
                            {deployment.environment}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <span className="text-gray-300">{deployment.region}</span>
                        </td>
                        <td className="py-4">
                          <Badge className={`${getStatusColor(deployment.status)} text-white text-xs`}>
                            {deployment.status}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <Progress value={deployment.progress} className="h-1 w-20" />
                            <span className="text-gray-300 text-sm">{deployment.progress}%</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="text-sm space-y-1">
                            <div className="flex items-center space-x-2">
                              <Cpu className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-300">{deployment.responseTime.toFixed(0)}ms</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Network className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-300">{deployment.throughput.toFixed(0)}/s</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-gray-400 text-sm">
                            {new Date(deployment.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
