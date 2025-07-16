
'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Edit, 
  Crown, 
  Shield, 
  Brain, 
  AlertTriangle, 
  Users,
  Activity,
  TrendingUp,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedRole {
  id: string;
  name: string;
  description: string | null;
  category: string;
  level: string;
  hierarchyLevel: number;
  levelColor: string;
  levelBadge: string;
  userCount: number;
  permissionCount: number;
  isSystem: boolean;
  isTemplate: boolean;
  isActive: boolean;
  isVisible: boolean;
  isAutoAssignable: boolean;
  requiresApproval: boolean;
  departmentRestrictions: string[];
  maxUsers: number | null;
  complianceLevel: string;
  aiRecommendationScore: number;
  aiRiskAssessment: number;
  aiSecurityScore: number;
  userEnhancedRoles: Array<{
    user: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
      isActive: boolean;
    };
    isActive: boolean;
    assignedAt: string;
  }>;
  inheritFromRole?: {
    id: string;
    name: string;
    hierarchyLevel: number;
  };
  childRoles: Array<{
    id: string;
    name: string;
    hierarchyLevel: number;
  }>;
}

interface RoleEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: EnhancedRole;
  onRoleUpdated: () => void;
}

interface RoleFormData {
  name: string;
  description: string;
  category: string;
  level: string;
  hierarchyLevel: number;
  levelColor: string;
  departmentRestrictions: string[];
  maxUsers: number | null;
  isAutoAssignable: boolean;
  requiresApproval: boolean;
  isActive: boolean;
  isVisible: boolean;
  complianceLevel: string;
}

const ROLE_CATEGORIES = [
  { value: 'EXECUTIVE', label: 'Executive', color: 'purple' },
  { value: 'MANAGEMENT', label: 'Management', color: 'blue' },
  { value: 'OPERATIONAL', label: 'Operational', color: 'green' },
  { value: 'TECHNICAL', label: 'Technical', color: 'orange' },
  { value: 'ADMINISTRATIVE', label: 'Administrative', color: 'gray' },
  { value: 'EXTERNAL', label: 'External', color: 'red' }
];

const ROLE_LEVELS = [
  { value: 'BASIC', label: 'Basic' },
  { value: 'STANDARD', label: 'Standard' },
  { value: 'ADVANCED', label: 'Advanced' },
  { value: 'EXPERT', label: 'Expert' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'SUPER_ADMIN', label: 'Super Admin' }
];

const COMPLIANCE_LEVELS = [
  { value: 'LOW', label: 'Low', color: 'green' },
  { value: 'STANDARD', label: 'Standard', color: 'blue' },
  { value: 'HIGH', label: 'High', color: 'orange' },
  { value: 'CRITICAL', label: 'Critical', color: 'red' }
];

const DEPARTMENTS = [
  'Human Resources',
  'Finance',
  'Operations',
  'IT',
  'Sales',
  'Marketing',
  'Legal',
  'Procurement'
];

