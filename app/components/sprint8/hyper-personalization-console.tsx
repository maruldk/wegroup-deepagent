
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Brain, 
  Heart, 
  Target, 
  TrendingUp, 
  Eye, 
  Sparkles, 
  Users,
  MessageCircle,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Star,
  ThumbsUp,
  Navigation
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, AreaChart, Area, PieChart as RechartsPieChart, Cell, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

interface CustomerProfile {
  id: string;
  customer_id: string;
  name: string;
  segment: 'PREMIUM' | 'STANDARD' | 'BASIC' | 'VIP';
  engagement_score: number;
  satisfaction_score: number;
  lifetime_value: number;
  preferred_channels: string[];
  behavioral_patterns: string[];
  next_best_action: string;
}

interface CustomerJourney {
  id: string;
  customer_id: string;
  stage: 'AWARENESS' | 'CONSIDERATION' | 'PURCHASE' | 'RETENTION' | 'ADVOCACY';
  touchpoints: string[];
  satisfaction_rating: number;
  conversion_probability: number;
  personalization_level: number;
  predicted_next_stage: string;
}

interface PersonalizationRule {
  id: string;
  rule_name: string;
  condition: string;
  action: string;
  effectiveness_score: number;
  usage_count: number;
  conversion_impact: number;
  status: 'ACTIVE' | 'TESTING' | 'PAUSED' | 'ARCHIVED';
}

const customerProfiles: CustomerProfile[] = [
  {
    id: 'cp-001',
    customer_id: 'cust-12345',
    name: 'Sarah Johnson',
    segment: 'PREMIUM',
    engagement_score: 92,
    satisfaction_score: 88,
    lifetime_value: 25000,
    preferred_channels: ['Email', 'Mobile App', 'Phone'],
    behavioral_patterns: ['Early Adopter', 'High Spender', 'Frequent Buyer'],
    next_best_action: 'Recommend premium upgrade'
  },
  {
    id: 'cp-002',
    customer_id: 'cust-67890',
    name: 'Michael Chen',
    segment: 'STANDARD',
    engagement_score: 76,
    satisfaction_score: 82,
    lifetime_value: 12500,
    preferred_channels: ['Web', 'Chat', 'Social Media'],
    behavioral_patterns: ['Price Sensitive', 'Research Heavy', 'Comparison Shopper'],
    next_best_action: 'Offer discount incentive'
  },
  {
    id: 'cp-003',
    customer_id: 'cust-54321',
    name: 'Emma Davis',
    segment: 'VIP',
    engagement_score: 98,
    satisfaction_score: 95,
    lifetime_value: 45000,
    preferred_channels: ['Personal Assistant', 'VIP Portal', 'Direct Call'],
    behavioral_patterns: ['Luxury Focused', 'Brand Loyal', 'Influence Networks'],
    next_best_action: 'Invite to exclusive event'
  }
];

const customerJourneys: CustomerJourney[] = [
  {
    id: 'cj-001',
    customer_id: 'cust-12345',
    stage: 'RETENTION',
    touchpoints: ['Email Campaign', 'Product Usage', 'Support Chat', 'Billing'],
    satisfaction_rating: 4.5,
    conversion_probability: 85,
    personalization_level: 94,
    predicted_next_stage: 'ADVOCACY'
  },
  {
    id: 'cj-002',
    customer_id: 'cust-67890',
    stage: 'CONSIDERATION',
    touchpoints: ['Website Visit', 'Product Demo', 'Pricing Page', 'Comparison Tool'],
    satisfaction_rating: 4.0,
    conversion_probability: 68,
    personalization_level: 76,
    predicted_next_stage: 'PURCHASE'
  },
  {
    id: 'cj-003',
    customer_id: 'cust-54321',
    stage: 'ADVOCACY',
    touchpoints: ['Referral Program', 'VIP Events', 'Product Feedback', 'Beta Testing'],
    satisfaction_rating: 4.8,
    conversion_probability: 92,
    personalization_level: 98,
    predicted_next_stage: 'ADVOCACY'
  }
];

const personalizationRules: PersonalizationRule[] = [
  {
    id: 'pr-001',
    rule_name: 'High-Value Customer Upsell',
    condition: 'LTV > $20K AND Engagement > 85%',
    action: 'Show premium features',
    effectiveness_score: 87,
    usage_count: 1250,
    conversion_impact: 23.5,
    status: 'ACTIVE'
  },
  {
    id: 'pr-002',
    rule_name: 'Price-Sensitive Discount',
    condition: 'Segment = STANDARD AND Cart Abandonment',
    action: 'Apply 10% discount',
    effectiveness_score: 72,
    usage_count: 890,
    conversion_impact: 18.2,
    status: 'ACTIVE'
  },
  {
    id: 'pr-003',
    rule_name: 'VIP Experience Enhancement',
    condition: 'Segment = VIP',
    action: 'Enable white-glove service',
    effectiveness_score: 95,
    usage_count: 156,
    conversion_impact: 34.7,
    status: 'ACTIVE'
  }
];

