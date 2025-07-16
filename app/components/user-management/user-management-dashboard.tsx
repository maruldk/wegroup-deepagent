
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  Settings, 
  Shield, 
  Eye, 
  Edit,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  Clock,
  Ban
} from 'lucide-react';
import { UserTable } from './user-table';
import { UserPermissionMatrix } from './user-permission-matrix';
import { AIRecommendationPanel } from './ai-recommendation-panel';
import { PermissionAuditViewer } from './permission-audit-viewer';
import { UserEditModal } from './user-edit-modal';
import { UserCreateModal } from './user-create-modal';
import { PermissionEditorModal } from './permission-editor-modal';

interface User {
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

interface UserManagementStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersWithOverrides: number;
  pendingRecommendations: number;
}

export function UserManagementDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserManagementStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    usersWithOverrides: 0,
    pendingRecommendations: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showPermissionEditor, setShowPermissionEditor] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch users data
  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter !== 'all' && { role: roleFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      });

      const response = await fetch(`/api/user-management/users?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setTotalPages(data.pagination?.totalPages || 1);
        
        // Calculate stats
        const activeUsers = data.users?.filter((u: User) => u.isActive).length || 0;
        const usersWithOverrides = data.users?.filter((u: User) => u.permissionOverrides?.length > 0).length || 0;
        
        setStats({
          totalUsers: data.pagination?.total || 0,
          activeUsers,
          inactiveUsers: (data.pagination?.total || 0) - activeUsers,
          usersWithOverrides,
          pendingRecommendations: 0 // Will be fetched separately
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (user: User) => {
    if (!user.isActive) {
      return <Badge variant="secondary" className="gap-1"><Ban className="w-3 h-3" />Inactive</Badge>;
    }
    if (user.permissionOverrides?.length > 0) {
      return <Badge variant="outline" className="gap-1"><AlertTriangle className="w-3 h-3" />Custom</Badge>;
    }
    if (user.lastLoginAt) {
      const lastLogin = new Date(user.lastLoginAt);
      const daysSince = Math.floor((Date.now() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSince > 30) {
        return <Badge variant="outline" className="gap-1"><Clock className="w-3 h-3" />Stale</Badge>;
      }
    }
    return <Badge variant="default" className="gap-1"><CheckCircle className="w-3 h-3" />Active</Badge>;
  };

  const getUserDisplayName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email.split('@')[0];
  };

  const getUserInitials = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user.email.substring(0, 2).toUpperCase();
  };

  // Modal handlers
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowEditUser(true);
  };

  const handleManagePermissions = (user: User) => {
    setEditingUser(user);
    setShowPermissionEditor(true);
  };

  const handleUserUpdated = () => {
    fetchUsers();
  };

  const handleCloseModals = () => {
    setShowEditUser(false);
    setShowPermissionEditor(false);
    setEditingUser(null);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, roles, and permissions with AI-powered insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Shield className="w-4 h-4" />
            AI Insights
          </Button>
          <Button className="gap-2" onClick={() => setShowCreateUser(true)}>
            <UserPlus className="w-4 h-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold text-orange-600">{stats.inactiveUsers}</p>
              </div>
              <Ban className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Custom Permissions</p>
                <p className="text-2xl font-bold text-blue-600">{stats.usersWithOverrides}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Recommendations</p>
                <p className="text-2xl font-bold text-purple-600">{stats.pendingRecommendations}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="permissions">Permission Matrix</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserTable
            users={users}
            loading={loading}
            onUserSelect={setSelectedUser}
            onUserEdit={handleEditUser}
            onManagePermissions={handleManagePermissions}
            getStatusBadge={getStatusBadge}
            getUserDisplayName={getUserDisplayName}
            getUserInitials={getUserInitials}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </TabsContent>

        <TabsContent value="permissions">
          <UserPermissionMatrix users={users} />
        </TabsContent>

        <TabsContent value="ai-insights">
          <AIRecommendationPanel />
        </TabsContent>

        <TabsContent value="audit">
          <PermissionAuditViewer />
        </TabsContent>
      </Tabs>

      {/* All Modals */}
      <UserCreateModal
        isOpen={showCreateUser}
        onClose={() => setShowCreateUser(false)}
        onUserCreated={handleUserUpdated}
      />

      <UserEditModal
        user={editingUser}
        isOpen={showEditUser}
        onClose={handleCloseModals}
        onUserUpdated={handleUserUpdated}
      />

      <PermissionEditorModal
        user={editingUser}
        isOpen={showPermissionEditor}
        onClose={handleCloseModals}
        onPermissionsUpdated={handleUserUpdated}
      />

      {/* User Quick View Dialog */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>{getUserInitials(selectedUser)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{getUserDisplayName(selectedUser)}</div>
                  <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
                </div>
                {getStatusBadge(selectedUser)}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Department</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.employee?.department || 'Not specified'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Position</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.employee?.position || 'Not specified'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Login</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.lastLoginAt 
                      ? new Date(selectedUser.lastLoginAt).toLocaleDateString()
                      : 'Never'
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Member Since</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Roles</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedUser.userRoles?.length > 0 ? (
                    selectedUser.userRoles.map((userRole) => (
                      <Badge key={userRole.role.id} variant="secondary">
                        {userRole.role.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No roles assigned</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <Button 
                  onClick={() => {
                    handleEditUser(selectedUser);
                    setSelectedUser(null);
                  }}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit User
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    handleManagePermissions(selectedUser);
                    setSelectedUser(null);
                  }}
                  className="flex-1"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Manage Permissions
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
