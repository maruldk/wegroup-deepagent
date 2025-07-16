
'use client';

import React, { useState } from 'react';
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
import { Plus, Crown, Shield, Brain, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface RoleCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleCreated: () => void;
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
  isTemplate: boolean;
  inheritFromRoleId: string | null;
  permissions: string[];
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

export function RoleCreateModal({ open, onOpenChange, onRoleCreated }: RoleCreateModalProps) {
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
    isTemplate: false,
    inheritFromRoleId: null,
    permissions: []
  });
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

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

  const generateAIRecommendations = async () => {
    try {
      setShowAIAssistant(true);
      const response = await fetch('/api/user-management/role-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisType: 'ROLE_CREATION_SUGGESTIONS',
          roleData: formData
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiRecommendations(data.recommendations || []);
      }
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      toast.error('Failed to generate AI recommendations');
    }
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
      const response = await fetch('/api/user-management/enhanced-roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onRoleCreated();
        // Reset form
        setFormData({
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
          isTemplate: false,
          inheritFromRoleId: null,
          permissions: []
        });
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create role');
      }
    } catch (error) {
      console.error('Error creating role:', error);
      toast.error('Error creating role');
    } finally {
      setLoading(false);
    }
  };

  const riskIndicator = getLevelRiskIndicator(formData.hierarchyLevel);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Role
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="hierarchy">Hierarchy</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
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
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value)}
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
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Access Level</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => handleInputChange('level', value)}
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
                  <Label htmlFor="maxUsers">Max Users (Optional)</Label>
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
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Entry (5)</span>
                      <span>Basic (25)</span>
                      <span>Standard (50)</span>
                      <span>High (75)</span>
                      <span>Critical (100)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Level Guidelines</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• 5-24: Basic access, entry-level</li>
                        <li>• 25-49: Standard operations</li>
                        <li>• 50-74: Management access</li>
                        <li>• 75-89: Senior/strategic access</li>
                        <li>• 90-100: Critical system access</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Security Considerations</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Higher levels require approval</li>
                        <li>• Automatic compliance checks</li>
                        <li>• Enhanced audit logging</li>
                        <li>• Regular access reviews</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Permission Configuration
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={generateAIRecommendations}
                      className="gap-2"
                    >
                      <Brain className="w-4 h-4" />
                      AI Suggestions
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Permission Assignment</h3>
                    <p>Permission configuration will be available after role creation.</p>
                    <p className="text-sm">You can assign specific permissions in the role edit interface.</p>
                  </div>
                </CardContent>
              </Card>

              {showAIAssistant && aiRecommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-blue-600" />
                      AI Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {aiRecommendations.map((rec, index) => (
                        <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Brain className="w-4 h-4 text-blue-600 mt-1" />
                            <div>
                              <p className="font-medium text-blue-900">{rec.title}</p>
                              <p className="text-sm text-blue-700">{rec.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Access Control</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="isTemplate">Role Template</Label>
                        <p className="text-sm text-muted-foreground">
                          Use as template for creating similar roles
                        </p>
                      </div>
                      <Switch
                        id="isTemplate"
                        checked={formData.isTemplate}
                        onCheckedChange={(checked) => handleInputChange('isTemplate', checked)}
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
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? 'Creating...' : 'Create Role'}
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
