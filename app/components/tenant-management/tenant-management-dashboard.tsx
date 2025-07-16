
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Users,
  Activity,
  TrendingUp,
  Shield,
  Settings,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Pause,
  Archive
} from 'lucide-react';
import { toast } from 'sonner';
import { TenantCreateModal } from './tenant-create-modal';
import { TenantEditModal } from './tenant-edit-modal';
import { AITenantInsightsPanel } from './ai-tenant-insights-panel';

interface Tenant {
  id: string;
  name: string;
  displayName?: string;
  shortName?: string;
  domain: string;
  planType: 'DEMO' | 'BASIC' | 'PRO' | 'ENTERPRISE' | 'CUSTOM';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TRIAL' | 'ARCHIVED' | 'PENDING_SETUP';
  userCount: number;
  activityLevel: number;
  healthScore?: number;
  utilizationRate?: number;
  securityScore?: number;
  brandColor?: string;
  brandIcon?: string;
  createdAt: string;
  lastActivityAt?: string;
  metrics?: {
    totalUsers: number;
    activeUsers: number;
    recentActivity: number;
    healthScore: number;
    utilizationRate: number;
  };
}

interface TenantAnalytics {
  totalTenants: number;
  activeTenants: number;
  trialTenants: number;
  inactiveTenants: number;
  planDistribution: Array<{ planType: string; count: number }>;
}

const PLAN_COLORS = {
  DEMO: 'bg-gray-100 text-gray-700',
  BASIC: 'bg-blue-100 text-blue-700',
  PRO: 'bg-purple-100 text-purple-700',
  ENTERPRISE: 'bg-green-100 text-green-700',
  CUSTOM: 'bg-orange-100 text-orange-700'
};

const PLAN_LABELS = {
  DEMO: 'Demo',
  BASIC: 'Basic',
  PRO: 'Pro', 
  ENTERPRISE: 'Enterprise',
  CUSTOM: 'Custom'
};

const STATUS_COLORS = {
  ACTIVE: 'bg-green-100 text-green-700',
  INACTIVE: 'bg-gray-100 text-gray-700',
  SUSPENDED: 'bg-red-100 text-red-700',
  TRIAL: 'bg-yellow-100 text-yellow-700',
  ARCHIVED: 'bg-orange-100 text-orange-700',
  PENDING_SETUP: 'bg-blue-100 text-blue-700'
};

const STATUS_LABELS = {
  ACTIVE: 'Aktiv',
  INACTIVE: 'Inaktiv',
  SUSPENDED: 'Gesperrt',
  TRIAL: 'Testversion',
  ARCHIVED: 'Archiviert',
  PENDING_SETUP: 'Setup ausstehend'
};

const STATUS_ICONS = {
  ACTIVE: CheckCircle,
  INACTIVE: Pause,
  SUSPENDED: AlertTriangle,
  TRIAL: Clock,
  ARCHIVED: Archive,
  PENDING_SETUP: Settings
};

export function TenantManagementDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [analytics, setAnalytics] = useState<TenantAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchTenants();
    fetchAnalytics();
  }, [currentPage, searchTerm, statusFilter, planFilter]);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
        status: statusFilter,
        planType: planFilter
      });

      const response = await fetch(`/api/tenants?${params}`);
      if (!response.ok) throw new Error('Failed to fetch tenants');

      const data = await response.json();
      setTenants(data.tenants || []);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      toast.error('Fehler beim Laden der Mandanten');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/tenants/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');

      const data = await response.json();
      setAnalytics(data.overview);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleDeleteTenant = async (tenant: Tenant) => {
    if (!confirm(`Sind Sie sicher, dass Sie den Mandanten "${tenant.name}" archivieren möchten?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/tenants/${tenant.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete tenant');

      toast.success('Mandant erfolgreich archiviert');
      fetchTenants();
      fetchAnalytics();
    } catch (error) {
      console.error('Error deleting tenant:', error);
      toast.error('Fehler beim Archivieren des Mandanten');
    }
  };

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = !searchTerm || 
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.domain.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || tenant.status === statusFilter;
    const matchesPlan = !planFilter || tenant.planType === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getHealthScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTenantIcon = (tenant: Tenant) => {
    if (tenant.brandIcon) {
      return (
        <img 
          src={tenant.brandIcon} 
          alt={tenant.name}
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }
    return (
      <div 
        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
        style={{ backgroundColor: tenant.brandColor || '#6B7280' }}
      >
        {(tenant.shortName || tenant.name).substring(0, 2).toUpperCase()}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            Mandantenverwaltung
          </h1>
          <p className="text-gray-600 mt-1">
            Verwalten Sie alle Mandanten und deren Konfigurationen
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowAIInsights(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            KI-Einblicke
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Mandant erstellen
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Gesamte Mandanten
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {analytics.totalTenants}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Aktive Mandanten
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {analytics.activeTenants}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Testversionen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {analytics.trialTenants}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Plan-Verteilung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {analytics.planDistribution?.map((plan, index) => (
                    <Badge
                      key={plan.planType}
                      variant="secondary"
                      className="text-xs"
                    >
                      {PLAN_LABELS[plan.planType as keyof typeof PLAN_LABELS]}: {plan.count}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Mandanten suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Nach Status filtern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="ACTIVE">Aktiv</SelectItem>
                <SelectItem value="TRIAL">Testversion</SelectItem>
                <SelectItem value="INACTIVE">Inaktiv</SelectItem>
                <SelectItem value="SUSPENDED">Gesperrt</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Nach Plan filtern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Pläne</SelectItem>
                <SelectItem value="DEMO">Demo</SelectItem>
                <SelectItem value="BASIC">Basic</SelectItem>
                <SelectItem value="PRO">Pro</SelectItem>
                <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tenants Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Mandanten ({filteredTenants.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mandant</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Benutzer</TableHead>
                    <TableHead>Aktivität</TableHead>
                    <TableHead>Health Score</TableHead>
                    <TableHead>Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredTenants.map((tenant) => {
                      const StatusIcon = STATUS_ICONS[tenant.status];
                      return (
                        <motion.tr
                          key={tenant.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="hover:bg-gray-50"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {getTenantIcon(tenant)}
                              <div>
                                <div className="font-medium text-gray-900">
                                  {tenant.displayName || tenant.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {tenant.domain}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary" 
                              className={PLAN_COLORS[tenant.planType]}
                            >
                              {PLAN_LABELS[tenant.planType]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary" 
                              className={`${STATUS_COLORS[tenant.status]} flex items-center gap-1 w-fit`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {STATUS_LABELS[tenant.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">
                                {tenant.metrics?.activeUsers || 0}
                              </span>
                              <span className="text-gray-500">
                                / {tenant.metrics?.totalUsers || tenant.userCount}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">
                                {tenant.metrics?.recentActivity || tenant.activityLevel}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-gray-400" />
                              <span className={`font-medium ${getHealthScoreColor(tenant.metrics?.healthScore || tenant.healthScore)}`}>
                                {Math.round(tenant.metrics?.healthScore || tenant.healthScore || 0)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedTenant(tenant);
                                  setShowEditModal(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedTenant(tenant);
                                  setShowEditModal(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTenant(tenant)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <TenantCreateModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={() => {
          fetchTenants();
          fetchAnalytics();
        }}
      />

      {selectedTenant && (
        <TenantEditModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          tenant={selectedTenant}
          onSuccess={() => {
            fetchTenants();
            fetchAnalytics();
            setSelectedTenant(null);
          }}
        />
      )}

      <AITenantInsightsPanel
        open={showAIInsights}
        onOpenChange={setShowAIInsights}
      />
    </div>
  );
}
