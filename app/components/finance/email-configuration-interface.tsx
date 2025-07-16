
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Mail, 
  Plus, 
  Settings, 
  Shield, 
  TestTube, 
  CheckCircle, 
  AlertCircle,
  Trash2,
  Edit,
  Server,
  Lock,
  Zap,
  Bell,
  Archive,
  Eye,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

interface EmailConfig {
  id: string;
  tenantId: string;
  emailAddress: string;
  displayName: string;
  domain: string;
  emailPrefix: string;
  imapHost?: string;
  imapPort: number;
  imapUsername?: string;
  imapPassword?: string;
  imapSslEnabled: boolean;
  smtpHost?: string;
  smtpPort: number;
  smtpUsername?: string;
  smtpPassword?: string;
  smtpSslEnabled: boolean;
  autoProcessingEnabled: boolean;
  attachmentTypes: string[];
  maxAttachmentSize: number;
  spamFilterEnabled: boolean;
  aiClassificationEnabled: boolean;
  confidenceThreshold: number;
  autoApprovalThreshold: number;
  notificationEnabled: boolean;
  notificationEmails: string[];
  escalationEmails: string[];
  backupEmailAddress?: string;
  archiveEnabled: boolean;
  archiveAfterDays: number;
  isActive: boolean;
  lastTestDate?: string;
  lastTestResult?: string;
  connectionStatus: string;
  _count: {
    emailInvoices: number;
    emailProcessingLogs: number;
  };
}

