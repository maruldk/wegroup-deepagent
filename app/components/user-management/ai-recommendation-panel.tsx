
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TrendingUp,
  Shield,
  Users,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Settings
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface AIRecommendation {
  id: string;
  recommendationType: string;
  targetUserId?: string;
  targetRoleId?: string;
  aiConfidenceScore: number;
  aiJustification: string;
  securityRiskScore: number;
  complianceScore: number;
  businessImpactScore: number;
  status: string;
  createdAt: string;
  targetUser?: {
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
  targetRole?: {
    name: string;
    description: string | null;
  };
  menuPermission?: {
    menuTitle: string;
    menuPath: string;
  };
}

interface RecommendationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  highPriority: number;
  averageConfidence: number;
}

export function AIRecommendationPanel() {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [stats, setStats] = useState<RecommendationStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    highPriority: 0,
    averageConfidence: 0
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    fetchRecommendations();
  }, [typeFilter]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (typeFilter !== 'all') params.append('type', typeFilter);

      const response = await fetch(`/api/ai-recommendations/permissions?${params}`);
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
        
        // Calculate stats
        const total = data.recommendations?.length || 0;
        const pending = data.recommendations?.filter((r: AIRecommendation) => r.status === 'PENDING').length || 0;
        const approved = data.recommendations?.filter((r: AIRecommendation) => r.status === 'APPROVED').length || 0;
        const rejected = data.recommendations?.filter((r: AIRecommendation) => r.status === 'REJECTED').length || 0;
        const highPriority = data.recommendations?.filter((r: AIRecommendation) => r.securityRiskScore > 0.7).length || 0;
        const avgConfidence = total > 0 
          ? data.recommendations.reduce((sum: number, r: AIRecommendation) => sum + r.aiConfidenceScore, 0) / total 
          : 0;

        setStats({
          total,
          pending,
          approved,
          rejected,
          highPriority,
          averageConfidence: avgConfidence
        });
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    try {
      setGenerating(true);
      const response = await fetch('/api/ai-recommendations/permissions/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          analysisType: 'comprehensive'
        })
      });

      if (response.ok) {
        await fetchRecommendations(); // Refresh the list
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setGenerating(false);
    }
  };

  const getRecommendationIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      'GRANT_PERMISSION': <CheckCircle className="w-4 h-4 text-green-500" />,
      'REVOKE_PERMISSION': <XCircle className="w-4 h-4 text-red-500" />,
      'MODIFY_ROLE': <Settings className="w-4 h-4 text-blue-500" />,
      'SECURITY_REVIEW': <Shield className="w-4 h-4 text-orange-500" />,
      'COMPLIANCE_UPDATE': <AlertTriangle className="w-4 h-4 text-yellow-500" />,
      'ANOMALY_DETECTION': <Brain className="w-4 h-4 text-purple-500" />
    };
    return icons[type] || <Brain className="w-4 h-4 text-gray-500" />;
  };

  const getRecommendationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'GRANT_PERMISSION': 'Grant Permission',
      'REVOKE_PERMISSION': 'Revoke Permission',
      'MODIFY_ROLE': 'Modify Role',
      'SECURITY_REVIEW': 'Security Review',
      'COMPLIANCE_UPDATE': 'Compliance Update',
      'ANOMALY_DETECTION': 'Anomaly Detected'
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; color: string }> = {
      'PENDING': { variant: 'outline', color: 'text-orange-600' },
      'APPROVED': { variant: 'default', color: 'text-green-600' },
      'REJECTED': { variant: 'destructive', color: 'text-red-600' },
      'IMPLEMENTED': { variant: 'secondary', color: 'text-blue-600' }
    };
    
    const config = variants[status] || variants['PENDING'];
    return (
      <Badge variant={config.variant} className={config.color}>
        {status}
      </Badge>
    );
  };

  const getRiskLevel = (score: number) => {
    if (score >= 0.8) return { label: 'Critical', color: 'text-red-600' };
    if (score >= 0.6) return { label: 'High', color: 'text-orange-600' };
    if (score >= 0.4) return { label: 'Medium', color: 'text-yellow-600' };
    return { label: 'Low', color: 'text-green-600' };
  };

  const getTargetDisplay = (recommendation: AIRecommendation) => {
    if (recommendation.targetUser) {
      const name = recommendation.targetUser.firstName && recommendation.targetUser.lastName
        ? `${recommendation.targetUser.firstName} ${recommendation.targetUser.lastName}`
        : recommendation.targetUser.email.split('@')[0];
      return `User: ${name}`;
    }
    if (recommendation.targetRole) {
      return `Role: ${recommendation.targetRole.name}`;
    }
    return 'System-wide';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            AI Permission Insights
          </h2>
          <p className="text-muted-foreground">
            Intelligent recommendations for optimal security and compliance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchRecommendations}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={generateRecommendations} disabled={generating}>
            {generating ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Brain className="w-4 h-4 mr-2" />
            )}
            Generate Insights
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                <p className="text-xl font-bold text-red-600">{stats.highPriority}</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Confidence</p>
                <p className="text-xl font-bold text-blue-600">{Math.round(stats.averageConfidence * 100)}%</p>
              </div>
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <p className="text-xl font-bold text-gray-600">{stats.rejected}</p>
              </div>
              <XCircle className="w-6 h-6 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="GRANT_PERMISSION">Grant Permission</SelectItem>
                <SelectItem value="REVOKE_PERMISSION">Revoke Permission</SelectItem>
                <SelectItem value="SECURITY_REVIEW">Security Review</SelectItem>
                <SelectItem value="ANOMALY_DETECTION">Anomaly Detection</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded" />
                      <div>
                        <Skeleton className="w-32 h-4 mb-2" />
                        <Skeleton className="w-24 h-3" />
                      </div>
                    </div>
                    <Skeleton className="w-16 h-6" />
                  </div>
                  <Skeleton className="w-full h-3 mb-2" />
                  <Skeleton className="w-3/4 h-3" />
                </div>
              ))}
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No AI recommendations yet</h3>
              <p className="text-muted-foreground mb-4">
                Generate AI insights to get intelligent permission recommendations
              </p>
              <Button onClick={generateRecommendations} disabled={generating}>
                {generating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Brain className="w-4 h-4 mr-2" />
                )}
                Generate Recommendations
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((recommendation) => {
                const riskLevel = getRiskLevel(recommendation.securityRiskScore);
                
                return (
                  <div key={recommendation.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getRecommendationIcon(recommendation.recommendationType)}
                        <div>
                          <div className="font-medium">{getRecommendationTypeLabel(recommendation.recommendationType)}</div>
                          <div className="text-sm text-muted-foreground">{getTargetDisplay(recommendation)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={riskLevel.color}>
                          {riskLevel.label} Risk
                        </Badge>
                        {getStatusBadge(recommendation.status)}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {recommendation.aiJustification}
                      </p>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Confidence</div>
                          <div className="flex items-center gap-2">
                            <Progress value={recommendation.aiConfidenceScore * 100} className="flex-1" />
                            <span className="font-medium">{Math.round(recommendation.aiConfidenceScore * 100)}%</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-muted-foreground">Security Risk</div>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={recommendation.securityRiskScore * 100} 
                              className="flex-1"
                            />
                            <span className="font-medium">{Math.round(recommendation.securityRiskScore * 100)}%</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-muted-foreground">Business Impact</div>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={recommendation.businessImpactScore * 100} 
                              className="flex-1"
                            />
                            <span className="font-medium">{Math.round(recommendation.businessImpactScore * 100)}%</span>
                          </div>
                        </div>
                      </div>
                      
                      {recommendation.status === 'PENDING' && (
                        <div className="flex items-center gap-2 pt-2">
                          <Button size="sm" variant="default" className="gap-1">
                            <ThumbsUp className="w-3 h-3" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1">
                            <ThumbsDown className="w-3 h-3" />
                            Reject
                          </Button>
                          <Button size="sm" variant="ghost" className="gap-1">
                            <Eye className="w-3 h-3" />
                            View Details
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
