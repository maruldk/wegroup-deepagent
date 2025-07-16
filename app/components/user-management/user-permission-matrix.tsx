
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Shield, 
  Search, 
  Filter, 
  Save, 
  RefreshCw,
  Eye,
  Edit,
  Trash,
  Lock,
  AlertTriangle,
  CheckCircle,
  Info
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
}

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  userRoles: Array<{
    role: {
      id: string;
      name: string;
    };
  }>;
}

interface PermissionMatrixData {
  user: User;
  permissions: Record<string, {
    allowedActions: string[];
    deniedActions: string[];
    source: 'role' | 'override';
    hasOverride?: boolean;
    overrideReason?: string;
  }>;
}

interface UserPermissionMatrixProps {
  users: User[];
}

export function UserPermissionMatrix({ users }: UserPermissionMatrixProps) {
  const [menuPermissions, setMenuPermissions] = useState<MenuPermission[]>([]);
  const [permissionMatrix, setPermissionMatrix] = useState<PermissionMatrixData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Fetch menu permissions and user permission data
  useEffect(() => {
    fetchMenuPermissions();
    fetchUserPermissions();
  }, [users]);

  const fetchMenuPermissions = async () => {
    try {
      const response = await fetch('/api/permission-engine/menu-permissions');
      if (response.ok) {
        const data = await response.json();
        setMenuPermissions(data.menuPermissions || []);
      }
    } catch (error) {
      console.error('Error fetching menu permissions:', error);
    }
  };

  const fetchUserPermissions = async () => {
    if (users.length === 0) return;
    
    try {
      setLoading(true);
      const matrixData: PermissionMatrixData[] = [];
      
      for (const user of users.slice(0, 10)) { // Limit to first 10 users for performance
        const response = await fetch(`/api/user-management/users/${user.id}/permissions`);
        if (response.ok) {
          const data = await response.json();
          matrixData.push({
            user,
            permissions: data.effectivePermissions || {}
          });
        }
      }
      
      setPermissionMatrix(matrixData);
    } catch (error) {
      console.error('Error fetching user permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPermissions = menuPermissions.filter(permission => {
    const matchesSearch = permission.menuTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.menuKey.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = moduleFilter === 'all' || permission.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  const getPermissionIcon = (actions: string[], securityLevel: string) => {
    if (actions.includes('admin')) {
      return <Lock className="w-4 h-4 text-red-500" />;
    }
    if (actions.includes('write') || actions.includes('delete')) {
      return <Edit className="w-4 h-4 text-orange-500" />;
    }
    if (actions.includes('read')) {
      return <Eye className="w-4 h-4 text-green-500" />;
    }
    return <Shield className="w-4 h-4 text-gray-400" />;
  };

  const getSecurityLevelBadge = (level: string) => {
    const variants: Record<string, { variant: any; color: string }> = {
      'LOW': { variant: 'outline', color: 'text-green-600' },
      'STANDARD': { variant: 'secondary', color: 'text-blue-600' },
      'HIGH': { variant: 'destructive', color: 'text-orange-600' },
      'CRITICAL': { variant: 'destructive', color: 'text-red-600' }
    };
    
    const config = variants[level] || variants['STANDARD'];
    return (
      <Badge variant={config.variant} className={`text-xs ${config.color}`}>
        {level}
      </Badge>
    );
  };

  const getUserDisplayName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email.split('@')[0];
  };

  const hasPermission = (userPermissions: any, menuKey: string, action: string) => {
    const perm = userPermissions[menuKey];
    if (!perm) return false;
    return perm.allowedActions.includes(action) && !perm.deniedActions.includes(action);
  };

  const getPermissionStatus = (userPermissions: any, menuKey: string) => {
    const perm = userPermissions[menuKey];
    if (!perm) return 'none';
    if (perm.hasOverride) return 'override';
    if (perm.allowedActions.length > 0) return 'granted';
    return 'none';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Permission Matrix</h2>
          <p className="text-muted-foreground">
            Granular permission management across all users and menu items
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchUserPermissions}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          {selectedUsers.length > 0 && (
            <Button variant="outline">
              <Shield className="w-4 h-4 mr-2" />
              Bulk Actions ({selectedUsers.length})
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
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
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permission Matrix Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Permission Matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedUsers.length === users.slice(0, 10).length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedUsers(users.slice(0, 10).map(u => u.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead className="w-[200px] sticky left-0 bg-background">User</TableHead>
                  {filteredPermissions.slice(0, 15).map((permission) => (
                    <TableHead key={permission.id} className="min-w-[150px] text-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="space-y-1">
                              <div className="font-medium text-xs">{permission.menuTitle}</div>
                              <div className="flex items-center justify-center gap-1">
                                {getSecurityLevelBadge(permission.aiSecurityLevel)}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-2 max-w-xs">
                              <div className="font-medium">{permission.menuTitle}</div>
                              <div className="text-xs text-muted-foreground">{permission.menuPath}</div>
                              <div className="text-xs">Required: {permission.requiredActions.join(', ')}</div>
                              {permission.description && (
                                <div className="text-xs">{permission.description}</div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={filteredPermissions.length + 2} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Loading permission matrix...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  permissionMatrix.map((userMatrix) => (
                    <TableRow key={userMatrix.user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(userMatrix.user.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedUsers([...selectedUsers, userMatrix.user.id]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== userMatrix.user.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="sticky left-0 bg-background font-medium">
                        <div className="space-y-1">
                          <div className="text-sm">{getUserDisplayName(userMatrix.user)}</div>
                          <div className="text-xs text-muted-foreground">{userMatrix.user.email}</div>
                          <div className="flex flex-wrap gap-1">
                            {userMatrix.user.userRoles.map(ur => (
                              <Badge key={ur.role.id} variant="outline" className="text-xs">
                                {ur.role.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      {filteredPermissions.slice(0, 15).map((permission) => {
                        const status = getPermissionStatus(userMatrix.permissions, permission.menuKey);
                        const actions = userMatrix.permissions[permission.menuKey]?.allowedActions || [];
                        
                        return (
                          <TableCell key={permission.id} className="text-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <div className="flex flex-col items-center gap-1">
                                    {getPermissionIcon(actions, permission.aiSecurityLevel)}
                                    <div className="text-xs">
                                      {status === 'override' && (
                                        <Badge variant="outline" className="text-xs">Override</Badge>
                                      )}
                                      {status === 'granted' && !userMatrix.permissions[permission.menuKey]?.hasOverride && (
                                        <Badge variant="secondary" className="text-xs">Role</Badge>
                                      )}
                                      {status === 'none' && (
                                        <span className="text-muted-foreground">-</span>
                                      )}
                                    </div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="space-y-2 max-w-xs">
                                    <div className="font-medium">{permission.menuTitle}</div>
                                    {actions.length > 0 ? (
                                      <div>
                                        <div className="text-xs font-medium">Allowed Actions:</div>
                                        <div className="text-xs">{actions.join(', ')}</div>
                                      </div>
                                    ) : (
                                      <div className="text-xs text-muted-foreground">No access</div>
                                    )}
                                    {userMatrix.permissions[permission.menuKey]?.hasOverride && (
                                      <div className="text-xs text-orange-600">
                                        Custom override active
                                      </div>
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredPermissions.length > 15 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Showing first 15 permissions. Use search and filters to find specific permissions.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
