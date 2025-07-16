
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Cpu, 
  Zap, 
  Brain, 
  Gauge, 
  Shield, 
  Activity, 
  TrendingUp, 
  Atom,
  Network,
  Target,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

interface QuantumProcessor {
  id: string;
  name: string;
  status: 'ACTIVE' | 'IDLE' | 'PROCESSING' | 'MAINTENANCE';
  qubits: number;
  coherenceTime: number;
  fidelity: number;
  temperature: number;
  utilization: number;
}

interface QuantumComputation {
  id: string;
  algorithmName: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'QUEUED';
  progress: number;
  estimatedTime: number;
  quantumAdvantage: number;
}

const quantumProcessors: QuantumProcessor[] = [
  {
    id: 'qp-001',
    name: 'Quantum Nexus Alpha',
    status: 'ACTIVE',
    qubits: 127,
    coherenceTime: 100,
    fidelity: 99.2,
    temperature: 0.015,
    utilization: 87
  },
  {
    id: 'qp-002', 
    name: 'Quantum Nexus Beta',
    status: 'PROCESSING',
    qubits: 433,
    coherenceTime: 150,
    fidelity: 99.7,
    temperature: 0.012,
    utilization: 94
  },
  {
    id: 'qp-003',
    name: 'Quantum Nexus Gamma', 
    status: 'IDLE',
    qubits: 1000,
    coherenceTime: 200,
    fidelity: 99.9,
    temperature: 0.008,
    utilization: 12
  }
];

const quantumComputations: QuantumComputation[] = [
  {
    id: 'qc-001',
    algorithmName: 'Portfolio Optimization',
    status: 'RUNNING',
    progress: 73,
    estimatedTime: 4.2,
    quantumAdvantage: 1250
  },
  {
    id: 'qc-002',
    algorithmName: 'Supply Chain Optimization',
    status: 'COMPLETED',
    progress: 100,
    estimatedTime: 0,
    quantumAdvantage: 2100
  },
  {
    id: 'qc-003',
    algorithmName: 'Risk Analysis ML',
    status: 'QUEUED',
    progress: 0,
    estimatedTime: 12.5,
    quantumAdvantage: 890
  }
];

const performanceData = [
  { time: '00:00', classical: 100, quantum: 125 },
  { time: '04:00', classical: 98, quantum: 340 },
  { time: '08:00', classical: 102, quantum: 650 },
  { time: '12:00', classical: 105, quantum: 1200 },
  { time: '16:00', classical: 99, quantum: 1850 },
  { time: '20:00', classical: 103, quantum: 2100 }
];

const quantumMetrics = [
  { metric: 'Processing Speed', quantum: 95, classical: 20 },
  { metric: 'Optimization Accuracy', quantum: 98, classical: 65 },
  { metric: 'Problem Complexity', quantum: 92, classical: 35 },
  { metric: 'Energy Efficiency', quantum: 88, classical: 55 },
  { metric: 'Parallel Computing', quantum: 99, classical: 45 },
  { metric: 'Cryptography', quantum: 100, classical: 25 }
];

