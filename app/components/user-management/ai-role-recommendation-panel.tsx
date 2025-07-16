
'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Lightbulb,
  BarChart3,
  Users,
  Lock,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface AIRoleRecommendationPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRoleId: string | null;
}

interface AIRecommendation {
  id: string;
  type: string;
  priority: string;
  title: string;
  description: string;
  actionItems: string[];
  riskLevel: number;
  impactScore: number;
  confidenceScore: number;
  status: string;
  createdAt: string;
}

interface AIAssessment {
  securityScore: number;
  optimizationScore: number;
  complianceScore: number;
  summary: string;
}

interface AIMetrics {
  analyzedPermissions: number;
  riskFactorsFound: number;
  optimizationOpportunities: number;
}

export function AIRoleRecommendationPanel({ 
  open, 
  onOpenChange, 
  selectedRoleId 
}: AIRoleRecommendationPanelProps) {
  const [loading, setLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState('ROLE_OPTIMIZATION');
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [assessment, setAssessment] = useState<AIAssessment | null>(null);
  const [metrics, setMetrics] = useState<AIMetrics | null>(null);
  const [generatingNew, setGeneratingNew] = useState(false);

  useEffect(() => {
    if (open && selectedRoleId) {
      fetchExistingRecommendations();
    }
  }, [open, selectedRoleId]);

  const fetchExistingRecommendations = async () => {
    if (!selectedRoleId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/user-management/role-recommendations?roleId=${selectedRoleId}&limit=20`);
      
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewAnalysis = async () => {
    if (!selectedRoleId) return;

    try {
      setGeneratingNew(true);
      const response = await fetch('/api/user-management/role-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisType,
          targetRoleId: selectedRoleId
        })
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
        setAssessment(data.overallAssessment);
        setMetrics(data.metrics);
        toast.success('AI analysis completed successfully');
      } else {
        toast.error('Failed to generate AI analysis');
      }
    } catch (error) {
      console.error('Error generating analysis:', error);
      toast.error('Error generating AI analysis');
    } finally {
      setGeneratingNew(false);
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'OPTIMIZATION': return Target;
      case 'SECURITY': return Shield;
      case 'COMPLIANCE': return CheckCircle;
      case 'ASSIGNMENT': return Users;
      default: return Lightbulb;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'OPTIMIZATION': return 'text-blue-600';
      case 'SECURITY': return 'text-red-600';
      case 'COMPLIANCE': return 'text-green-600';
      case 'ASSIGNMENT': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk > 0.7) return 'text-red-600';
    if (risk > 0.4) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const analysisTypes = [
    { value: 'ROLE_OPTIMIZATION', label: 'Role Optimization', icon: Target },
    { value: 'SECURITY_ASSESSMENT', label: 'Security Assessment', icon: Shield },
    { value: 'PERMISSION_ANALYSIS', label: 'Permission Analysis', icon: Lock },
    { value: 'USER_ROLE_RECOMMENDATION', label: 'User Assignment', icon: Users }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            AI Role Recommendations & Insights
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Controls */}
          <div className="flex items-center gap-4">
            <Select value={analysisType} onValueChange={setAnalysisType}>
              <SelectTrigger className="w-[280px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {analysisTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Button 
              onClick={generateNewAnalysis} 
              disabled={generatingNew || !selectedRoleId}
              className="gap-2"
            >
              {generatingNew ? 'Analyzing...' : 'Generate AI Analysis'}
              <Zap className="w-4 h-4" />
            </Button>
          </div>

          {/* Overall Assessment */}
          {assessment && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Overall Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-red-600" />
                      <span className="font-medium">Security Score</span>
                    </div>
                    <div className={`text-3xl font-bold ${getScoreColor(assessment.securityScore)}`}>
                      {(assessment.securityScore * 100).toFixed(0)}%
                    </div>
                    <Progress 
                      value={assessment.securityScore * 100} 
                      className="mt-2"
                    />
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Optimization</span>
                    </div>
                    <div className={`text-3xl font-bold ${getScoreColor(assessment.optimizationScore)}`}>
                      {(assessment.optimizationScore * 100).toFixed(0)}%
                    </div>
                    <Progress 
                      value={assessment.optimizationScore * 100} 
                      className="mt-2"
                    />
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Compliance</span>
                    </div>
                    <div className={`text-3xl font-bold ${getScoreColor(assessment.complianceScore)}`}>
                      {(assessment.complianceScore * 100).toFixed(0)}%
                    </div>
                    <Progress 
                      value={assessment.complianceScore * 100} 
                      className="mt-2"
                    />
                  </div>
                </div>
                <Separator />
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Summary</h4>
                  <p className="text-sm text-muted-foreground">{assessment.summary}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metrics */}
          {metrics && (
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Analyzed Permissions</p>
                      <p className="text-2xl font-bold">{metrics.analyzedPermissions}</p>
                    </div>
                    <Lock className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Risk Factors</p>
                      <p className="text-2xl font-bold text-red-600">{metrics.riskFactorsFound}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Opportunities</p>
                      <p className="text-2xl font-bold text-green-600">{metrics.optimizationOpportunities}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                        <div className="h-3 bg-muted rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recommendations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No recommendations yet</h3>
                  <p>Generate an AI analysis to see recommendations for this role.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((rec) => {
                    const Icon = getRecommendationIcon(rec.type);
                    return (
                      <div key={rec.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start gap-3">
                          <Icon className={`w-5 h-5 mt-1 ${getRecommendationColor(rec.type)}`} />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium">{rec.title}</h4>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="outline" 
                                  className={getPriorityColor(rec.priority)}
                                >
                                  {rec.priority}
                                </Badge>
                                <Badge variant="secondary">
                                  {rec.type}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {rec.description}
                            </p>
                            
                            {rec.actionItems && rec.actionItems.length > 0 && (
                              <div className="mb-3">
                                <h5 className="text-sm font-medium mb-1">Action Items:</h5>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  {rec.actionItems.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <span className="text-muted-foreground mt-1">•</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <AlertTriangle className={`w-3 h-3 ${getRiskColor(rec.riskLevel)}`} />
                                <span>Risk: {(rec.riskLevel * 100).toFixed(0)}%</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-blue-600" />
                                <span>Impact: {(rec.impactScore * 100).toFixed(0)}%</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                <span>Confidence: {(rec.confidenceScore * 100).toFixed(0)}%</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{new Date(rec.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
