
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  Mail, 
  Shield, 
  Zap, 
  Bell, 
  Archive, 
  Users,
  Server,
  Database,
  Lock,
  Activity,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Save,
  RotateCcw,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

interface TenantEmailSettings {
  id: string;
  tenantId: string;
  
  // Global Email Settings
  globalEmailEnabled: boolean;
  defaultEmailDomain: string;
  defaultEmailPrefix: string;
  globalSpamFilterEnabled: boolean;
  globalArchiveEnabled: boolean;
  globalArchiveAfterDays: number;
  
  // AI & Machine Learning Settings
  aiProcessingEnabled: boolean;
  aiConfidenceThreshold: number;
  aiAutoApprovalThreshold: number;
  aiModelPreference: string;
  aiLearningEnabled: boolean;
  
  // Security Settings
  encryptionEnabled: boolean;
  accessControlEnabled: boolean;
  auditLoggingEnabled: boolean;
  ipWhitelistEnabled: boolean;
  allowedIpRanges: string[];
  
  // Notification Settings
  globalNotificationsEnabled: boolean;
  escalationEmailAddresses: string[];
  alertThresholds: {
    highVolumeThreshold: number;
    lowConfidenceThreshold: number;
    failureRateThreshold: number;
  };
  
  // Performance Settings
  maxConcurrentProcessing: number;
  maxAttachmentSize: number;
  processingTimeout: number;
  retryAttempts: number;
  batchProcessingEnabled: boolean;
  
  // Advanced Settings
  customRulesEnabled: boolean;
  customRules: string[];
  webhookEnabled: boolean;
  webhookEndpoint?: string;
  apiAccessEnabled: boolean;
  apiKeys: string[];
}