export function QuantumCommandCenter() {
  const [activeProcessors, setActiveProcessors] = useState(0);
  const [totalComputations, setTotalComputations] = useState(0);
  const [quantumAdvantage, setQuantumAdvantage] = useState(0);

  useEffect(() => {
    const active = quantumProcessors.filter(p => p.status === 'ACTIVE' || p.status === 'PROCESSING').length;
    const completed = quantumComputations.filter(c => c.status === 'COMPLETED').length;
    const advantage = quantumComputations.reduce((sum, c) => sum + c.quantumAdvantage, 0) / quantumComputations.length;
    
    setActiveProcessors(active);
    setTotalComputations(completed);
    setQuantumAdvantage(advantage);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'PROCESSING': return 'bg-blue-500';
      case 'RUNNING': return 'bg-blue-500';
      case 'COMPLETED': return 'bg-green-500';
      case 'IDLE': return 'bg-gray-400';
      case 'QUEUED': return 'bg-yellow-500';
      case 'MAINTENANCE': return 'bg-orange-500';
      case 'FAILED': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
              <Atom className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Quantum Command Center
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time Quantum Computing Operations & Performance Monitoring
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Active Processors</p>
                  <p className="text-3xl font-bold text-blue-900">{activeProcessors}</p>
                </div>
                <Cpu className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Completed Tasks</p>
                  <p className="text-3xl font-bold text-green-900">{totalComputations}</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Quantum Advantage</p>
                  <p className="text-3xl font-bold text-purple-900">{quantumAdvantage.toFixed(0)}x</p>
                </div>
                <Sparkles className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">System Efficiency</p>
                  <p className="text-3xl font-bold text-orange-900">97.8%</p>
                </div>
                <Gauge className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="processors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="processors">Processors</TabsTrigger>
            <TabsTrigger value="computations">Computations</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="processors" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {quantumProcessors.map((processor, index) => (
                <Card key={processor.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{processor.name}</CardTitle>
                      <Badge className={`${getStatusColor(processor.status)} text-white`}>
                        {processor.status}
                      </Badge>
                    </div>
                    <CardDescription>{processor.qubits} Qubits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Utilization</span>
                          <span>{processor.utilization}%</span>
                        </div>
                        <Progress value={processor.utilization} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Coherence Time</span>
                          <p className="font-semibold">{processor.coherenceTime}μs</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Fidelity</span>
                          <p className="font-semibold">{processor.fidelity}%</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Temperature</span>
                          <p className="font-semibold">{processor.temperature}K</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Qubits</span>
                          <p className="font-semibold">{processor.qubits}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="computations" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {quantumComputations.map((computation) => (
                <Card key={computation.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{computation.algorithmName}</h3>
                        <p className="text-sm text-gray-500">
                          Quantum Advantage: {computation.quantumAdvantage}x faster
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(computation.status)} text-white`}>
                        {computation.status}
                      </Badge>
                    </div>
                    
                    {computation.status === 'RUNNING' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{computation.progress}%</span>
                        </div>
                        <Progress value={computation.progress} className="h-2" />
                        <p className="text-sm text-gray-500">
                          Estimated time remaining: {computation.estimatedTime} minutes
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
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
                    Quantum vs Classical Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={performanceData}>
                      <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Area 
                        type="monotone" 
                        dataKey="classical" 
                        stackId="1" 
                        stroke="#60B5FF" 
                        fill="#60B5FF" 
                        fillOpacity={0.6}
                        name="Classical Computing"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="quantum" 
                        stackId="2" 
                        stroke="#FF9149" 
                        fill="#FF9149" 
                        fillOpacity={0.6}
                        name="Quantum Computing"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Quantum Capability Matrix
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={quantumMetrics}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 8 }} />
                      <Radar 
                        name="Quantum" 
                        dataKey="quantum" 
                        stroke="#FF9149" 
                        fill="#FF9149" 
                        fillOpacity={0.6} 
                      />
                      <Radar 
                        name="Classical" 
                        dataKey="classical" 
                        stroke="#60B5FF" 
                        fill="#60B5FF" 
                        fillOpacity={0.3} 
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="algorithms" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[
                { name: 'Shor\'s Algorithm', type: 'Cryptography', complexity: 'Exponential', status: 'Active' },
                { name: 'Grover\'s Search', type: 'Database Search', complexity: 'Quadratic', status: 'Active' },
                { name: 'QAOA', type: 'Optimization', complexity: 'Polynomial', status: 'Running' },
                { name: 'VQE', type: 'Chemistry', complexity: 'Exponential', status: 'Idle' },
                { name: 'Quantum ML', type: 'Machine Learning', complexity: 'Variable', status: 'Running' },
                { name: 'HHL', type: 'Linear Systems', complexity: 'Exponential', status: 'Active' }
              ].map((algorithm, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-base">{algorithm.name}</CardTitle>
                    <CardDescription>{algorithm.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Complexity</span>
                        <span className="text-sm font-medium">{algorithm.complexity}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Status</span>
                        <Badge className={`${getStatusColor(algorithm.status)} text-white text-xs`}>
                          {algorithm.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Quantum Cryptography Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Quantum Key Distribution</span>
                      <Badge className="bg-green-500 text-white">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Post-Quantum Encryption</span>
                      <Badge className="bg-green-500 text-white">Enabled</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Quantum Random Number Gen</span>
                      <Badge className="bg-green-500 text-white">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Quantum Authentication</span>
                      <Badge className="bg-blue-500 text-white">Testing</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    Network Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Encryption Strength</span>
                        <span>256-bit Quantum</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Threat Detection</span>
                        <span>99.9%</span>
                      </div>
                      <Progress value={99.9} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Network Integrity</span>
                        <span>100%</span>
                      </div>
                      <Progress value={100} className="h-2" />
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