const engagementData = [
  { month: 'Jan', email: 65, mobile: 78, web: 82, chat: 45 },
  { month: 'Feb', email: 72, mobile: 85, web: 87, chat: 52 },
  { month: 'Mar', email: 78, mobile: 88, web: 91, chat: 58 },
  { month: 'Apr', email: 82, mobile: 92, web: 89, chat: 65 },
  { month: 'May', email: 85, mobile: 95, web: 93, chat: 72 },
  { month: 'Jun', email: 88, mobile: 97, web: 96, chat: 78 }
];

const segmentData = [
  { segment: 'VIP', count: 156, revenue: 7020000 },
  { segment: 'Premium', count: 890, revenue: 22250000 },
  { segment: 'Standard', count: 3450, revenue: 43125000 },
  { segment: 'Basic', count: 12500, revenue: 31250000 }
];

const sentimentData = [
  { category: 'Product Quality', positive: 82, negative: 8, neutral: 10 },
  { category: 'Customer Service', positive: 78, negative: 12, neutral: 10 },
  { category: 'Pricing', positive: 65, negative: 25, neutral: 10 },
  { category: 'User Experience', positive: 85, negative: 7, neutral: 8 },
  { category: 'Features', positive: 80, negative: 10, neutral: 10 },
  { category: 'Support', positive: 88, negative: 5, neutral: 7 }
];

const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#80D8C3'];

