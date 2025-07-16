
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Users, 
  Search, 
  Filter, 
  Plus, 
  Settings, 
  Shield, 
  Eye, 
  Edit,
  Trash2,
  Crown,
  UserCheck,
  Layers,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Brain
} from 'lucide-react';
import { RoleCreateModal } from './role-create-modal';
import { RoleEditModal } from './role-edit-modal';
import { AIRoleRecommendationPanel } from './ai-role-recommendation-panel';
import { toast } from 'sonner';

interface EnhancedRole {
  id: string;
  name: string;
  description: string | null;
  hierarchyLevel: number;
  levelColor: string;
  levelBadge: string;
  category: string;
  level: string;
  userCount: number;
  permissionCount: number;
  isSystem: boolean;
  isTemplate: boolean;
  isActive: boolean;
  isVisible: boolean;
  isAutoAssignable: boolean;
  requiresApproval: boolean;
  departmentRestrictions: string[];
  maxUsers: number | null;
  complianceLevel: string;
  aiRecommendationScore: number;
  aiRiskAssessment: number;
  aiSecurityScore: number;
  userEnhancedRoles: Array<{
    user: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
      isActive: boolean;
    };
    isActive: boolean;
    assignedAt: string;
  }>;
  inheritFromRole?: {
    id: string;
    name: string;
    hierarchyLevel: number;
  };
  childRoles: Array<{
    id: string;
    name: string;
    hierarchyLevel: number;
  }>;
}

interface RoleStats {
  totalRoles: number;
  systemRoles: number;
  customRoles: number;
  templateRoles: number;
  totalUsers: number;
  avgHierarchyLevel: number;
  highRiskRoles: number;
}

// Deutsche Rollennamen-Mapping
const GERMAN_ROLE_NAMES: Record<string, string> = {
  'END_CUSTOMER': 'Endkunde',
  'EMPLOYEE': 'Mitarbeiter', 
  'SUPPLIER': 'Lieferant',
  'CUSTOMER': 'Kunde',
  'MANAGEMENT': 'Management',
  'CFO': 'CFO',
  'CEO': 'CEO',
  'SUPER_ADMIN': 'Super Admin'
};

