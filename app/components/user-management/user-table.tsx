
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  Eye, 
  Edit, 
  Shield, 
  MoreHorizontal, 
  UserCheck, 
  UserX,
  Clock,
  Building
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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

interface UserTableProps {
  users: User[];
  loading: boolean;
  onUserSelect: (user: User) => void;
  onUserEdit: (user: User) => void;
  onManagePermissions: (user: User) => void;
  getStatusBadge: (user: User) => React.ReactNode;
  getUserDisplayName: (user: User) => string;
  getUserInitials: (user: User) => string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function UserTable({ 
  users, 
  loading, 
  onUserSelect, 
  onUserEdit,
  onManagePermissions,
  getStatusBadge,
  getUserDisplayName,
  getUserInitials,
  currentPage,
  totalPages,
  onPageChange
}: UserTableProps) {
  
  const formatLastLogin = (lastLoginAt: string | null) => {
    if (!lastLoginAt) return 'Never';
    
    const date = new Date(lastLoginAt);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const formatCreatedAt = (createdAt: string) => {
    return new Date(createdAt).toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="space-y-3 p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-[200px] mb-2" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
                <Skeleton className="h-6 w-[80px]" />
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]"></TableHead>
                <TableHead>User</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <UserCheck className="w-8 h-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No users found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow 
                    key={user.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onUserSelect(user)}
                  >
                    <TableCell>
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="text-sm font-medium">
                          {getUserInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="font-medium">{getUserDisplayName(user)}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col">
                        {user.employee?.department && (
                          <div className="flex items-center gap-1 text-sm">
                            <Building className="w-3 h-3" />
                            {user.employee.department}
                          </div>
                        )}
                        {user.employee?.position && (
                          <div className="text-xs text-muted-foreground">
                            {user.employee.position}
                          </div>
                        )}
                        {!user.employee?.department && !user.employee?.position && (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.userRoles?.length > 0 ? (
                          user.userRoles.slice(0, 2).map((userRole) => (
                            <Badge key={userRole.role.id} variant="outline" className="text-xs">
                              {userRole.role.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">No roles</span>
                        )}
                        {user.userRoles?.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.userRoles.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {getStatusBadge(user)}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        {formatLastLogin(user.lastLoginAt)}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.permissionOverrides?.length > 0 && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <Shield className="w-3 h-3" />
                            {user.permissionOverrides.length} override{user.permissionOverrides.length !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-8 h-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onUserSelect(user)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUserEdit(user)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onManagePermissions(user)}>
                            <Shield className="w-4 h-4 mr-2" />
                            Manage Permissions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className={user.isActive ? "text-orange-600" : "text-green-600"}>
                            {user.isActive ? (
                              <>
                                <UserX className="w-4 h-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
