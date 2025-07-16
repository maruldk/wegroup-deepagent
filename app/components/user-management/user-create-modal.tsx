
'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  UserPlus, 
  Mail, 
  Building, 
  Shield, 
  Key, 
  Save,
  X,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string | null;
}

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

export function UserCreateModal({ isOpen, onClose, onUserCreated }: UserCreateModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    position: '',
    roleIds: [] as string[],
    isActive: true,
    tempPassword: '',
    sendWelcomeEmail: true
  });
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      fetchAvailableRoles();
      // Reset form when modal opens
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        position: '',
        roleIds: [],
        isActive: true,
        tempPassword: '',
        sendWelcomeEmail: true
      });
      setErrors({});
    }
  }, [isOpen]);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (formData.roleIds.length === 0) {
      newErrors.roles = 'At least one role must be assigned';
    }

    if (formData.tempPassword && formData.tempPassword.length < 8) {
      newErrors.tempPassword = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, tempPassword: password }));
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setCreating(true);

      const response = await fetch('/api/user-management/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          roleIds: formData.roleIds,
          department: formData.department,
          position: formData.position,
          isActive: formData.isActive,
          tempPassword: formData.tempPassword || undefined,
          sendWelcomeEmail: formData.sendWelcomeEmail
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      const result = await response.json();
      toast.success('User created successfully');
      onUserCreated();
      onClose();

    } catch (error: any) {
      console.error('Error creating user:', error);
      if (error.message.includes('email')) {
        setErrors({ email: 'Email address is already in use' });
      } else {
        toast.error(error.message || 'Failed to create user');
      }
    } finally {
      setCreating(false);
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
    // Clear role error when roles are selected
    if (errors.roles) {
      setErrors(prev => ({ ...prev, roles: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <UserPlus className="w-6 h-6" />
            Create New User
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter first name"
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter last name"
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Employee Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building className="w-5 h-5" />
                Employee Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          {/* Role Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5" />
                Role Assignment *
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
                    <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
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

                  {errors.roles && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {errors.roles}
                    </p>
                  )}

                  {formData.roleIds.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium">Selected Roles:</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.roleIds.map(roleId => {
                          const role = availableRoles.find(r => r.id === roleId);
                          return role ? (
                            <Badge key={roleId} variant="secondary">
                              {role.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Key className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Temporary Password</Label>
                    <p className="text-sm text-muted-foreground">
                      Set a temporary password or leave empty to auto-generate
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={generatePassword}>
                    Generate
                  </Button>
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    value={formData.tempPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, tempPassword: e.target.value }))}
                    placeholder="Enter temporary password (optional)"
                    className={errors.tempPassword ? 'border-red-500' : ''}
                  />
                  {errors.tempPassword && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {errors.tempPassword}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Account Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable account immediately after creation
                    </p>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Send Welcome Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Send account details and welcome email to user
                    </p>
                  </div>
                  <Switch
                    checked={formData.sendWelcomeEmail}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sendWelcomeEmail: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={creating}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={creating}>
            {creating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Create User
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
