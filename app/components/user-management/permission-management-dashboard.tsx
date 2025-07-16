
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Search, 
  Filter, 
  Plus, 
  Settings, 
  Eye, 
  Edit,
  Lock,
  Globe,
  Building,
  Users
} from 'lucide-react';

interface MenuPermission {
  id: string;
  menuKey: string;
  menuTitle: string;
  menuPath: string;
  module: string;
  requiredActions: string[];
  aiSecurityLevel: string;
  description: string | null;
  isVisible: boolean;
  sortOrder: number;
  roleMenuPermissions: Array<{
    role: {
      name: string;
    };
  }>;
}

export function PermissionManagementDashboard() {
  const [menuPermissions, setMenuPermissions] = useState<MenuPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [securityFilter, setSecurityFilter] = useState('all');

  useEffect(() => {
    fetchMenuPermissions();
  }, [moduleFilter]);

  const fetchMenuPermissions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (moduleFilter !== 'all') params.append('module', moduleFilter);

      const response = await fetch(`/api/permission-engine/menu-permissions?${params}`);
      if (response.ok) {
        const data = await response.json();
        setMenuPermissions(data.menuPermissions || []);
      }
    } catch (error) {
      console.error('Error fetching menu permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPermissions = menuPermissions.filter(permission => {
    const matchesSearch = permission.menuTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.menuKey.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSecurity = securityFilter === 'all' || permission.aiSecurityLevel === securityFilter;
    return matchesSearch && matchesSecurity;
  });

  const getSecurityLevelBadge = (level: string) => {
    const variants: Record<string, { variant: any; color: string; icon: React.ReactNode }> = {
      'LOW': { variant: 'outline', color: 'text-green-600', icon: <Globe className="w-3 h-3" /> },
      'STANDARD': { variant: 'secondary', color: 'text-blue-600', icon: <Building className="w-3 h-3" /> },
      'HIGH': { variant: 'destructive', color: 'text-orange-600', icon: <Shield className="w-3 h-3" /> },
      'CRITICAL': { variant: 'destructive', color: 'text-red-600', icon: <Lock className="w-3 h-3" /> }
    };
    
    const config = variants[level] || variants['STANDARD'];
    return (
      <Badge variant={config.variant} className={`${config.color} gap-1`}>
        {config.icon}
        {level}
      </Badge>
    );
  };

  const getModuleBadge = (module: string) => {
    const colors: Record<string, string> = {
      'HR': 'bg-blue-100 text-blue-800',
      'FINANCE': 'bg-green-100 text-green-800',
      'LOGISTICS': 'bg-purple-100 text-purple-800',
      'AI_ENGINE': 'bg-red-100 text-red-800',
      'MONITORING': 'bg-orange-100 text-orange-800',
      'SECURITY': 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge variant="outline" className={colors[module] || 'bg-gray-100 text-gray-800'}>
        {module}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Permission Management</h1>
          <p className="text-muted-foreground">
            Configure granular permissions and security policies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Shield className="w-4 h-4" />
            Security Analysis
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Permission
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Permissions</p>
                <p className="text-2xl font-bold">{menuPermissions.length}</p>
              </div>
              <Shield className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Permissions</p>
                <p className="text-2xl font-bold text-red-600">
                  {menuPermissions.filter(p => p.aiSecurityLevel === 'CRITICAL').length}
                </p>
              </div>
              <Lock className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Modules</p>
                <p className="text-2xl font-bold text-blue-600">
                  {new Set(menuPermissions.map(p => p.module)).size}
                </p>
              </div>
              <Building className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Assignments</p>
                <p className="text-2xl font-bold text-green-600">
                  {menuPermissions.reduce((sum, p) => sum + p.roleMenuPermissions.length, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modules</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="FINANCE">Finance</SelectItem>
                  <SelectItem value="LOGISTICS">Logistics</SelectItem>
                  <SelectItem value="AI_ENGINE">AI Engine</SelectItem>
                  <SelectItem value="MONITORING">Monitoring</SelectItem>
                  <SelectItem value="SECURITY">Security</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={securityFilter} onValueChange={setSecurityFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Security level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="STANDARD">Standard</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPermissions.map((permission) => (
          <Card key={permission.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{permission.menuTitle}</CardTitle>
                  <p className="text-sm text-muted-foreground">{permission.menuPath}</p>
                </div>
                <div className="flex flex-col gap-1">
                  {getModuleBadge(permission.module)}
                  {getSecurityLevelBadge(permission.aiSecurityLevel)}
                </div>
              </div>
              {permission.description && (
                <p className="text-sm text-muted-foreground">{permission.description}</p>
              )}
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Required Actions:</span>
                <div className="flex flex-wrap gap-1">
                  {permission.requiredActions.map((action) => (
                    <Badge key={action} variant="outline" className="text-xs">
                      {action}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Role Assignments:</span>
                <Badge variant="outline">
                  {permission.roleMenuPermissions.length} role{permission.roleMenuPermissions.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1 gap-1">
                  <Eye className="w-3 h-3" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1 gap-1">
                  <Edit className="w-3 h-3" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="flex-1 gap-1">
                  <Settings className="w-3 h-3" />
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPermissions.length === 0 && !loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No permissions found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Try adjusting your search criteria' : 'Create your first permission to get started'}
            </p>
            {!searchTerm && (
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Permission
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
