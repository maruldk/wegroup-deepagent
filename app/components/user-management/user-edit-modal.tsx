
'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Building, 
  Shield, 
  Key, 
  AlertTriangle,
  Save,
  X,
  RefreshCw,
  Edit,
  UserCheck,
  UserX,
  Calendar,
  Activity
} from 'lucide-react';

interface UserEditData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  userRoles: Array<{
    role: {
      id: string;
      name: string;
      description: string | null;
    };
  }>;
  permissionOverrides: Array<{
    id: string;
    overrideType: string;
    reason: string | null;
    expiresAt: string | null;
  }>;
  employee: {
    department: string | null;
    position: string | null;
  } | null;
}

interface Role {
  id: string;
  name: string;
  description: string | null;
}

interface UserEditModalProps {
  user: UserEditData | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
}

export function UserEditModal({ user, isOpen, onClose, onUserUpdated }: UserEditModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    isActive: true,
    roleIds: [] as string[],
    department: '',
    position: '',
    resetPassword: false,
    newPassword: ''
  });
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
        isActive: user.isActive,
        roleIds: user.userRoles.map(ur => ur.role.id),
        department: user.employee?.department || '',
        position: user.employee?.position || '',
        resetPassword: false,
        newPassword: ''
      });
      fetchAvailableRoles();
    }
  }, [user]);

  const fetchAvailableRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user-management/roles');
      if (response.ok) {
        const data = await response.json();
        setAvailableRoles(data.roles || []);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to load available roles');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);

      // Update user basic information
      const userUpdateResponse = await fetch(`/api/user-management/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          isActive: formData.isActive,
          department: formData.department,
          position: formData.position,
          ...(formData.resetPassword && formData.newPassword && {
            password: formData.newPassword
          })
        })
      });

      if (!userUpdateResponse.ok) {
        throw new Error('Failed to update user');
      }

      // Update roles if changed
      const currentRoleIds = user.userRoles.map(ur => ur.role.id);
      const roleIdsChanged = JSON.stringify(currentRoleIds.sort()) !== JSON.stringify(formData.roleIds.sort());

      if (roleIdsChanged) {
        const roleUpdateResponse = await fetch(`/api/user-management/users/${user.id}/permissions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roleUpdates: formData.roleIds,
            reason: 'User role assignment updated via user edit'
          })
        });

        if (!roleUpdateResponse.ok) {
          throw new Error('Failed to update user roles');
        }
      }

      toast.success('User updated successfully');
      onUserUpdated();
      onClose();

    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleRoleToggle = (roleId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        roleIds: [...prev.roleIds, roleId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        roleIds: prev.roleIds.filter(id => id !== roleId)
      }));
    }
  };

  const getUserDisplayName = () => {
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName} ${formData.lastName}`;
    }
    return formData.email.split('@')[0];
  };

  const getUserInitials = () => {
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase();
    }
    return formData.email.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">Edit User: {getUserDisplayName()}</div>
              <div className="text-sm text-muted-foreground">{formData.email}</div>
            </div>
            <Badge variant={formData.isActive ? "default" : "secondary"}>
              {formData.isActive ? "Active" : "Inactive"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="info">Information</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Employee Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                        placeholder="Enter department"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                        placeholder="Enter position"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Account Status
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {formData.isActive ? "User can log in and access the platform" : "User account is disabled"}
                    </p>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Role Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                    Loading roles...
                  </div>
                ) : (
                  <div className="space-y-4">
                    {availableRoles.map((role) => (
                      <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="font-medium">{role.name}</div>
                          {role.description && (
                            <div className="text-sm text-muted-foreground">{role.description}</div>
                          )}
                        </div>
                        <Switch
                          checked={formData.roleIds.includes(role.id)}
                          onCheckedChange={(checked) => handleRoleToggle(role.id, checked)}
                        />
                      </div>
                    ))}
                    
                    {availableRoles.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No roles available
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Label>Reset Password</Label>
                    <p className="text-sm text-muted-foreground">
                      Generate a new temporary password for this user
                    </p>
                  </div>
                  <Switch
                    checked={formData.resetPassword}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, resetPassword: checked }))}
                  />
                </div>

                {formData.resetPassword && (
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Enter new password"
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave empty to auto-generate a secure password
                    </p>
                  </div>
                )}

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Permission Overrides</h4>
                  {user.permissionOverrides.length > 0 ? (
                    <div className="space-y-2">
                      {user.permissionOverrides.map((override) => (
                        <div key={override.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{override.overrideType}</div>
                            {override.reason && (
                              <div className="text-sm text-muted-foreground">{override.reason}</div>
                            )}
                          </div>
                          <Badge variant="outline">
                            {override.expiresAt ? `Expires ${formatDate(override.expiresAt)}` : 'Permanent'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No permission overrides</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium">Account Created</Label>
                    <p className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Last Login</Label>
                    <p className="text-sm text-muted-foreground">
                      {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">User ID</Label>
                    <p className="text-sm text-muted-foreground font-mono">{user.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Active Roles</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.roleIds.map(roleId => {
                        const role = availableRoles.find(r => r.id === roleId);
                        return role ? (
                          <Badge key={roleId} variant="secondary" className="text-xs">
                            {role.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