export function EnhancedRoleManagementDashboard() {
  const [roles, setRoles] = useState<EnhancedRole[]>([]);
  const [stats, setStats] = useState<RoleStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState('hierarchyLevel');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Modal states
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [editingRole, setEditingRole] = useState<EnhancedRole | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [selectedRoleForAI, setSelectedRoleForAI] = useState<string | null>(null);

  // Hilfsfunktion für deutsche Rollennamen
  const getGermanRoleName = (englishName: string) => {
    return GERMAN_ROLE_NAMES[englishName] || englishName;
  };

  useEffect(() => {
    fetchRoles();
  }, [sortBy, sortOrder, levelFilter, categoryFilter]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        sortBy,
        sortOrder,
        ...(levelFilter && { level: levelFilter }),
        ...(categoryFilter && { category: categoryFilter })
      });
      
      const response = await fetch(`/api/user-management/enhanced-roles?${params}`);
      if (response.ok) {
        const data = await response.json();
        setRoles(data.roles || []);
        setStats(data.stats);
      } else {
        toast.error('Failed to fetch roles');
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Error loading roles');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleCreated = () => {
    fetchRoles();
    setShowCreateRole(false);
    toast.success('Role created successfully');
  };

  const handleRoleUpdated = () => {
    fetchRoles();
    setEditingRole(null);
    toast.success('Role updated successfully');
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return;
    
    try {
      const response = await fetch(`/api/user-management/enhanced-roles/${roleId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchRoles();
        toast.success('Role deleted successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete role');
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error('Error deleting role');
    }
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getLevelBadgeColor = (level: number, riskScore: number = 0) => {
    if (riskScore > 0.7) return 'bg-red-100 text-red-800 border-red-200';
    if (level >= 90) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (level >= 75) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (level >= 50) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (level >= 25) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRiskIcon = (riskScore: number) => {
    if (riskScore > 0.7) return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (riskScore > 0.4) return <Shield className="w-4 h-4 text-yellow-500" />;
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rollen & Berechtigungen</h1>
          <p className="text-muted-foreground">
            Verwalten Sie hierarchische Rollen mit KI-gestützten Einblicken und Empfehlungen
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setShowAIPanel(true)}
          >
            <Brain className="w-4 h-4" />
            KI-Einblicke
          </Button>
          <Button 
            className="gap-2"
            onClick={() => setShowCreateRole(true)}
          >
            <Plus className="w-4 h-4" />
            Rolle erstellen
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-7">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gesamte Rollen</p>
                <p className="text-2xl font-bold">{stats?.totalRoles || 0}</p>
              </div>
              <Layers className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System</p>
                <p className="text-2xl font-bold text-blue-600">{stats?.systemRoles || 0}</p>
              </div>
              <Crown className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Benutzerdefiniert</p>
                <p className="text-2xl font-bold text-green-600">{stats?.customRoles || 0}</p>
              </div>
              <Settings className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vorlagen</p>
                <p className="text-2xl font-bold text-purple-600">{stats?.templateRoles || 0}</p>
              </div>
              <Layers className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gesamte Benutzer</p>
                <p className="text-2xl font-bold text-indigo-600">{stats?.totalUsers || 0}</p>
              </div>
              <UserCheck className="w-8 h-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ø Level</p>
                <p className="text-2xl font-bold text-teal-600">
                  {stats?.avgHierarchyLevel?.toFixed(0) || 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-teal-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hohes Risiko</p>
                <p className="text-2xl font-bold text-red-600">{stats?.highRiskRoles || 0}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rollen nach Name oder Beschreibung suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Nach Level filtern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Level</SelectItem>
                <SelectItem value="90">Level 90-100</SelectItem>
                <SelectItem value="75">Level 75-89</SelectItem>
                <SelectItem value="50">Level 50-74</SelectItem>
                <SelectItem value="25">Level 25-49</SelectItem>
                <SelectItem value="5">Level 5-24</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Nach Kategorie filtern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Kategorien</SelectItem>
                <SelectItem value="EXECUTIVE">Führung</SelectItem>
                <SelectItem value="MANAGEMENT">Management</SelectItem>
                <SelectItem value="OPERATIONAL">Betrieb</SelectItem>
                <SelectItem value="TECHNICAL">Technik</SelectItem>
                <SelectItem value="ADMINISTRATIVE">Administration</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Roles Table (Mockup-konform) */}
      <Card>
        <CardHeader>
          <CardTitle>Rollen-Übersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => {
                    if (sortBy === 'name') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('name');
                      setSortOrder('asc');
                    }
                  }}
                >
                  Rollenname
                </TableHead>
                <TableHead>Beschreibung</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted text-center"
                  onClick={() => {
                    if (sortBy === 'hierarchyLevel') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('hierarchyLevel');
                      setSortOrder('desc');
                    }
                  }}
                >
                  Level
                </TableHead>
                <TableHead className="text-center">Berechtigungen</TableHead>
                <TableHead className="text-center">Benutzer</TableHead>
                <TableHead className="text-center">Risiko</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-6 bg-muted rounded animate-pulse mx-auto w-16" /></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse mx-auto w-8" /></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse mx-auto w-8" /></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse mx-auto w-8" /></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse mx-auto w-16" /></TableCell>
                    <TableCell><div className="h-8 bg-muted rounded animate-pulse mx-auto w-24" /></TableCell>
                  </TableRow>
                ))
              ) : filteredRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Keine Rollen gefunden, die Ihren Kriterien entsprechen
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoles.map((role) => (
                  <TableRow key={role.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {role.isSystem ? (
                          <Crown className="w-4 h-4 text-blue-600" />
                        ) : role.isTemplate ? (
                          <Layers className="w-4 h-4 text-purple-600" />
                        ) : (
                          <Shield className="w-4 h-4 text-green-600" />
                        )}
                        <div>
                          <div className="font-medium">{getGermanRoleName(role.name)}</div>
                          <div className="text-sm text-muted-foreground">
                            {role.category} • Level {role.hierarchyLevel}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm">
                        {role.description || 'Keine Beschreibung'}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline" 
                        className={`${getLevelBadgeColor(role.hierarchyLevel, role.aiRiskAssessment)} font-mono`}
                      >
                        {role.hierarchyLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{role.permissionCount}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{role.userCount}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        {getRiskIcon(role.aiRiskAssessment || 0)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={role.isActive ? "default" : "secondary"}>
                        {role.isActive ? "Aktiv" : "Inaktiv"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center gap-1 justify-center">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => {
                            setSelectedRoleForAI(role.id);
                            setShowAIPanel(true);
                          }}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => setEditingRole(role)}
                          disabled={role.isSystem}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDeleteRole(role.id)}
                          disabled={role.isSystem || role.userCount > 0}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      <RoleCreateModal
        open={showCreateRole}
        onOpenChange={setShowCreateRole}
        onRoleCreated={handleRoleCreated}
      />

      {editingRole && (
        <RoleEditModal
          open={!!editingRole}
          onOpenChange={() => setEditingRole(null)}
          role={editingRole}
          onRoleUpdated={handleRoleUpdated}
        />
      )}

      <AIRoleRecommendationPanel
        open={showAIPanel}
        onOpenChange={setShowAIPanel}
        selectedRoleId={selectedRoleForAI}
      />
    </div>
  );
}
