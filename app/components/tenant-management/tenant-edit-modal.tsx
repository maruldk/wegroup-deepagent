
'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Activity, 
  Shield, 
  BarChart3,
  Settings,
  Palette,
  Crown,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Tenant {
  id: string;
  name: string;
  displayName?: string;
  shortName?: string;
  domain: string;
  planType: 'DEMO' | 'BASIC' | 'PRO' | 'ENTERPRISE' | 'CUSTOM';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TRIAL' | 'ARCHIVED' | 'PENDING_SETUP';
  description?: string;
  industry?: string;
  website?: string;
  email?: string;
  phone?: string;
  brandColor?: string;
  brandIcon?: string;
  healthScore?: number;
  utilizationRate?: number;
  securityScore?: number;
  createdAt: string;
  lastActivityAt?: string;
  metrics?: any;
  users?: any[];
  activities?: any[];
  analytics?: any[];
  billingRecords?: any[];
  supportTickets?: any[];
}

interface TenantEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant: Tenant;
  onSuccess: () => void;
}

const PLAN_OPTIONS = [
  { value: 'DEMO', label: 'Demo', color: 'bg-gray-100 text-gray-700' },
  { value: 'BASIC', label: 'Basic', color: 'bg-blue-100 text-blue-700' },
  { value: 'PRO', label: 'Pro', color: 'bg-purple-100 text-purple-700' },
  { value: 'ENTERPRISE', label: 'Enterprise', color: 'bg-green-100 text-green-700' },
  { value: 'CUSTOM', label: 'Custom', color: 'bg-orange-100 text-orange-700' }
];

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Aktiv', color: 'bg-green-100 text-green-700' },
  { value: 'TRIAL', label: 'Testversion', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'INACTIVE', label: 'Inaktiv', color: 'bg-gray-100 text-gray-700' },
  { value: 'SUSPENDED', label: 'Gesperrt', color: 'bg-red-100 text-red-700' },
  { value: 'PENDING_SETUP', label: 'Setup ausstehend', color: 'bg-blue-100 text-blue-700' }
];

const INDUSTRY_OPTIONS = [
  'Technologie',
  'Fertigung',
  'Einzelhandel',
  'Gesundheitswesen',
  'Finanzdienstleistungen',
  'Bildung',
  'Beratung',
  'Logistik',
  'Automotive',
  'Energie',
  'Sonstiges'
];

const COLOR_OPTIONS = [
  '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B',
  '#EF4444', '#6B7280', '#EC4899', '#14B8A6'
];