export function TenantEmailSettingsInterface() {
  const [settings, setSettings] = useState<Partial<TenantEmailSettings>>({
    globalEmailEnabled: true,
    defaultEmailDomain: 'wegroup.com',
    defaultEmailPrefix: 'invoice',
    globalSpamFilterEnabled: true,
    globalArchiveEnabled: true,
    globalArchiveAfterDays: 365,
    aiProcessingEnabled: true,
    aiConfidenceThreshold: 0.7,
    aiAutoApprovalThreshold: 0.9,
    aiModelPreference: 'gpt-4.1-mini',
    aiLearningEnabled: true,
    encryptionEnabled: true,
    accessControlEnabled: true,
    auditLoggingEnabled: true,
    ipWhitelistEnabled: false,
    allowedIpRanges: [],
    globalNotificationsEnabled: true,
    escalationEmailAddresses: [],
    alertThresholds: {
      highVolumeThreshold: 100,
      lowConfidenceThreshold: 0.5,
      failureRateThreshold: 0.1
    },
    maxConcurrentProcessing: 10,
    maxAttachmentSize: 25,
    processingTimeout: 300,
    retryAttempts: 3,
    batchProcessingEnabled: true,
    customRulesEnabled: false,
    customRules: [],
    webhookEnabled: false,
    apiAccessEnabled: false,
    apiKeys: []
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [newRule, setNewRule] = useState('');
  const [newEscalationEmail, setNewEscalationEmail] = useState('');
  const [newIpRange, setNewIpRange] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // Mock API call - in real implementation, this would fetch from backend
      // const response = await fetch('/api/finance/tenant-email-settings?tenantId=default');
      // const data = await response.json();
      // setSettings(data.settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Fehler beim Laden der Einstellungen');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      // Mock API call - in real implementation, this would save to backend
      // const response = await fetch('/api/finance/tenant-email-settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     tenantId: 'default',
      //     settings
      //   })
      // });
      
      // Mock success
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Einstellungen gespeichert');
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Fehler beim Speichern der Einstellungen');
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = () => {
    setSettings({
      globalEmailEnabled: true,
      defaultEmailDomain: 'wegroup.com',
      defaultEmailPrefix: 'invoice',
      globalSpamFilterEnabled: true,
      globalArchiveEnabled: true,
      globalArchiveAfterDays: 365,
      aiProcessingEnabled: true,
      aiConfidenceThreshold: 0.7,
      aiAutoApprovalThreshold: 0.9,
      aiModelPreference: 'gpt-4.1-mini',
      aiLearningEnabled: true,
      encryptionEnabled: true,
      accessControlEnabled: true,
      auditLoggingEnabled: true,
      ipWhitelistEnabled: false,
      allowedIpRanges: [],
      globalNotificationsEnabled: true,
      escalationEmailAddresses: [],
      alertThresholds: {
        highVolumeThreshold: 100,
        lowConfidenceThreshold: 0.5,
        failureRateThreshold: 0.1
      },
      maxConcurrentProcessing: 10,
      maxAttachmentSize: 25,
      processingTimeout: 300,
      retryAttempts: 3,
      batchProcessingEnabled: true,
      customRulesEnabled: false,
      customRules: [],
      webhookEnabled: false,
      apiAccessEnabled: false,
      apiKeys: []
    });
    setHasChanges(true);
    toast.success('Einstellungen zurückgesetzt');
  };

  const updateSettings = (key: keyof TenantEmailSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const addEscalationEmail = () => {
    if (newEscalationEmail && !settings.escalationEmailAddresses?.includes(newEscalationEmail)) {
      updateSettings('escalationEmailAddresses', [...(settings.escalationEmailAddresses || []), newEscalationEmail]);
      setNewEscalationEmail('');
    }
  };

  const removeEscalationEmail = (email: string) => {
    updateSettings('escalationEmailAddresses', settings.escalationEmailAddresses?.filter(e => e !== email) || []);
  };

  const addCustomRule = () => {
    if (newRule && !settings.customRules?.includes(newRule)) {
      updateSettings('customRules', [...(settings.customRules || []), newRule]);
      setNewRule('');
    }
  };

  const removeCustomRule = (rule: string) => {
    updateSettings('customRules', settings.customRules?.filter(r => r !== rule) || []);
  };

  const addIpRange = () => {
    if (newIpRange && !settings.allowedIpRanges?.includes(newIpRange)) {
      updateSettings('allowedIpRanges', [...(settings.allowedIpRanges || []), newIpRange]);
      setNewIpRange('');
    }
  };

  const removeIpRange = (ip: string) => {
    updateSettings('allowedIpRanges', settings.allowedIpRanges?.filter(i => i !== ip) || []);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Mandanten-E-Mail-Einstellungen
          </h1>
          <p className="text-gray-600 mt-1">
            Erweiterte Konfiguration für Multi-Mandant E-Mail-Integration
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            onClick={handleResetSettings}
            disabled={saving}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Zurücksetzen
          </Button>
          <Button 
            onClick={handleSaveSettings}
            disabled={saving || !hasChanges}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Speichern
          </Button>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-green-800">E-Mail-System</div>
                <div className="text-xs text-green-600">
                  {settings.globalEmailEnabled ? 'Aktiv' : 'Inaktiv'}
                </div>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-blue-800">KI-Verarbeitung</div>
                <div className="text-xs text-blue-600">
                  {settings.aiProcessingEnabled ? 'Aktiv' : 'Inaktiv'}
                </div>
              </div>
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-purple-800">Sicherheit</div>
                <div className="text-xs text-purple-600">
                  {settings.encryptionEnabled ? 'Verschlüsselt' : 'Standard'}
                </div>
              </div>
              <Lock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-orange-800">Benachrichtigungen</div>
                <div className="text-xs text-orange-600">
                  {settings.globalNotificationsEnabled ? 'Aktiv' : 'Inaktiv'}
                </div>
              </div>
              <Bell className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="general">Allgemein</TabsTrigger>
              <TabsTrigger value="ai">KI & ML</TabsTrigger>
              <TabsTrigger value="security">Sicherheit</TabsTrigger>
              <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
              <TabsTrigger value="performance">Leistung</TabsTrigger>
              <TabsTrigger value="advanced">Erweitert</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-lg font-semibold">
                  <Mail className="w-5 h-5" />
                  <span>Allgemeine E-Mail-Einstellungen</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="defaultEmailDomain">Standard-Domain</Label>
                    <Input
                      id="defaultEmailDomain"
                      value={settings.defaultEmailDomain || ''}
                      onChange={(e) => updateSettings('defaultEmailDomain', e.target.value)}
                      placeholder="wegroup.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="defaultEmailPrefix">Standard-Präfix</Label>
                    <Input
                      id="defaultEmailPrefix"
                      value={settings.defaultEmailPrefix || ''}
                      onChange={(e) => updateSettings('defaultEmailPrefix', e.target.value)}
                      placeholder="invoice"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="globalEmailEnabled"
                      checked={settings.globalEmailEnabled}
                      onCheckedChange={(checked) => updateSettings('globalEmailEnabled', checked)}
                    />
                    <Label htmlFor="globalEmailEnabled">Globale E-Mail-Verarbeitung aktivieren</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="globalSpamFilterEnabled"
                      checked={settings.globalSpamFilterEnabled}
                      onCheckedChange={(checked) => updateSettings('globalSpamFilterEnabled', checked)}
                    />
                    <Label htmlFor="globalSpamFilterEnabled">Globaler Spam-Filter aktivieren</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="globalArchiveEnabled"
                      checked={settings.globalArchiveEnabled}
                      onCheckedChange={(checked) => updateSettings('globalArchiveEnabled', checked)}
                    />
                    <Label htmlFor="globalArchiveEnabled">Automatische Archivierung aktivieren</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="globalArchiveAfterDays">Archivierung nach (Tage)</Label>
                  <Input
                    id="globalArchiveAfterDays"
                    type="number"
                    value={settings.globalArchiveAfterDays || 365}
                    onChange={(e) => updateSettings('globalArchiveAfterDays', parseInt(e.target.value))}
                    min="1"
                    max="3650"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-lg font-semibold">
                  <Zap className="w-5 h-5" />
                  <span>KI & Machine Learning</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="aiProcessingEnabled"
                    checked={settings.aiProcessingEnabled}
                    onCheckedChange={(checked) => updateSettings('aiProcessingEnabled', checked)}
                  />
                  <Label htmlFor="aiProcessingEnabled">KI-Verarbeitung aktivieren</Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="aiConfidenceThreshold">Konfidenz-Schwellenwert</Label>
                    <Input
                      id="aiConfidenceThreshold"
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.aiConfidenceThreshold || 0.7}
                      onChange={(e) => updateSettings('aiConfidenceThreshold', parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="aiAutoApprovalThreshold">Auto-Genehmigung-Schwellenwert</Label>
                    <Input
                      id="aiAutoApprovalThreshold"
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.aiAutoApprovalThreshold || 0.9}
                      onChange={(e) => updateSettings('aiAutoApprovalThreshold', parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="aiModelPreference">Bevorzugtes KI-Modell</Label>
                  <Select 
                    value={settings.aiModelPreference || 'gpt-4.1-mini'} 
                    onValueChange={(value) => updateSettings('aiModelPreference', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4.1-mini">GPT-4.1 Mini</SelectItem>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="claude-3">Claude 3</SelectItem>
                      <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="aiLearningEnabled"
                    checked={settings.aiLearningEnabled}
                    onCheckedChange={(checked) => updateSettings('aiLearningEnabled', checked)}
                  />
                  <Label htmlFor="aiLearningEnabled">KI-Lernen aktivieren</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-lg font-semibold">
                  <Shield className="w-5 h-5" />
                  <span>Sicherheitseinstellungen</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="encryptionEnabled"
                      checked={settings.encryptionEnabled}
                      onCheckedChange={(checked) => updateSettings('encryptionEnabled', checked)}
                    />
                    <Label htmlFor="encryptionEnabled">End-to-End-Verschlüsselung aktivieren</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="accessControlEnabled"
                      checked={settings.accessControlEnabled}
                      onCheckedChange={(checked) => updateSettings('accessControlEnabled', checked)}
                    />
                    <Label htmlFor="accessControlEnabled">Zugriffskontrolle aktivieren</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auditLoggingEnabled"
                      checked={settings.auditLoggingEnabled}
                      onCheckedChange={(checked) => updateSettings('auditLoggingEnabled', checked)}
                    />
                    <Label htmlFor="auditLoggingEnabled">Audit-Protokollierung aktivieren</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ipWhitelistEnabled"
                      checked={settings.ipWhitelistEnabled}
                      onCheckedChange={(checked) => updateSettings('ipWhitelistEnabled', checked)}
                    />
                    <Label htmlFor="ipWhitelistEnabled">IP-Whitelist aktivieren</Label>
                  </div>
                </div>

                {settings.ipWhitelistEnabled && (
                  <div className="space-y-4">
                    <Label>Erlaubte IP-Bereiche</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="192.168.1.0/24"
                        value={newIpRange}
                        onChange={(e) => setNewIpRange(e.target.value)}
                      />
                      <Button onClick={addIpRange} variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Hinzufügen
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {settings.allowedIpRanges?.map((ip, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{ip}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeIpRange(ip)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-lg font-semibold">
                  <Bell className="w-5 h-5" />
                  <span>Benachrichtigungseinstellungen</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="globalNotificationsEnabled"
                    checked={settings.globalNotificationsEnabled}
                    onCheckedChange={(checked) => updateSettings('globalNotificationsEnabled', checked)}
                  />
                  <Label htmlFor="globalNotificationsEnabled">Globale Benachrichtigungen aktivieren</Label>
                </div>

                <div className="space-y-4">
                  <Label>Eskalations-E-Mail-Adressen</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="email"
                      placeholder="admin@wegroup.com"
                      value={newEscalationEmail}
                      onChange={(e) => setNewEscalationEmail(e.target.value)}
                    />
                    <Button onClick={addEscalationEmail} variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Hinzufügen
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {settings.escalationEmailAddresses?.map((email, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{email}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeEscalationEmail(email)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Alarm-Schwellenwerte</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="highVolumeThreshold">Hohe Volumen-Schwelle</Label>
                      <Input
                        id="highVolumeThreshold"
                        type="number"
                        value={settings.alertThresholds?.highVolumeThreshold || 100}
                        onChange={(e) => updateSettings('alertThresholds', {
                          ...settings.alertThresholds,
                          highVolumeThreshold: parseInt(e.target.value)
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lowConfidenceThreshold">Niedrige Konfidenz-Schwelle</Label>
                      <Input
                        id="lowConfidenceThreshold"
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.alertThresholds?.lowConfidenceThreshold || 0.5}
                        onChange={(e) => updateSettings('alertThresholds', {
                          ...settings.alertThresholds,
                          lowConfidenceThreshold: parseFloat(e.target.value)
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="failureRateThreshold">Fehlerrate-Schwelle</Label>
                      <Input
                        id="failureRateThreshold"
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.alertThresholds?.failureRateThreshold || 0.1}
                        onChange={(e) => updateSettings('alertThresholds', {
                          ...settings.alertThresholds,
                          failureRateThreshold: parseFloat(e.target.value)
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-lg font-semibold">
                  <Activity className="w-5 h-5" />
                  <span>Leistungseinstellungen</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxConcurrentProcessing">Max. gleichzeitige Verarbeitung</Label>
                    <Input
                      id="maxConcurrentProcessing"
                      type="number"
                      min="1"
                      max="100"
                      value={settings.maxConcurrentProcessing || 10}
                      onChange={(e) => updateSettings('maxConcurrentProcessing', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxAttachmentSize">Max. Anhang-Größe (MB)</Label>
                    <Input
                      id="maxAttachmentSize"
                      type="number"
                      min="1"
                      max="100"
                      value={settings.maxAttachmentSize || 25}
                      onChange={(e) => updateSettings('maxAttachmentSize', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="processingTimeout">Verarbeitungs-Timeout (Sekunden)</Label>
                    <Input
                      id="processingTimeout"
                      type="number"
                      min="30"
                      max="3600"
                      value={settings.processingTimeout || 300}
                      onChange={(e) => updateSettings('processingTimeout', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="retryAttempts">Wiederholungsversuche</Label>
                    <Input
                      id="retryAttempts"
                      type="number"
                      min="0"
                      max="10"
                      value={settings.retryAttempts || 3}
                      onChange={(e) => updateSettings('retryAttempts', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="batchProcessingEnabled"
                    checked={settings.batchProcessingEnabled}
                    onCheckedChange={(checked) => updateSettings('batchProcessingEnabled', checked)}
                  />
                  <Label htmlFor="batchProcessingEnabled">Batch-Verarbeitung aktivieren</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-lg font-semibold">
                  <Settings className="w-5 h-5" />
                  <span>Erweiterte Einstellungen</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="customRulesEnabled"
                      checked={settings.customRulesEnabled}
                      onCheckedChange={(checked) => updateSettings('customRulesEnabled', checked)}
                    />
                    <Label htmlFor="customRulesEnabled">Benutzerdefinierte Regeln aktivieren</Label>
                  </div>

                  {settings.customRulesEnabled && (
                    <div className="space-y-4">
                      <Label>Benutzerdefinierte Regeln</Label>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Regel eingeben..."
                          value={newRule}
                          onChange={(e) => setNewRule(e.target.value)}
                        />
                        <Button onClick={addCustomRule} variant="outline">
                          <Plus className="w-4 h-4 mr-2" />
                          Hinzufügen
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {settings.customRules?.map((rule, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{rule}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeCustomRule(rule)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="webhookEnabled"
                      checked={settings.webhookEnabled}
                      onCheckedChange={(checked) => updateSettings('webhookEnabled', checked)}
                    />
                    <Label htmlFor="webhookEnabled">Webhook-Integration aktivieren</Label>
                  </div>

                  {settings.webhookEnabled && (
                    <div>
                      <Label htmlFor="webhookEndpoint">Webhook-Endpunkt</Label>
                      <Input
                        id="webhookEndpoint"
                        type="url"
                        placeholder="https://api.example.com/webhook"
                        value={settings.webhookEndpoint || ''}
                        onChange={(e) => updateSettings('webhookEndpoint', e.target.value)}
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="apiAccessEnabled"
                      checked={settings.apiAccessEnabled}
                      onCheckedChange={(checked) => updateSettings('apiAccessEnabled', checked)}
                    />
                    <Label htmlFor="apiAccessEnabled">API-Zugriff aktivieren</Label>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 bg-white shadow-lg rounded-lg p-4 border">
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600">
              Sie haben ungespeicherte Änderungen
            </div>
            <Button variant="outline" onClick={handleResetSettings}>
              Verwerfen
            </Button>
            <Button onClick={handleSaveSettings} disabled={saving}>
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Speichern
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
