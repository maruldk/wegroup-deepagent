
'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from 'sonner';
import { 
  Shield, 
  Save, 
  X, 
  RefreshCw,
  Eye,
  Edit,
  Trash,
  Lock,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  User
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

interface UserPermissionData {
  menuPermissionId: string;
  allowedActions: string[];
  deniedActions: string[];
  source: 'role' | 'override';
  hasOverride?: boolean;
  overrideReason?: string;
  overrideType?: string;
}

interface UserEditData {
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

interface PermissionEditorModalProps {
  user: UserEditData | null;
  isOpen: boolean;
  onClose: () => void;
  onPermissionsUpdated: () => void;
}

export function PermissionEditorModal({ 
  user, 
  isOpen, 
  onClose, 
  onPermissionsUpdated 
}: PermissionEditorModalProps) {
  const [menuPermissions, setMenuPermissions] = useState<MenuPermission[]>([]);
  const [userPermissions, setUserPermissions] = useState<Record<string, UserPermissionData>>({});
  const [originalPermissions, setOriginalPermissions] = useState<Record<string, UserPermissionData>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [overrideReason, setOverrideReason] = useState('');
  const [changedPermissions, setChangedPermissions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen && user) {
      fetchData();
    }
  }, [isOpen, user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch menu permissions and user permissions
      const [menuResponse, userPermResponse] = await Promise.all([
        fetch('/api/permission-engine/menu-permissions'),
        fetch(`/api/user-management/users/${user.id}/permissions`)
      ]);

      if (menuResponse.ok) {
        const menuData = await menuResponse.json();
        setMenuPermissions(menuData.menuPermissions || []);
      }

      if (userPermResponse.ok) {
        const userPermData = await userPermResponse.json();
        const perms = userPermData.effectivePermissions || {};
        setUserPermissions(perms);
        setOriginalPermissions(JSON.parse(JSON.stringify(perms)));
      }

    } catch (error) {
      console.error('Error fetching permission data:', error);
      toast.error('Failed to load permission data');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (menuKey: string, action: string, allowed: boolean) => {
    const current = userPermissions[menuKey] || {
      menuPermissionId: '',
      allowedActions: [],
      deniedActions: [],
      source: 'override' as const
    };

    const newAllowedActions = [...current.allowedActions];
    const newDeniedActions = [...current.deniedActions];

    if (allowed) {
      // Add to allowed, remove from denied
      if (!newAllowedActions.includes(action)) {
        newAllowedActions.push(action);
      }
      const deniedIndex = newDeniedActions.indexOf(action);
      if (deniedIndex > -1) {
        newDeniedActions.splice(deniedIndex, 1);
      }
    } else {
      // Remove from allowed, add to denied if it was previously allowed
      const allowedIndex = newAllowedActions.indexOf(action);
      if (allowedIndex > -1) {
        newAllowedActions.splice(allowedIndex, 1);
        if (!newDeniedActions.includes(action)) {
          newDeniedActions.push(action);
        }
      }
    }

    const updated = {
      ...current,
      allowedActions: newAllowedActions,
      deniedActions: newDeniedActions,
      hasOverride: true,
      source: 'override' as const
    };

    setUserPermissions(prev => ({
      ...prev,
      [menuKey]: updated
    }));

    // Track changes
    setChangedPermissions(prev => new Set([...prev, menuKey]));
  };

  const handleBulkPermissionChange = (menuKeys: string[], action: string, allowed: boolean) => {
    menuKeys.forEach(menuKey => {
      handlePermissionToggle(menuKey, action, allowed);
    });
  };

  const handleSavePermissions = async () => {
    if (!user) return;

    try {
      setSaving(true);

      // Prepare overrides data
      const overrides = Array.from(changedPermissions).map(menuKey => {
        const perm = userPermissions[menuKey];
        const menuPerm = menuPermissions.find(mp => mp.menuKey === menuKey);
        
        return {
          menuPermissionId: menuPerm?.id,
          type: 'MODIFY_EXISTING',
          allowedActions: perm.allowedActions,
          deniedActions: perm.deniedActions,
          reason: overrideReason || 'Permission modified via permission editor'
        };
      }).filter(override => override.menuPermissionId);

      const response = await fetch(`/api/user-management/users/${user.id}/permissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          overrides,
          reason: overrideReason || 'Permissions updated via permission editor'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save permissions');
      }

      toast.success('Permissions updated successfully');
      onPermissionsUpdated();
      onClose();

    } catch (error) {
      console.error('Error saving permissions:', error);
      toast.error('Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  const resetChanges = () => {
    setUserPermissions(JSON.parse(JSON.stringify(originalPermissions)));
    setChangedPermissions(new Set());
    setOverrideReason('');
  };

  const filteredPermissions = menuPermissions.filter(perm => {
    const matchesSearch = perm.menuTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         perm.menuKey.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = moduleFilter === 'all' || perm.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  const getUserDisplayName = () => {
    if (!user) return '';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email.split('@')[0];
  };

  const hasPermission = (menuKey: string, action: string) => {
    const perm = userPermissions[menuKey];
    if (!perm) return false;
    return perm.allowedActions.includes(action) && !perm.deniedActions.includes(action);
  };

  const getPermissionStatus = (menuKey: string) => {
    const perm = userPermissions[menuKey];
    if (!perm || perm.allowedActions.length === 0) return 'none';
    if (perm.hasOverride) return 'override';
    return 'inherited';
  };

  const getSecurityBadge = (level: string) => {
    const variants: Record<string, any> = {
      'LOW': { variant: 'outline', className: 'text-green-600 border-green-600' },
      'STANDARD': { variant: 'secondary', className: 'text-blue-600' },
      'HIGH': { variant: 'destructive', className: 'text-orange-600' },
      'CRITICAL': { variant: 'destructive', className: 'text-red-600' }
    };
    
    const config = variants[level] || variants['STANDARD'];
    return (
      <Badge variant={config.variant} className={`text-xs ${config.className}`}>
        {level}
      </Badge>
    );
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Shield className="w-6 h-6" />
            Permission Editor: {getUserDisplayName()}
            <Badge variant="outline">{user.email}</Badge>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mr-3" />
            Loading permissions...
          </div>
        ) : (
          <Tabs defaultValue="permissions" className="w-full">
            <TabsList>
              <TabsTrigger value="permissions">Permission Matrix</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Actions</TabsTrigger>
              <TabsTrigger value="overrides">Override History</TabsTrigger>
            </TabsList>

            <TabsContent value="permissions" className="space-y-6">
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

              {/* Permission Matrix */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Detailed Permissions
                    </span>
                    {changedPermissions.size > 0 && (
                      <Badge variant="outline" className="text-orange-600">
                        {changedPermissions.size} changes pending
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[250px]">Permission</TableHead>
                          <TableHead className="text-center w-20">Read</TableHead>
                          <TableHead className="text-center w-20">Write</TableHead>
                          <TableHead className="text-center w-20">Delete</TableHead>
                          <TableHead className="text-center w-20">Admin</TableHead>
                          <TableHead className="w-[120px]">Status</TableHead>
                          <TableHead className="w-[100px]">Security</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPermissions.map((permission) => {
                          const status = getPermissionStatus(permission.menuKey);
                          const isChanged = changedPermissions.has(permission.menuKey);
                          
                          return (
                            <TableRow 
                              key={permission.id} 
                              className={isChanged ? 'bg-orange-50 border-orange-200' : ''}
                            >
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="font-medium">{permission.menuTitle}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {permission.module} • {permission.menuPath}
                                  </div>
                                  {permission.description && (
                                    <div className="text-xs text-muted-foreground italic">
                                      {permission.description}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              
                              {['read', 'write', 'delete', 'admin'].map((action) => (
                                <TableCell key={action} className="text-center">
                                  <div className="flex justify-center">
                                    <Switch
                                      checked={hasPermission(permission.menuKey, action)}
                                      onCheckedChange={(checked) => 
                                        handlePermissionToggle(permission.menuKey, action, checked)
                                      }
                                    />
                                  </div>
                                </TableCell>
                              ))}
                              
                              <TableCell>
                                {status === 'override' && (
                                  <Badge variant="outline" className="text-orange-600">
                                    Override
                                  </Badge>
                                )}
                                {status === 'inherited' && (
                                  <Badge variant="secondary">
                                    Role
                                  </Badge>
                                )}
                                {status === 'none' && (
                                  <span className="text-muted-foreground text-sm">No Access</span>
                                )}
                              </TableCell>
                              
                              <TableCell>
                                {getSecurityBadge(permission.aiSecurityLevel)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Save Section */}
              {changedPermissions.size > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        <span className="font-medium">You have unsaved changes</span>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="reason">Reason for changes (optional)</Label>
                        <Textarea
                          id="reason"
                          value={overrideReason}
                          onChange={(e) => setOverrideReason(e.target.value)}
                          placeholder="Describe why these permission changes are needed..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="bulk" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bulk Permission Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Grant Permissions</h4>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-green-600"
                          onClick={() => handleBulkPermissionChange(
                            filteredPermissions.map(p => p.menuKey), 
                            'read', 
                            true
                          )}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Grant Read Access to All Visible
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-blue-600"
                          onClick={() => handleBulkPermissionChange(
                            filteredPermissions.map(p => p.menuKey), 
                            'write', 
                            true
                          )}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Grant Write Access to All Visible
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium">Revoke Permissions</h4>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-red-600"
                          onClick={() => handleBulkPermissionChange(
                            filteredPermissions.map(p => p.menuKey), 
                            'delete', 
                            false
                          )}
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Revoke Delete Access from All Visible
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-red-600"
                          onClick={() => handleBulkPermissionChange(
                            filteredPermissions.map(p => p.menuKey), 
                            'admin', 
                            false
                          )}
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Revoke Admin Access from All Visible
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="overrides" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Permission Override History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Permission override history will be displayed here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            {changedPermissions.size > 0 && (
              <Button variant="outline" onClick={resetChanges} disabled={saving}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Changes
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSavePermissions} 
              disabled={saving || changedPermissions.size === 0}
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes ({changedPermissions.size})
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