export function HyperPersonalizationConsole() {
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [avgEngagement, setAvgEngagement] = useState(0);
  const [personalizationScore, setPersonalizationScore] = useState(0);
  const [conversionLift, setConversionLift] = useState(0);

  useEffect(() => {
    const profiles = customerProfiles.length;
    const engagement = customerProfiles.reduce((sum, p) => sum + p.engagement_score, 0) / customerProfiles.length;
    const personalization = customerJourneys.reduce((sum, j) => sum + j.personalization_level, 0) / customerJourneys.length;
    const conversion = personalizationRules.reduce((sum, r) => sum + r.conversion_impact, 0) / personalizationRules.length;
    
    setTotalProfiles(profiles);
    setAvgEngagement(engagement);
    setPersonalizationScore(personalization);
    setConversionLift(conversion);
  }, []);

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'VIP': return 'bg-purple-100 text-purple-800';
      case 'PREMIUM': return 'bg-gold-100 text-gold-800 bg-yellow-100 text-yellow-800';
      case 'STANDARD': return 'bg-blue-100 text-blue-800';
      case 'BASIC': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'AWARENESS': return 'bg-blue-100 text-blue-800';
      case 'CONSIDERATION': return 'bg-yellow-100 text-yellow-800';
      case 'PURCHASE': return 'bg-green-100 text-green-800';
      case 'RETENTION': return 'bg-purple-100 text-purple-800';
      case 'ADVOCACY': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'TESTING': return 'bg-blue-500';
      case 'PAUSED': return 'bg-yellow-500';
      case 'ARCHIVED': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl">
              <User className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Hyper-Personalization Console
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Neural Customer Profiles & Predictive Journey Optimization
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-pink-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-pink-600">Active Profiles</p>
                  <p className="text-3xl font-bold text-pink-900">{totalProfiles}K</p>
                </div>
                <Users className="h-8 w-8 text-pink-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Avg Engagement</p>
                  <p className="text-3xl font-bold text-purple-900">{avgEngagement.toFixed(0)}%</p>
                </div>
                <Heart className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Personalization Score</p>
                  <p className="text-3xl font-bold text-blue-900">{personalizationScore.toFixed(0)}%</p>
                </div>
                <Brain className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Conversion Lift</p>
                  <p className="text-3xl font-bold text-green-900">+{conversionLift.toFixed(0)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="profiles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profiles">Neural Profiles</TabsTrigger>
            <TabsTrigger value="journeys">Journey Maps</TabsTrigger>
            <TabsTrigger value="rules">Rules Engine</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Neural Customer Profiles
              </h3>
              {customerProfiles.map((profile) => (
                <Card key={profile.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold">{profile.name}</h4>
                        <p className="text-sm text-gray-500">
                          LTV: ${(profile.lifetime_value / 1000).toFixed(0)}K | ID: {profile.customer_id}
                        </p>
                        <p className="text-sm font-medium text-blue-600 mt-1">
                          Next Best Action: {profile.next_best_action}
                        </p>
                      </div>
                      <Badge className={getSegmentColor(profile.segment)}>
                        {profile.segment}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Engagement Score</span>
                          <span>{profile.engagement_score}%</span>
                        </div>
                        <Progress value={profile.engagement_score} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Satisfaction Score</span>
                          <span>{profile.satisfaction_score}%</span>
                        </div>
                        <Progress value={profile.satisfaction_score} className="h-2" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 block mb-1">Preferred Channels</span>
                        <div className="flex gap-1 flex-wrap">
                          {profile.preferred_channels.map((channel, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {channel}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1">Behavioral Patterns</span>
                        <div className="flex gap-1 flex-wrap">
                          {profile.behavioral_patterns.map((pattern, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {pattern}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="journeys" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Predictive Customer Journey Maps
              </h3>
              {customerJourneys.map((journey) => (
                <Card key={journey.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold">Customer ID: {journey.customer_id}</h4>
                        <p className="text-sm text-gray-500">
                          Conversion Probability: {journey.conversion_probability}%
                        </p>
                        <p className="text-sm font-medium text-blue-600 mt-1">
                          Predicted Next Stage: {journey.predicted_next_stage}
                        </p>
                      </div>
                      <Badge className={getStageColor(journey.stage)}>
                        {journey.stage}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Personalization Level</span>
                          <span>{journey.personalization_level}%</span>
                        </div>
                        <Progress value={journey.personalization_level} className="h-2" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Satisfaction: {journey.satisfaction_rating}/5</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500 text-sm block mb-1">Touchpoints</span>
                      <div className="flex gap-1 flex-wrap">
                        {journey.touchpoints.map((touchpoint, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {touchpoint}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Personalization Rules Engine
              </h3>
              {personalizationRules.map((rule) => (
                <Card key={rule.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold">{rule.rule_name}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          <strong>Condition:</strong> {rule.condition}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Action:</strong> {rule.action}
                        </p>
                        <p className="text-sm font-medium text-green-600 mt-1">
                          Conversion Impact: +{rule.conversion_impact}%
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(rule.status)} text-white`}>
                        {rule.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Effectiveness Score</span>
                          <span>{rule.effectiveness_score}%</span>
                        </div>
                        <Progress value={rule.effectiveness_score} className="h-2" />
                      </div>
                      <div className="text-center">
                        <span className="text-gray-500 text-sm">Usage Count</span>
                        <p className="text-lg font-semibold">{rule.usage_count.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <span className="text-gray-500 text-sm">Conversion Impact</span>
                        <p className="text-lg font-semibold text-green-600">+{rule.conversion_impact}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="sentiment" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Real-time Sentiment Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={sentimentData} layout="horizontal">
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis type="category" dataKey="category" tick={{ fontSize: 10 }} width={100} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="positive" stackId="a" fill="#80D8C3" name="Positive" />
                      <Bar dataKey="neutral" stackId="a" fill="#FF90BB" name="Neutral" />
                      <Bar dataKey="negative" stackId="a" fill="#FF9898" name="Negative" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Channel Engagement Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={engagementData}>
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="email" stroke="#60B5FF" strokeWidth={2} name="Email" />
                      <Line type="monotone" dataKey="mobile" stroke="#FF9149" strokeWidth={2} name="Mobile" />
                      <Line type="monotone" dataKey="web" stroke="#80D8C3" strokeWidth={2} name="Web" />
                      <Line type="monotone" dataKey="chat" stroke="#FF90BB" strokeWidth={2} name="Chat" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Customer Segment Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Tooltip formatter={(value) => [`$${(Number(value) / 1000000).toFixed(1)}M`, 'Revenue']} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <RechartsPieChart dataKey="revenue" data={segmentData} cx="50%" cy="50%" outerRadius={80}>
                        {segmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </RechartsPieChart>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Optimization Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { 
                      opportunity: 'Cross-sell to Premium Customers',
                      potential_lift: '+15%',
                      confidence: 92,
                      implementation: 'Easy'
                    },
                    { 
                      opportunity: 'Retention Campaign for At-Risk Segment',
                      potential_lift: '+8%',
                      confidence: 88,
                      implementation: 'Medium'
                    },
                    { 
                      opportunity: 'Upsell VIP Experience',
                      potential_lift: '+25%',
                      confidence: 78,
                      implementation: 'Easy'
                    },
                    { 
                      opportunity: 'Personalized Onboarding',
                      potential_lift: '+12%',
                      confidence: 85,
                      implementation: 'Hard'
                    },
                    { 
                      opportunity: 'Dynamic Pricing Optimization',
                      potential_lift: '+18%',
                      confidence: 82,
                      implementation: 'Medium'
                    }
                  ].map((opp, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold">{opp.opportunity}</h5>
                        <Badge className="bg-green-100 text-green-800">
                          {opp.potential_lift}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Confidence</span>
                          <div className="flex items-center gap-2">
                            <Progress value={opp.confidence} className="h-1 flex-1" />
                            <span>{opp.confidence}%</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Implementation</span>
                          <p className="font-medium">{opp.implementation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
