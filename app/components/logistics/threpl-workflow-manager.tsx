
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Workflow, 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  BarChart3,
  Zap,
  Brain,
  Target,
  Users,
  FileText,
  Mail,
  Phone,
  Globe,
  Search,
  Filter,
  RefreshCw,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'AUTOMATIC' | 'MANUAL' | 'APPROVAL' | 'NOTIFICATION';
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  duration: number;
  assignee?: string;
  description: string;
}

interface WorkflowProcess {
  id: string;
  name: string;
  type: 'TRANSPORT_REQUEST' | 'QUOTE_COLLECTION' | 'ORDER_PROCESSING' | 'DELIVERY_NOTIFICATION';
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'FAILED';
  progress: number;
  steps: WorkflowStep[];
  startTime: Date;
  estimatedCompletion: Date;
  automationLevel: number;
}

export function ThreePLWorkflowManager() {
  const [workflows, setWorkflows] = useState<WorkflowProcess[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowProcess | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockWorkflows: WorkflowProcess[] = [
        {
          id: 'wf-001',
          name: 'Transport Request Processing',
          type: 'TRANSPORT_REQUEST',
          status: 'ACTIVE',
          progress: 65,
          startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
          estimatedCompletion: new Date(Date.now() + 1 * 60 * 60 * 1000),
          automationLevel: 85,
          steps: [
            { id: '1', name: 'Request Validation', type: 'AUTOMATIC', status: 'COMPLETED', duration: 5, description: 'Validate transport request data' },
            { id: '2', name: 'Supplier Matching', type: 'AUTOMATIC', status: 'COMPLETED', duration: 15, description: 'AI-powered supplier matching' },
            { id: '3', name: 'Quote Collection', type: 'AUTOMATIC', status: 'RUNNING', duration: 120, description: 'Collect quotes from suppliers' },
            { id: '4', name: 'Quote Comparison', type: 'AUTOMATIC', status: 'PENDING', duration: 10, description: 'AI quote comparison and ranking' },
            { id: '5', name: 'Final Approval', type: 'MANUAL', status: 'PENDING', duration: 30, assignee: 'M. Schmidt', description: 'Manual approval for high-value orders' }
          ]
        },
        {
          id: 'wf-002',
          name: 'Quote Collection Automation',
          type: 'QUOTE_COLLECTION',
          status: 'ACTIVE',
          progress: 90,
          startTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
          estimatedCompletion: new Date(Date.now() + 0.5 * 60 * 60 * 1000),
          automationLevel: 95,
          steps: [
            { id: '1', name: 'Send RFQ to Suppliers', type: 'AUTOMATIC', status: 'COMPLETED', duration: 5, description: 'Automated RFQ distribution' },
            { id: '2', name: 'Monitor Quote Responses', type: 'AUTOMATIC', status: 'COMPLETED', duration: 60, description: 'Real-time quote monitoring' },
            { id: '3', name: 'AI Quote Analysis', type: 'AUTOMATIC', status: 'RUNNING', duration: 20, description: 'AI-powered quote analysis' },
            { id: '4', name: 'Generate Comparison Report', type: 'AUTOMATIC', status: 'PENDING', duration: 10, description: 'Automated comparison report' }
          ]
        },
        {
          id: 'wf-003',
          name: 'Order Processing Complete',
          type: 'ORDER_PROCESSING',
          status: 'COMPLETED',
          progress: 100,
          startTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
          estimatedCompletion: new Date(Date.now() - 1 * 60 * 60 * 1000),
          automationLevel: 78,
          steps: [
            { id: '1', name: 'Order Confirmation', type: 'AUTOMATIC', status: 'COMPLETED', duration: 5, description: 'Automated order confirmation' },
            { id: '2', name: 'Supplier Notification', type: 'NOTIFICATION', status: 'COMPLETED', duration: 2, description: 'Notify selected supplier' },
            { id: '3', name: 'Document Generation', type: 'AUTOMATIC', status: 'COMPLETED', duration: 10, description: 'Generate order documents' },
            { id: '4', name: 'Customer Notification', type: 'NOTIFICATION', status: 'COMPLETED', duration: 2, description: 'Notify customer of order' },
            { id: '5', name: 'Tracking Setup', type: 'AUTOMATIC', status: 'COMPLETED', duration: 15, description: 'Setup tracking system' }
          ]
        },
        {
          id: 'wf-004',
          name: 'Delivery Notification Failed',
          type: 'DELIVERY_NOTIFICATION',
          status: 'FAILED',
          progress: 40,
          startTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
          estimatedCompletion: new Date(Date.now() - 2 * 60 * 60 * 1000),
          automationLevel: 60,
          steps: [
            { id: '1', name: 'Delivery Verification', type: 'AUTOMATIC', status: 'COMPLETED', duration: 10, description: 'Verify delivery completion' },
            { id: '2', name: 'Generate Delivery Receipt', type: 'AUTOMATIC', status: 'COMPLETED', duration: 5, description: 'Generate delivery receipt' },
            { id: '3', name: 'Send Customer Notification', type: 'NOTIFICATION', status: 'FAILED', duration: 2, description: 'Failed to send notification' },
            { id: '4', name: 'Update Order Status', type: 'AUTOMATIC', status: 'PENDING', duration: 5, description: 'Update order to delivered' },
            { id: '5', name: 'Generate Invoice', type: 'AUTOMATIC', status: 'PENDING', duration: 10, description: 'Generate final invoice' }
          ]
        },
        {
          id: 'wf-005',
          name: 'Bulk Transport Processing',
          type: 'TRANSPORT_REQUEST',
          status: 'PAUSED',
          progress: 25,
          startTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
          estimatedCompletion: new Date(Date.now() + 2 * 60 * 60 * 1000),
          automationLevel: 92,
          steps: [
            { id: '1', name: 'Bulk Request Validation', type: 'AUTOMATIC', status: 'COMPLETED', duration: 15, description: 'Validate multiple transport requests' },
            { id: '2', name: 'Route Optimization', type: 'AUTOMATIC', status: 'RUNNING', duration: 45, description: 'AI-powered route optimization' },
            { id: '3', name: 'Supplier Assignment', type: 'AUTOMATIC', status: 'PENDING', duration: 30, description: 'Assign optimal suppliers' },
            { id: '4', name: 'Bulk Quote Generation', type: 'AUTOMATIC', status: 'PENDING', duration: 60, description: 'Generate bulk quotes' },
            { id: '5', name: 'Approval Workflow', type: 'APPROVAL', status: 'PENDING', duration: 30, assignee: 'Operations Manager', description: 'Bulk order approval' }
          ]
        }
      ];

      setWorkflows(mockWorkflows);
    } catch (error) {
      console.error('Error fetching workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || workflow.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || workflow.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleWorkflowAction = async (workflowId: string, action: 'START' | 'PAUSE' | 'RESUME' | 'STOP') => {
    try {
      console.log(`${action} workflow ${workflowId}`);
      
      // Update workflow status
      setWorkflows(prev => prev.map(wf => 
        wf.id === workflowId 
          ? { ...wf, status: action === 'START' || action === 'RESUME' ? 'ACTIVE' : action === 'PAUSE' ? 'PAUSED' : 'COMPLETED' }
          : wf
      ));
    } catch (error) {
      console.error('Error updating workflow:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600';
      case 'RUNNING': return 'text-blue-600';
      case 'FAILED': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'RUNNING': return <Clock className="h-4 w-4 text-blue-600 animate-pulse" />;
      case 'FAILED': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading workflow manager...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Workflow Manager</h2>
          <p className="text-gray-600">Manage and monitor automated 3PL workflows</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Workflow
          </Button>
          <Button onClick={fetchWorkflows} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Workflows</p>
                <p className="text-2xl font-bold">{workflows.filter(w => w.status === 'ACTIVE').length}</p>
              </div>
              <Workflow className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold">{workflows.filter(w => w.status === 'COMPLETED').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Automation</p>
                <p className="text-2xl font-bold">
                  {Math.round(workflows.reduce((sum, w) => sum + w.automationLevel, 0) / workflows.length)}%
                </p>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed/Paused</p>
                <p className="text-2xl font-bold">{workflows.filter(w => w.status === 'FAILED' || w.status === 'PAUSED').length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="PAUSED">Paused</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="TRANSPORT_REQUEST">Transport Request</SelectItem>
            <SelectItem value="QUOTE_COLLECTION">Quote Collection</SelectItem>
            <SelectItem value="ORDER_PROCESSING">Order Processing</SelectItem>
            <SelectItem value="DELIVERY_NOTIFICATION">Delivery Notification</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Workflows List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredWorkflows.map((workflow) => (
          <motion.div
            key={workflow.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <CardTitle className="text-lg">{workflow.name}</CardTitle>
                      <Badge className={getStatusColor(workflow.status)}>
                        {workflow.status}
                      </Badge>
                      <Badge variant="outline">
                        {workflow.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>Started: {workflow.startTime.toLocaleTimeString()}</span>
                      <span>•</span>
                      <span>ETA: {workflow.estimatedCompletion.toLocaleTimeString()}</span>
                      <span>•</span>
                      <span>Automation: {workflow.automationLevel}%</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {workflow.status === 'ACTIVE' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWorkflowAction(workflow.id, 'PAUSE')}
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}
                    {workflow.status === 'PAUSED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWorkflowAction(workflow.id, 'RESUME')}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    {(workflow.status === 'ACTIVE' || workflow.status === 'PAUSED') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWorkflowAction(workflow.id, 'STOP')}
                      >
                        <Square className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedWorkflow(workflow)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-gray-600">{workflow.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${workflow.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-2">
                    {workflow.steps.map((step, index) => (
                      <div key={step.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                        <div className="flex-shrink-0">
                          {getStepIcon(step.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{step.name}</span>
                            <Badge variant="outline" className={`text-xs ${getStepStatusColor(step.status)}`}>
                              {step.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">{step.description}</p>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{step.duration}min</span>
                        </div>
                        {step.assignee && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Users className="h-3 w-3" />
                            <span>{step.assignee}</span>
                          </div>
                        )}
                        {index < workflow.steps.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredWorkflows.length === 0 && (
        <div className="text-center py-12">
          <Workflow className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No workflows found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Workflow
          </Button>
        </div>
      )}

      {/* Selected Workflow Detail Modal */}
      {selectedWorkflow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold">{selectedWorkflow.name}</h3>
                <p className="text-gray-600">{selectedWorkflow.type.replace('_', ' ')}</p>
              </div>
              <Button variant="outline" onClick={() => setSelectedWorkflow(null)}>
                Close
              </Button>
            </div>

            <div className="space-y-6">
              {/* Workflow Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={getStatusColor(selectedWorkflow.status)}>
                    {selectedWorkflow.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="font-medium">{selectedWorkflow.progress}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Automation Level</p>
                  <p className="font-medium">{selectedWorkflow.automationLevel}%</p>
                </div>
              </div>

              {/* Detailed Steps */}
              <div>
                <h4 className="font-semibold mb-4">Workflow Steps</h4>
                <div className="space-y-4">
                  {selectedWorkflow.steps.map((step, index) => (
                    <div key={step.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {getStepIcon(step.status)}
                          <span className="font-medium">{step.name}</span>
                          <Badge variant="outline">{step.type}</Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{step.duration} minutes</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                      {step.assignee && (
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Users className="h-4 w-4" />
                          <span>Assigned to: {step.assignee}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