export function EmailConfigurationInterface() {
  const [emailConfigs, setEmailConfigs] = useState<EmailConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingConfig, setEditingConfig] = useState<EmailConfig | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  useEffect(() => {
    fetchEmailConfigs();
  }, []);

  const fetchEmailConfigs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/finance/tenant-email-config?tenantId=default');
      const data = await response.json();
      setEmailConfigs(data.emailConfigs || []);
    } catch (error) {
      console.error('Error fetching email configurations:', error);
      toast.error('Fehler beim Laden der E-Mail-Konfigurationen');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async (config: Partial<EmailConfig>) => {
    try {
      const response = await fetch('/api/finance/tenant-email-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: 'default',
          ...config
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('E-Mail-Konfiguration gespeichert');
        fetchEmailConfigs();
        setEditingConfig(null);
        setShowAddDialog(false);
      } else {
        toast.error('Fehler beim Speichern der Konfiguration');
      }
    } catch (error) {
      console.error('Error saving email configuration:', error);
      toast.error('Fehler beim Speichern der Konfiguration');
    }
  };

  const handleTestConnection = async (configId: string) => {
    try {
      setTestingConnection(configId);
      const response = await fetch('/api/finance/tenant-email-config/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: 'default',
          emailConfigId: configId
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Verbindungstest erfolgreich');
        fetchEmailConfigs();
      } else {
        toast.error('Verbindungstest fehlgeschlagen');
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      toast.error('Fehler beim Verbindungstest');
    } finally {
      setTestingConnection(null);
    }
  };

  const handleDeleteConfig = async (configId: string) => {
    try {
      const response = await fetch(`/api/finance/tenant-email-config?configId=${configId}&tenantId=default`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        toast.success('E-Mail-Konfiguration gelöscht');
        fetchEmailConfigs();
      } else {
        toast.error('Fehler beim Löschen der Konfiguration');
      }
    } catch (error) {
      console.error('Error deleting configuration:', error);
      toast.error('Fehler beim Löschen der Konfiguration');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONNECTED': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'NOT_TESTED': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONNECTED': return <CheckCircle className="w-4 h-4" />;
      case 'FAILED': return <AlertCircle className="w-4 h-4" />;
      case 'NOT_TESTED': return <TestTube className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const ConfigForm = ({ config, onSave, onCancel }: { 
    config: Partial<EmailConfig> | null; 
    onSave: (config: Partial<EmailConfig>) => void; 
    onCancel: () => void; 
  }) => {
    const [formData, setFormData] = useState<Partial<EmailConfig>>(config || {
      emailAddress: '',
      displayName: '',
      domain: '',
      emailPrefix: 'invoice',
      imapHost: '',
      imapPort: 993,
      imapUsername: '',
      imapPassword: '',
      imapSslEnabled: true,
      smtpHost: '',
      smtpPort: 587,
      smtpUsername: '',
      smtpPassword: '',
      smtpSslEnabled: true,
      autoProcessingEnabled: true,
      attachmentTypes: ['pdf', 'png', 'jpg', 'jpeg'],
      maxAttachmentSize: 25,
      spamFilterEnabled: true,
      aiClassificationEnabled: true,
      confidenceThreshold: 0.7,
      autoApprovalThreshold: 0.9,
      notificationEnabled: true,
      notificationEmails: [],
      escalationEmails: [],
      archiveEnabled: true,
      archiveAfterDays: 365,
      isActive: true
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basis</TabsTrigger>
            <TabsTrigger value="server">Server</TabsTrigger>
            <TabsTrigger value="ai">KI & Regeln</TabsTrigger>
            <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emailAddress">E-Mail-Adresse</Label>
                <Input
                  id="emailAddress"
                  type="email"
                  placeholder="invoice@mandant1.wegroup.com"
                  value={formData.emailAddress}
                  onChange={(e) => setFormData({...formData, emailAddress: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="displayName">Anzeigename</Label>
                <Input
                  id="displayName"
                  placeholder="Rechnungsverarbeitung Mandant 1"
                  value={formData.displayName}
                  onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  placeholder="mandant1.wegroup.com"
                  value={formData.domain}
                  onChange={(e) => setFormData({...formData, domain: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="emailPrefix">E-Mail-Präfix</Label>
                <Input
                  id="emailPrefix"
                  placeholder="invoice"
                  value={formData.emailPrefix}
                  onChange={(e) => setFormData({...formData, emailPrefix: e.target.value})}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
              />
              <Label htmlFor="isActive">Konfiguration aktiv</Label>
            </div>
          </TabsContent>

          <TabsContent value="server" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-medium">
                <Server className="w-4 h-4" />
                <span>IMAP-Konfiguration</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="imapHost">IMAP-Host</Label>
                  <Input
                    id="imapHost"
                    placeholder="imap.gmail.com"
                    value={formData.imapHost}
                    onChange={(e) => setFormData({...formData, imapHost: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="imapPort">IMAP-Port</Label>
                  <Input
                    id="imapPort"
                    type="number"
                    placeholder="993"
                    value={formData.imapPort}
                    onChange={(e) => setFormData({...formData, imapPort: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="imapUsername">IMAP-Benutzername</Label>
                  <Input
                    id="imapUsername"
                    placeholder="username"
                    value={formData.imapUsername}
                    onChange={(e) => setFormData({...formData, imapUsername: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="imapPassword">IMAP-Passwort</Label>
                  <Input
                    id="imapPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.imapPassword}
                    onChange={(e) => setFormData({...formData, imapPassword: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="imapSslEnabled"
                  checked={formData.imapSslEnabled}
                  onCheckedChange={(checked) => setFormData({...formData, imapSslEnabled: checked})}
                />
                <Label htmlFor="imapSslEnabled">SSL verwenden</Label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-medium">
                <Mail className="w-4 h-4" />
                <span>SMTP-Konfiguration</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">SMTP-Host</Label>
                  <Input
                    id="smtpHost"
                    placeholder="smtp.gmail.com"
                    value={formData.smtpHost}
                    onChange={(e) => setFormData({...formData, smtpHost: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP-Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    placeholder="587"
                    value={formData.smtpPort}
                    onChange={(e) => setFormData({...formData, smtpPort: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpUsername">SMTP-Benutzername</Label>
                  <Input
                    id="smtpUsername"
                    placeholder="username"
                    value={formData.smtpUsername}
                    onChange={(e) => setFormData({...formData, smtpUsername: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">SMTP-Passwort</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.smtpPassword}
                    onChange={(e) => setFormData({...formData, smtpPassword: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="smtpSslEnabled"
                  checked={formData.smtpSslEnabled}
                  onCheckedChange={(checked) => setFormData({...formData, smtpSslEnabled: checked})}
                />
                <Label htmlFor="smtpSslEnabled">SSL verwenden</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-medium">
                <Zap className="w-4 h-4" />
                <span>KI-Verarbeitung</span>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="aiClassificationEnabled"
                  checked={formData.aiClassificationEnabled}
                  onCheckedChange={(checked) => setFormData({...formData, aiClassificationEnabled: checked})}
                />
                <Label htmlFor="aiClassificationEnabled">KI-Klassifizierung aktivieren</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="confidenceThreshold">Konfidenz-Schwellenwert</Label>
                  <Input
                    id="confidenceThreshold"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.confidenceThreshold}
                    onChange={(e) => setFormData({...formData, confidenceThreshold: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="autoApprovalThreshold">Auto-Genehmigung-Schwellenwert</Label>
                  <Input
                    id="autoApprovalThreshold"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.autoApprovalThreshold}
                    onChange={(e) => setFormData({...formData, autoApprovalThreshold: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-medium">
                <Shield className="w-4 h-4" />
                <span>Sicherheit & Filter</span>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="spamFilterEnabled"
                  checked={formData.spamFilterEnabled}
                  onCheckedChange={(checked) => setFormData({...formData, spamFilterEnabled: checked})}
                />
                <Label htmlFor="spamFilterEnabled">Spam-Filter aktivieren</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxAttachmentSize">Max. Anhang-Größe (MB)</Label>
                  <Input
                    id="maxAttachmentSize"
                    type="number"
                    value={formData.maxAttachmentSize}
                    onChange={(e) => setFormData({...formData, maxAttachmentSize: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="archiveAfterDays">Archivierung nach (Tage)</Label>
                  <Input
                    id="archiveAfterDays"
                    type="number"
                    value={formData.archiveAfterDays}
                    onChange={(e) => setFormData({...formData, archiveAfterDays: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-medium">
                <Bell className="w-4 h-4" />
                <span>Benachrichtigungen</span>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="notificationEnabled"
                  checked={formData.notificationEnabled}
                  onCheckedChange={(checked) => setFormData({...formData, notificationEnabled: checked})}
                />
                <Label htmlFor="notificationEnabled">Benachrichtigungen aktivieren</Label>
              </div>
              <div>
                <Label htmlFor="backupEmailAddress">Backup-E-Mail-Adresse</Label>
                <Input
                  id="backupEmailAddress"
                  type="email"
                  placeholder="backup@mandant1.wegroup.com"
                  value={formData.backupEmailAddress}
                  onChange={(e) => setFormData({...formData, backupEmailAddress: e.target.value})}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Abbrechen
          </Button>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            Speichern
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            E-Mail-Konfiguration
          </h1>
          <p className="text-gray-600 mt-1">
            Multi-Mandant E-Mail-Integration für automatische Rechnungsverarbeitung
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Neue Konfiguration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Neue E-Mail-Konfiguration</DialogTitle>
            </DialogHeader>
            <ConfigForm
              config={null}
              onSave={handleSaveConfig}
              onCancel={() => setShowAddDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Email Configurations */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Lade E-Mail-Konfigurationen...</p>
          </div>
        ) : emailConfigs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Keine E-Mail-Konfigurationen
              </h3>
              <p className="text-gray-600 mb-4">
                Erstellen Sie Ihre erste E-Mail-Konfiguration für die automatische Rechnungsverarbeitung.
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Erste Konfiguration erstellen
              </Button>
            </CardContent>
          </Card>
        ) : (
          emailConfigs.map((config) => (
            <Card key={config.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      {config.emailAddress}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {config.displayName || 'Keine Beschreibung'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(config.connectionStatus)}>
                      {getStatusIcon(config.connectionStatus)}
                      <span className="ml-1">{config.connectionStatus}</span>
                    </Badge>
                    {config.isActive ? (
                      <Badge className="bg-green-100 text-green-800">Aktiv</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800">Inaktiv</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600">Domain</div>
                    <div className="font-medium">{config.domain}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Präfix</div>
                    <div className="font-medium">{config.emailPrefix}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Verarbeitete E-Mails</div>
                    <div className="font-medium">{config._count.emailInvoices}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Letzter Test</div>
                    <div className="font-medium text-sm">
                      {config.lastTestDate ? new Date(config.lastTestDate).toLocaleDateString() : 'Nie'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  {config.aiClassificationEnabled && (
                    <Badge variant="outline" className="text-blue-600">
                      <Zap className="w-3 h-3 mr-1" />
                      KI aktiviert
                    </Badge>
                  )}
                  {config.spamFilterEnabled && (
                    <Badge variant="outline" className="text-green-600">
                      <Shield className="w-3 h-3 mr-1" />
                      Spam-Filter
                    </Badge>
                  )}
                  {config.archiveEnabled && (
                    <Badge variant="outline" className="text-gray-600">
                      <Archive className="w-3 h-3 mr-1" />
                      Archivierung
                    </Badge>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestConnection(config.id)}
                      disabled={testingConnection === config.id}
                    >
                      {testingConnection === config.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      ) : (
                        <TestTube className="w-4 h-4" />
                      )}
                      <span className="ml-2">Testen</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `/finance/email-monitoring?configId=${config.id}`}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Monitoring
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Bearbeiten
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>E-Mail-Konfiguration bearbeiten</DialogTitle>
                        </DialogHeader>
                        <ConfigForm
                          config={config}
                          onSave={handleSaveConfig}
                          onCancel={() => setEditingConfig(null)}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteConfig(config.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Löschen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