export function TenantEditModal({ open, onOpenChange, tenant, onSuccess }: TenantEditModalProps) {
  const [formData, setFormData] = useState({
    name: tenant.name || '',
    displayName: tenant.displayName || '',
    shortName: tenant.shortName || '',
    description: tenant.description || '',
    industry: tenant.industry || '',
    website: tenant.website || '',
    email: tenant.email || '',
    phone: tenant.phone || '',
    planType: tenant.planType,
    status: tenant.status,
    brandColor: tenant.brandColor || '#3B82F6'
  });
  const [loading, setLoading] = useState(false);
  const [detailedTenant, setDetailedTenant] = useState<Tenant | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (open && tenant.id) {
      fetchTenantDetails();
    }
  }, [open, tenant.id]);

  const fetchTenantDetails = async () => {
    try {
      const response = await fetch(`/api/tenants/${tenant.id}`);
      if (!response.ok) throw new Error('Failed to fetch tenant details');
      
      const data = await response.json();
      setDetailedTenant(data);
    } catch (error) {
      console.error('Error fetching tenant details:', error);
      toast.error('Fehler beim Laden der Mandanten-Details');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/tenants/${tenant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update tenant');
      }

      toast.success('Mandant erfolgreich aktualisiert');
      onSuccess();
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error updating tenant:', error);
      toast.error(error instanceof Error ? error.message : 'Fehler beim Aktualisieren des Mandanten');
    } finally {
      setLoading(false);
    }
  };

  const getHealthScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthScoreIcon = (score?: number) => {
    if (!score) return AlertTriangle;
    if (score >= 80) return CheckCircle;
    if (score >= 60) return TrendingUp;
    return AlertTriangle;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nie';
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const selectedPlan = PLAN_OPTIONS.find(plan => plan.value === formData.planType);
  const selectedStatus = STATUS_OPTIONS.find(status => status.value === formData.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
              style={{ backgroundColor: formData.brandColor }}
            >
              {(formData.shortName || formData.name).substring(0, 2).toUpperCase()}
            </div>
            {formData.displayName || formData.name}
          </DialogTitle>
          <DialogDescription>
            Mandant bearbeiten und Details verwalten
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Übersicht
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Einstellungen
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Benutzer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Health Score */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Health Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getHealthScoreColor(detailedTenant?.metrics?.healthScore)}`}>
                    {Math.round(detailedTenant?.metrics?.healthScore || tenant.healthScore || 0)}%
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {React.createElement(getHealthScoreIcon(detailedTenant?.metrics?.healthScore), {
                      className: `h-4 w-4 ${getHealthScoreColor(detailedTenant?.metrics?.healthScore)}`
                    })}
                    <span className="text-sm text-gray-600">
                      {(detailedTenant?.metrics?.healthScore || 0) >= 80 ? 'Excellent' : 
                       (detailedTenant?.metrics?.healthScore || 0) >= 60 ? 'Good' : 'Needs Attention'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Users */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Benutzer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {detailedTenant?.metrics?.activeUsers || 0}
                  </div>
                  <div className="text-sm text-gray-500">
                    von {detailedTenant?.metrics?.totalUsers || 0} total
                  </div>
                </CardContent>
              </Card>

              {/* Activities */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Aktivitäten
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {detailedTenant?.metrics?.recentActivity || 0}
                  </div>
                  <div className="text-sm text-gray-500">letzte 24h</div>
                </CardContent>
              </Card>
            </div>

            {/* Plan & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    Aktueller Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={selectedPlan?.color}>
                    {selectedPlan?.label}
                  </Badge>
                  <div className="mt-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4" />
                      Erstellt: {formatDate(tenant.createdAt)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Letzte Aktivität: {formatDate(tenant.lastActivityAt)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Status & Sicherheit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={selectedStatus?.color}>
                    {selectedStatus?.label}
                  </Badge>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Security Score:</span>
                      <span className={`font-medium ${getHealthScoreColor(detailedTenant?.metrics?.securityScore)}`}>
                        {Math.round(detailedTenant?.metrics?.securityScore || 80)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Compliance Score:</span>
                      <span className={`font-medium ${getHealthScoreColor(detailedTenant?.metrics?.complianceScore)}`}>
                        {Math.round(detailedTenant?.metrics?.complianceScore || 90)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            {detailedTenant?.activities && detailedTenant.activities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Neueste Aktivitäten
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {detailedTenant.activities.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {activity.description}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatDate(activity.performedAt)} • {activity.user?.email || 'System'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Grundinformationen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayName">Anzeigename</Label>
                    <Input
                      id="displayName"
                      value={formData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shortName">Kurzname</Label>
                    <Input
                      id="shortName"
                      value={formData.shortName}
                      onChange={(e) => handleInputChange('shortName', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Beschreibung</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Kontaktinformationen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Branche</Label>
                    <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Branche auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRY_OPTIONS.map(industry => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    Plan & Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Plan</Label>
                    <Select value={formData.planType} onValueChange={(value) => handleInputChange('planType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PLAN_OPTIONS.map(plan => (
                          <SelectItem key={plan.value} value={plan.value}>
                            {plan.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(status => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Branding
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Brand-Farbe</Label>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-2">
                        {COLOR_OPTIONS.map((color) => (
                          <motion.button
                            key={color}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            className={`w-8 h-8 rounded-full border-2 ${
                              formData.brandColor === color ? 'border-gray-900' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => handleInputChange('brandColor', color)}
                          />
                        ))}
                      </div>
                      <Input
                        type="color"
                        value={formData.brandColor}
                        onChange={(e) => handleInputChange('brandColor', e.target.value)}
                        className="w-16 h-8 p-1 border-0"
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="space-y-2">
                    <Label>Vorschau</Label>
                    <div className="p-3 border rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                          style={{ backgroundColor: formData.brandColor }}
                        >
                          {(formData.shortName || formData.name).substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {formData.displayName || formData.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {tenant.domain}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Analytics Dashboard wird hier angezeigt...
                  <br />
                  <span className="text-sm">Coming Soon - Detaillierte Tenant Analytics</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Benutzerverwaltung
                </CardTitle>
              </CardHeader>
              <CardContent>
                {detailedTenant?.users && detailedTenant.users.length > 0 ? (
                  <div className="space-y-3">
                    {detailedTenant.users.map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.firstName} {user.lastName} {!user.firstName && !user.lastName && user.email}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                        <Badge variant={user.isActive ? 'default' : 'secondary'}>
                          {user.isActive ? 'Aktiv' : 'Inaktiv'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Keine Benutzer gefunden
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Speichere...' : 'Änderungen speichern'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
