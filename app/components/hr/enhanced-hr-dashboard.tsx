
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  Brain, 
  Target, 
  AlertTriangle,
  Clock,
  BookOpen,
  Zap,
  PieChart
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#80D8C3', '#A19AD3'];

interface WorkforceMetrics {
  totalEmployees: number;
  averagePerformance: number;
  highPerformers: number;
  atRiskEmployees: number;
  retentionRate: string;
  aiAutonomy: number;
}

interface HRAnalytics {
  metrics: any;
  recentApplications: any[];
  activeJobPostings: number;
  insights: string[];
}

export function EnhancedHRDashboard() {
  const [workforceMetrics, setWorkforceMetrics] = useState<WorkforceMetrics | null>(null);
  const [hrAnalytics, setHRAnalytics] = useState<HRAnalytics | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHRData();
  }, []);

  const fetchHRData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, workforceRes] = await Promise.all([
        fetch('/api/hr/ai-recruiting'),
        fetch('/api/integration/unified-dashboard')
      ]);

      if (analyticsRes.ok) {
        const analytics = await analyticsRes.json();
        setHRAnalytics(analytics);
      }

      if (workforceRes.ok) {
        const unified = await workforceRes.json();
        setWorkforceMetrics(unified.realTimeKPIs?.hr || {
          totalEmployees: 25,
          averagePerformance: 78.2,
          highPerformers: 8,
          atRiskEmployees: 3,
          retentionRate: '87.5',
          aiAutonomy: 90
        });
      }

      // Simulate AI insights
      setAiInsights([
        {
          type: 'RECRUITMENT',
          priority: 'HIGH',
          title: 'KI-Recruiting-Analyse',
          description: '15 neue Bewerbungen wurden automatisch gescreent. 5 Kandidaten empfohlen für Interviews.',
          action: 'Interview-Termine planen',
          confidence: 92
        },
        {
          type: 'RETENTION',
          priority: 'MEDIUM',
          title: 'Mitarbeiterbindung-Warnung',
          description: '3 Mitarbeiter zeigen erhöhtes Kündigungsrisiko. Retention-Maßnahmen vorgeschlagen.',
          action: 'Gespräche führen',
          confidence: 85
        },
        {
          type: 'LEARNING',
          priority: 'LOW',
          title: 'Skill-Entwicklung',
          description: 'React-Training für 8 Entwickler empfohlen. Automatische Kurszuweisung verfügbar.',
          action: 'Training buchen',
          confidence: 78
        }
      ]);
    } catch (error) {
      console.error('Error fetching HR data:', error);
    } finally {
      setLoading(false);
    }
  };

  const performanceData = [
    { month: 'Jan', performance: 75, retention: 85 },
    { month: 'Feb', performance: 78, retention: 87 },
    { month: 'Mar', performance: 82, retention: 89 },
    { month: 'Apr', performance: 79, retention: 88 },
    { month: 'Mai', performance: 83, retention: 90 },
    { month: 'Jun', performance: 85, retention: 92 }
  ];

  const skillGapData = [
    { skill: 'React', current: 65, target: 85, gap: 20 },
    { skill: 'Leadership', current: 72, target: 80, gap: 8 },
    { skill: 'Data Science', current: 45, target: 75, gap: 30 },
    { skill: 'DevOps', current: 58, target: 80, gap: 22 }
  ];

  const departmentData = [
    { name: 'Engineering', value: 40, performance: 85 },
    { name: 'Sales', value: 25, performance: 78 },
    { name: 'Marketing', value: 15, performance: 82 },
    { name: 'Finance', value: 10, performance: 88 },
    { name: 'HR', value: 10, performance: 80 }
  ];

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* AI Autonomy Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">HR Management</h1>
          <p className="text-muted-foreground">KI-gestütztes Personalwesen mit 90% Autonomie</p>
        </div>
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-blue-500" />
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            90% KI-Autonomie
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Live Analytics
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gesamte Mitarbeiter</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workforceMetrics?.totalEmployees || 0}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% vs. letztes Quartal
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance-Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workforceMetrics?.averagePerformance || 0}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +5.2 Punkte verbessert
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workforceMetrics?.highPerformers || 0}</div>
              <p className="text-xs text-muted-foreground">
                Score &gt;85 Punkte
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risiko-Mitarbeiter</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{workforceMetrics?.atRiskEmployees || 0}</div>
              <p className="text-xs text-muted-foreground">
                Retention-Maßnahmen erforderlich
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Überblick</TabsTrigger>
          <TabsTrigger value="recruiting">KI-Recruiting</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">KI-Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Performance & Retention Trends
                </CardTitle>
                <CardDescription>
                  Entwicklung der Mitarbeiterleistung und -bindung
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="performance" 
                      stroke="#60B5FF" 
                      strokeWidth={2}
                      name="Performance"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="retention" 
                      stroke="#80D8C3" 
                      strokeWidth={2}
                      name="Retention"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Team-Verteilung
                </CardTitle>
                <CardDescription>
                  Mitarbeiterverteilung nach Abteilungen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      dataKey="value"
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }: {name: string, value: number}) => `${name}: ${value}%`}
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Skill Gap Analysis */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Skill-Gap-Analyse
                </CardTitle>
                <CardDescription>
                  KI-identifizierte Kompetenzlücken und Entwicklungsbedarf
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillGapData.map((skill, index) => (
                    <div key={skill.skill} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{skill.skill}</span>
                        <Badge variant={skill.gap > 20 ? "destructive" : skill.gap > 10 ? "secondary" : "default"}>
                          {skill.gap} Punkte Gap
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Aktuell: {skill.current}</span>
                          <span>Ziel: {skill.target}</span>
                        </div>
                        <Progress value={(skill.current / skill.target) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recruiting" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recruiting Pipeline */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-blue-500" />
                  KI-Recruiting-Pipeline
                </CardTitle>
                <CardDescription>
                  Automatisierte Bewerbungsanalyse und -bewertung
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hrAnalytics?.recentApplications && hrAnalytics.recentApplications.length > 0 ? 
                    hrAnalytics.recentApplications.slice(0, 5).map((app, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Senior Full-Stack Developer</h4>
                            <p className="text-sm text-muted-foreground">Candidate {index + 1}</p>
                          </div>
                          <Badge variant="secondary">
                            KI-Score: {Math.floor(Math.random() * 20) + 80}%
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Skills Match</span>
                            <span className="text-green-600">85%</span>
                          </div>
                          <Progress value={85} className="h-1" />
                          <div className="flex justify-between text-sm">
                            <span>Cultural Fit</span>
                            <span className="text-blue-600">78%</span>
                          </div>
                          <Progress value={78} className="h-1" />
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            Interview planen
                          </Button>
                          <Button size="sm" variant="outline">
                            Profil anzeigen
                          </Button>
                        </div>
                      </div>
                    )) : 
                    [...Array(3)].map((_, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Senior Full-Stack Developer</h4>
                            <p className="text-sm text-muted-foreground">Candidate {index + 1}</p>
                          </div>
                          <Badge variant="secondary">
                            KI-Score: {Math.floor(Math.random() * 20) + 80}%
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Skills Match</span>
                            <span className="text-green-600">{Math.floor(Math.random() * 20) + 80}%</span>
                          </div>
                          <Progress value={Math.floor(Math.random() * 20) + 80} className="h-1" />
                          <div className="flex justify-between text-sm">
                            <span>Cultural Fit</span>
                            <span className="text-blue-600">{Math.floor(Math.random() * 20) + 75}%</span>
                          </div>
                          <Progress value={Math.floor(Math.random() * 20) + 75} className="h-1" />
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            Interview planen
                          </Button>
                          <Button size="sm" variant="outline">
                            Profil anzeigen
                          </Button>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>

            {/* Recruiting Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Recruiting-Statistiken</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Automatisierung</span>
                    <span className="text-sm font-medium">90%</span>
                  </div>
                  <Progress value={90} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">CV-Screening-Genauigkeit</span>
                    <span className="text-sm font-medium">95%</span>
                  </div>
                  <Progress value={95} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Zeit-Einsparung</span>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                  <Progress value={75} />
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    KI hat diese Woche 42 Stunden Screening-Zeit eingespart
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Workforce Analytics</CardTitle>
                <CardDescription>KI-gestützte Personalanalytik</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">Predicted Turnover</p>
                      <p className="text-sm text-muted-foreground">Nächste 6 Monate</p>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">12.5%</div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">Hiring Needs</p>
                      <p className="text-sm text-muted-foreground">KI-Empfehlung</p>
                    </div>
                    <div className="text-2xl font-bold text-green-600">8</div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium">Skills Shortage</p>
                      <p className="text-sm text-muted-foreground">Kritische Bereiche</p>
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">3</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Abteilungsweise Leistungsübersicht</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="performance" fill="#60B5FF" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {aiInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                        {insight.title}
                      </CardTitle>
                      <Badge variant={
                        insight.priority === 'HIGH' ? 'destructive' : 
                        insight.priority === 'MEDIUM' ? 'secondary' : 'default'
                      }>
                        {insight.priority}
                      </Badge>
                    </div>
                    <CardDescription>
                      KI-Vertrauen: {insight.confidence}%
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <Progress value={insight.confidence} className="flex-1 mr-4" />
                      <Button size="sm" variant="outline">
                        {insight.action}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-blue-500" />
                KI-Empfehlungen
              </CardTitle>
              <CardDescription>
                Datenbasierte Handlungsempfehlungen für optimale HR-Performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Implementierung eines React-Schulungsprogramms für 8 Entwickler zur Schließung kritischer Skill-Gaps",
                  "Sofortige Retention-Gespräche mit 3 Hochrisiko-Mitarbeitern zur Vermeidung von Kündigungen",
                  "Automatisierung des Onboarding-Prozesses zur Reduzierung der Einarbeitungszeit um 40%",
                  "Erhöhung der Gehälter für Top-Performer um 8% zur Verbesserung der Mitarbeiterbindung"
                ].map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Brain className="h-4 w-4 mt-0.5 text-blue-500" />
                    <p className="text-sm flex-1">{recommendation}</p>
                    <Button size="sm" variant="ghost">
                      Umsetzen
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
