
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  FileText, 
  Search, 
  Filter, 
  RefreshCw,
  Eye,
  Download,
  Calendar,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  permissionDetails: any;
  oldValues: any;
  newValues: any;
  reason: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  aiDetectedAnomaly: boolean;
  aiRiskScore: number;
  aiComplianceScore: number;
  tenantId: string;
  performedBy: string;
  performedAt: string;
}

interface AuditStats {
  GRANTED: number;
  REVOKED: number;
  MODIFIED: number;
  REVIEWED: number;
  INHERITED: number;
  OVERRIDDEN: number;
}

export function PermissionAuditViewer() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats>({
    GRANTED: 0,
    REVOKED: 0,
    MODIFIED: 0,
    REVIEWED: 0,
    INHERITED: 0,
    OVERRIDDEN: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('7days');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAuditLogs();
  }, [currentPage, entityTypeFilter, actionFilter, dateFilter]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(entityTypeFilter !== 'all' && { entityType: entityTypeFilter }),
        ...(actionFilter !== 'all' && { action: actionFilter })
      });

      // Add date filter
      if (dateFilter !== 'all') {
        const now = new Date();
        const days = parseInt(dateFilter.replace('days', ''));
        const dateFrom = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        params.append('dateFrom', dateFrom.toISOString());
      }

      const response = await fetch(`/api/permission-engine/audit?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAuditLogs(data.auditLogs || []);
        setStats(data.stats || {});
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    const icons: Record<string, React.ReactNode> = {
      'GRANTED': <CheckCircle className="w-4 h-4 text-green-500" />,
      'REVOKED': <XCircle className="w-4 h-4 text-red-500" />,
      'MODIFIED': <Shield className="w-4 h-4 text-blue-500" />,
      'REVIEWED': <Eye className="w-4 h-4 text-purple-500" />,
      'INHERITED': <User className="w-4 h-4 text-gray-500" />,
      'OVERRIDDEN': <AlertTriangle className="w-4 h-4 text-orange-500" />
    };
    return icons[action] || <FileText className="w-4 h-4 text-gray-500" />;
  };

  const getActionBadge = (action: string) => {
    const variants: Record<string, { variant: any; color: string }> = {
      'GRANTED': { variant: 'default', color: 'text-green-600' },
      'REVOKED': { variant: 'destructive', color: 'text-red-600' },
      'MODIFIED': { variant: 'secondary', color: 'text-blue-600' },
      'REVIEWED': { variant: 'outline', color: 'text-purple-600' },
      'INHERITED': { variant: 'outline', color: 'text-gray-600' },
      'OVERRIDDEN': { variant: 'outline', color: 'text-orange-600' }
    };
    
    const config = variants[action] || variants['MODIFIED'];
    return (
      <Badge variant={config.variant} className={config.color}>
        {action}
      </Badge>
    );
  };

  const getEntityTypeBadge = (entityType: string) => {
    const variants: Record<string, { variant: any; color: string }> = {
      'USER': { variant: 'outline', color: 'text-blue-600' },
      'ROLE': { variant: 'outline', color: 'text-green-600' },
      'MENU_PERMISSION': { variant: 'outline', color: 'text-purple-600' },
      'SYSTEM': { variant: 'outline', color: 'text-gray-600' }
    };
    
    const config = variants[entityType] || variants['SYSTEM'];
    return (
      <Badge variant={config.variant} className={config.color}>
        {entityType}
      </Badge>
    );
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString();
  };

  const getRiskBadge = (riskScore: number) => {
    if (riskScore >= 0.8) {
      return <Badge variant="destructive" className="text-xs">High Risk</Badge>;
    }
    if (riskScore >= 0.5) {
      return <Badge variant="outline" className="text-xs text-orange-600">Medium Risk</Badge>;
    }
    if (riskScore > 0) {
      return <Badge variant="outline" className="text-xs text-green-600">Low Risk</Badge>;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Permission Audit Trail
          </h2>
          <p className="text-muted-foreground">
            Complete history of permission changes and system activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchAuditLogs}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {Object.entries(stats).map(([action, count]) => (
          <Card key={action}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{action}</p>
                  <p className="text-xl font-bold">{count}</p>
                </div>
                {getActionIcon(action)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search audit logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Entity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ROLE">Role</SelectItem>
                  <SelectItem value="MENU_PERMISSION">Menu Permission</SelectItem>
                  <SelectItem value="SYSTEM">System</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="GRANTED">Granted</SelectItem>
                  <SelectItem value="REVOKED">Revoked</SelectItem>
                  <SelectItem value="MODIFIED">Modified</SelectItem>
                  <SelectItem value="REVIEWED">Reviewed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1days">Last 24 hours</SelectItem>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Audit Log Entries
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity Type</TableHead>
                  <TableHead>Entity ID</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Performed By</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(10)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="w-32 h-4" /></TableCell>
                      <TableCell><Skeleton className="w-20 h-4" /></TableCell>
                      <TableCell><Skeleton className="w-24 h-4" /></TableCell>
                      <TableCell><Skeleton className="w-20 h-4" /></TableCell>
                      <TableCell><Skeleton className="w-40 h-4" /></TableCell>
                      <TableCell><Skeleton className="w-16 h-4" /></TableCell>
                      <TableCell><Skeleton className="w-24 h-4" /></TableCell>
                      <TableCell><Skeleton className="w-8 h-4" /></TableCell>
                    </TableRow>
                  ))
                ) : auditLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">No audit logs found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  auditLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          {formatDateTime(log.performedAt)}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          {getActionBadge(log.action)}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {getEntityTypeBadge(log.entityType)}
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm font-mono text-muted-foreground">
                          {log.entityId.length > 8 ? `${log.entityId.substring(0, 8)}...` : log.entityId}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="max-w-xs">
                          {log.reason && (
                            <div className="text-sm">{log.reason}</div>
                          )}
                          {log.aiDetectedAnomaly && (
                            <div className="flex items-center gap-1 text-xs text-orange-600 mt-1">
                              <AlertTriangle className="w-3 h-3" />
                              AI Anomaly Detected
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {getRiskBadge(log.aiRiskScore)}
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {log.performedBy}
                        </div>
                        {log.ipAddress && (
                          <div className="text-xs text-muted-foreground font-mono">
                            {log.ipAddress}
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <Eye className="w-4 h-4" />
                        </Button>
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
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