export function RoleEditModal({ open, onOpenChange, role, onRoleUpdated }: RoleEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
    category: 'OPERATIONAL',
    level: 'STANDARD',
    hierarchyLevel: 50,
    levelColor: '#2563EB',
    departmentRestrictions: [],
    maxUsers: null,
    isAutoAssignable: false,
    requiresApproval: false,
    isActive: true,
    isVisible: true,
    complianceLevel: 'STANDARD'
  });
  const [roleDetails, setRoleDetails] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<any[]>([]);

  useEffect(() => {
    if (role && open) {
      setFormData({
        name: role.name,
        description: role.description || '',
        category: role.category,
        level: role.level,
        hierarchyLevel: role.hierarchyLevel,
        levelColor: role.levelColor || '#2563EB',
        departmentRestrictions: role.departmentRestrictions || [],
        maxUsers: role.maxUsers,
        isAutoAssignable: role.isAutoAssignable,
        requiresApproval: role.requiresApproval,
        isActive: role.isActive,
        isVisible: role.isVisible,
        complianceLevel: role.complianceLevel || 'STANDARD'
      });
      fetchRoleDetails();
      generateAIInsights();
    }
  }, [role, open]);

  const fetchRoleDetails = async () => {
    try {
      const response = await fetch(`/api/user-management/enhanced-roles/${role.id}`);
      if (response.ok) {
        const data = await response.json();
        setRoleDetails(data.role);
      }
    } catch (error) {
      console.error('Error fetching role details:', error);
    }
  };

  const generateAIInsights = async () => {
    try {
      const response = await fetch('/api/user-management/role-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisType: 'ROLE_OPTIMIZATION',
          targetRoleId: role.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiInsights(data.recommendations || []);
      }
    } catch (error) {
      console.error('Error generating AI insights:', error);
    }
  };

  const handleInputChange = (field: keyof RoleFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate level color based on hierarchy level
    if (field === 'hierarchyLevel') {
      const color = getLevelColor(value as number);
      setFormData(prev => ({
        ...prev,
        levelColor: color
      }));
    }
  };

  const handleDepartmentToggle = (department: string) => {
    setFormData(prev => ({
      ...prev,
      departmentRestrictions: prev.departmentRestrictions.includes(department)
        ? prev.departmentRestrictions.filter(d => d !== department)
        : [...prev.departmentRestrictions, department]
    }));
  };

  const getLevelColor = (level: number): string => {
    if (level >= 90) return '#DC2626'; // Red - Critical
    if (level >= 75) return '#EA580C'; // Orange - High
    if (level >= 50) return '#2563EB'; // Blue - Standard
    if (level >= 25) return '#16A34A'; // Green - Basic
    return '#6B7280'; // Gray - Entry
  };

  const getLevelRiskIndicator = (level: number) => {
    if (level >= 90) return { icon: AlertTriangle, text: 'Critical Access', color: 'text-red-600' };
    if (level >= 75) return { icon: Shield, text: 'High Privilege', color: 'text-orange-600' };
    if (level >= 50) return { icon: Crown, text: 'Standard Access', color: 'text-blue-600' };
    return { icon: Shield, text: 'Limited Access', color: 'text-green-600' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Role name is required');
      return;
    }

    if (formData.hierarchyLevel < 5 || formData.hierarchyLevel > 100) {
      toast.error('Hierarchy level must be between 5 and 100');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/user-management/enhanced-roles/${role.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onRoleUpdated();
        toast.success('Role updated successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update role');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Error updating role');
    } finally {
      setLoading(false);
    }
  };

  const riskIndicator = getLevelRiskIndicator(formData.hierarchyLevel);
  const activeUsers = role.userEnhancedRoles?.filter(ur => ur.isActive) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Edit Role: {role.name}
            {role.isSystem && (
              <Badge variant="secondary" className="gap-1">
                <Crown className="w-3 h-3" />
                System
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Edit Form */}
          <div className="col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="hierarchy">Hierarchy</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Role Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter role name"
                        disabled={role.isSystem}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleInputChange('category', value)}
                        disabled={role.isSystem}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLE_CATEGORIES.map(cat => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe the role's purpose and responsibilities"
                      rows={3}
                      disabled={role.isSystem}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="level">Access Level</Label>
                      <Select
                        value={formData.level}
                        onValueChange={(value) => handleInputChange('level', value)}
                        disabled={role.isSystem}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLE_LEVELS.map(level => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="compliance">Compliance Level</Label>
                      <Select
                        value={formData.complianceLevel}
                        onValueChange={(value) => handleInputChange('complianceLevel', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COMPLIANCE_LEVELS.map(level => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxUsers">Max Users</Label>
                      <Input
                        id="maxUsers"
                        type="number"
                        value={formData.maxUsers || ''}
                        onChange={(e) => handleInputChange('maxUsers', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="No limit"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="hierarchy" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Hierarchy Level Configuration
                        <Badge 
                          style={{ backgroundColor: formData.levelColor + '20', color: formData.levelColor }}
                          className="ml-2"
                        >
                          Level {formData.hierarchyLevel}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Hierarchy Level (5-100)</Label>
                          <div className="flex items-center gap-2">
                            <riskIndicator.icon className={`w-4 h-4 ${riskIndicator.color}`} />
                            <span className={`text-sm ${riskIndicator.color}`}>
                              {riskIndicator.text}
                            </span>
                          </div>
                        </div>
                        <Slider
                          value={[formData.hierarchyLevel]}
                          onValueChange={([value]) => handleInputChange('hierarchyLevel', value)}
                          min={5}
                          max={100}
                          step={5}
                          className="w-full"
                          disabled={role.isSystem}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Entry (5)</span>
                          <span>Basic (25)</span>
                          <span>Standard (50)</span>
                          <span>High (75)</span>
                          <span>Critical (100)</span>
                        </div>
                      </div>

                      {role.inheritFromRole && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">Inheritance Chain</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {role.inheritFromRole.name} (Level {role.inheritFromRole.hierarchyLevel})
                            </Badge>
                            <span className="text-blue-700">→</span>
                            <Badge variant="outline">
                              {role.name} (Level {role.hierarchyLevel})
                            </Badge>
                          </div>
                        </div>
                      )}

                      {role.childRoles.length > 0 && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <h4 className="font-medium text-green-900 mb-2">Child Roles</h4>
                          <div className="flex flex-wrap gap-2">
                            {role.childRoles.map(child => (
                              <Badge key={child.id} variant="outline">
                                {child.name} (Level {child.hierarchyLevel})
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Assigned Users ({activeUsers.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {activeUsers.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                          <p>No users currently assigned to this role</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {activeUsers.map(({ user, assignedAt }) => (
                            <div key={user.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                                  {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {user.firstName && user.lastName 
                                      ? `${user.firstName} ${user.lastName}` 
                                      : user.email}
                                  </p>
                                  <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant={user.isActive ? "default" : "secondary"}>
                                  {user.isActive ? "Active" : "Inactive"}
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Assigned {new Date(assignedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <div className="grid grid-cols-1 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Access Control Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="isActive">Role Active</Label>
                            <p className="text-sm text-muted-foreground">
                              Enable or disable this role
                            </p>
                          </div>
                          <Switch
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                            disabled={role.isSystem}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="isVisible">Role Visible</Label>
                            <p className="text-sm text-muted-foreground">
                              Show role in assignment lists
                            </p>
                          </div>
                          <Switch
                            id="isVisible"
                            checked={formData.isVisible}
                            onCheckedChange={(checked) => handleInputChange('isVisible', checked)}
                            disabled={role.isSystem}
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="autoAssign">AI Auto-Assignment</Label>
                            <p className="text-sm text-muted-foreground">
                              Allow AI to automatically assign this role
                            </p>
                          </div>
                          <Switch
                            id="autoAssign"
                            checked={formData.isAutoAssignable}
                            onCheckedChange={(checked) => handleInputChange('isAutoAssignable', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="requireApproval">Require Approval</Label>
                            <p className="text-sm text-muted-foreground">
                              Manual approval required for assignment
                            </p>
                          </div>
                          <Switch
                            id="requireApproval"
                            checked={formData.requiresApproval}
                            onCheckedChange={(checked) => handleInputChange('requiresApproval', checked)}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Department Restrictions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Label>Allowed Departments</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {DEPARTMENTS.map(dept => (
                              <div key={dept} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={dept}
                                  checked={formData.departmentRestrictions.includes(dept)}
                                  onChange={() => handleDepartmentToggle(dept)}
                                  className="rounded"
                                />
                                <Label htmlFor={dept} className="text-sm">
                                  {dept}
                                </Label>
                              </div>
                            ))}
                          </div>
                          {formData.departmentRestrictions.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                              No restrictions - available to all departments
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex items-center justify-between pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || role.isSystem} className="gap-2">
                  {loading ? 'Updating...' : 'Update Role'}
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar with Insights */}
          <div className="space-y-6">
            {/* Role Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Role Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Users</span>
                  <Badge variant="outline">{role.userCount}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Permissions</span>
                  <Badge variant="outline">{role.permissionCount}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Level</span>
                  <Badge 
                    style={{ backgroundColor: role.levelColor + '20', color: role.levelColor }}
                  >
                    {role.hierarchyLevel}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Security Score</span>
                  <Badge variant={role.aiSecurityScore > 0.7 ? "default" : "secondary"}>
                    {((role.aiSecurityScore || 0) * 100).toFixed(0)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            {aiInsights.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {aiInsights.slice(0, 3).map((insight, index) => (
                      <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Brain className="w-4 h-4 text-blue-600 mt-1" />
                          <div>
                            <p className="font-medium text-blue-900 text-sm">{insight.title}</p>
                            <p className="text-xs text-blue-700">{insight.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {insight.priority} Priority
                              </Badge>
                              <span className="text-xs text-blue-600">
                                {(insight.confidenceScore * 100).toFixed(0)}% confidence
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Performance Metrics */}
            {roleDetails?.metrics && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Users</span>
                    <span className="font-medium">{roleDetails.metrics.activeUserCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Assignments</span>
                    <span className="font-medium">{roleDetails.metrics.totalAssignments}</span>
                  </div>
                  {roleDetails.metrics.lastActivity && (
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Last activity: {new Date(roleDetails.metrics.lastActivity).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
