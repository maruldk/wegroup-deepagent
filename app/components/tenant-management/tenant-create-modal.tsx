
'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Palette,
  Crown,
  Star,
  Rocket,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

interface TenantCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const createTenantSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich'),
  displayName: z.string().optional(),
  shortName: z.string().optional(),
  domain: z.string().min(1, 'Domain ist erforderlich'),
  subdomain: z.string().optional(),
  description: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().optional(),
  email: z.string().email('Ungültige E-Mail-Adresse').optional().or(z.literal('')),
  phone: z.string().optional(),
  planType: z.enum(['DEMO', 'BASIC', 'PRO', 'ENTERPRISE', 'CUSTOM']),
  brandColor: z.string().optional()
});

const PLAN_OPTIONS = [
  {
    value: 'DEMO',
    label: 'Demo',
    description: 'Kostenlose Testversion mit eingeschränkten Features',
    icon: Star,
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    features: ['5 Benutzer', 'Basic Features', '30 Tage gültig']
  },
  {
    value: 'BASIC',
    label: 'Basic',
    description: 'Grundausstattung für kleine Teams',
    icon: Building2,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    features: ['25 Benutzer', 'Standard Features', 'E-Mail Support']
  },
  {
    value: 'PRO',
    label: 'Pro',
    description: 'Erweiterte Features für wachsende Unternehmen',
    icon: Rocket,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    features: ['100 Benutzer', 'Advanced Features', 'Priority Support']
  },
  {
    value: 'ENTERPRISE',
    label: 'Enterprise',
    description: 'Vollständige Lösung für große Organisationen',
    icon: Crown,
    color: 'bg-green-100 text-green-700 border-green-200',
    features: ['Unbegrenzte Benutzer', 'All Features', '24/7 Support']
  }
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
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#6B7280', // Gray
  '#EC4899', // Pink
  '#14B8A6'  // Teal
];

export function TenantCreateModal({ open, onOpenChange, onSuccess }: TenantCreateModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    shortName: '',
    domain: '',
    subdomain: '',
    description: '',
    industry: '',
    website: '',
    email: '',
    phone: '',
    planType: 'DEMO' as const,
    brandColor: '#3B82F6'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate fields
    if (field === 'name') {
      if (!formData.displayName || formData.displayName === formData.name) {
        setFormData(prev => ({ ...prev, displayName: value + ' GmbH' }));
      }
      if (!formData.shortName || formData.shortName === formData.name.toLowerCase()) {
        setFormData(prev => ({ ...prev, shortName: value.toLowerCase().replace(/\s+/g, '') }));
      }
      if (!formData.domain || formData.domain === formData.name.toLowerCase() + '.abacusai.app') {
        setFormData(prev => ({ ...prev, domain: value.toLowerCase().replace(/\s+/g, '') + '.abacusai.app' }));
      }
    }
    
    // Clear errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name ist erforderlich';
      if (!formData.domain.trim()) newErrors.domain = 'Domain ist erforderlich';
      if (formData.email && !z.string().email().safeParse(formData.email).success) {
        newErrors.email = 'Ungültige E-Mail-Adresse';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(1)) return;

    try {
      setLoading(true);
      
      const validatedData = createTenantSchema.parse(formData);
      
      const response = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create tenant');
      }

      toast.success('Mandant erfolgreich erstellt');
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        name: '',
        displayName: '',
        shortName: '',
        domain: '',
        subdomain: '',
        description: '',
        industry: '',
        website: '',
        email: '',
        phone: '',
        planType: 'DEMO',
        brandColor: '#3B82F6'
      });
      setCurrentStep(1);
      
    } catch (error) {
      console.error('Error creating tenant:', error);
      toast.error(error instanceof Error ? error.message : 'Fehler beim Erstellen des Mandanten');
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = PLAN_OPTIONS.find(plan => plan.value === formData.planType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building2 className="h-5 w-5 text-blue-600" />
            Neuen Mandanten erstellen
          </DialogTitle>
          <DialogDescription>
            Erstellen Sie einen neuen Mandanten mit allen erforderlichen Konfigurationen
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center gap-4">
            <motion.div 
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                currentStep >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-500'
              }`}
              animate={{ scale: currentStep === 1 ? 1.1 : 1 }}
            >
              1
            </motion.div>
            <div className={`h-0.5 w-16 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <motion.div 
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                currentStep >= 2 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-500'
              }`}
              animate={{ scale: currentStep === 2 ? 1.1 : 1 }}
            >
              2
            </motion.div>
          </div>

          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Grundinformationen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="z.B. weGROUP"
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="displayName">Anzeigename</Label>
                      <Input
                        id="displayName"
                        value={formData.displayName}
                        onChange={(e) => handleInputChange('displayName', e.target.value)}
                        placeholder="z.B. weGROUP GmbH"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shortName">Kurzname</Label>
                      <Input
                        id="shortName"
                        value={formData.shortName}
                        onChange={(e) => handleInputChange('shortName', e.target.value)}
                        placeholder="z.B. wegroup"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="domain">Domain *</Label>
                      <Input
                        id="domain"
                        value={formData.domain}
                        onChange={(e) => handleInputChange('domain', e.target.value)}
                        placeholder="z.B. wegroup.abacusai.app"
                        className={errors.domain ? 'border-red-500' : ''}
                      />
                      {errors.domain && <p className="text-sm text-red-500">{errors.domain}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Beschreibung</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Kurze Beschreibung des Mandanten..."
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-Mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="kontakt@unternehmen.de"
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+49 123 456789"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://www.unternehmen.de"
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
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    Plan auswählen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PLAN_OPTIONS.map((plan) => {
                      const Icon = plan.icon;
                      const isSelected = formData.planType === plan.value;
                      
                      return (
                        <motion.div
                          key={plan.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card 
                            className={`cursor-pointer transition-all ${
                              isSelected 
                                ? 'ring-2 ring-blue-500 border-blue-200' 
                                : 'hover:border-gray-300'
                            }`}
                            onClick={() => handleInputChange('planType', plan.value)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${plan.color}`}>
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900">{plan.label}</h3>
                                  <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                                  <div className="space-y-1">
                                    {plan.features.map((feature, index) => (
                                      <div key={index} className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                        <span className="text-sm text-gray-600">{feature}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                {isSelected && (
                                  <div className="text-blue-600">
                                    <Shield className="h-5 w-5" />
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
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
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                          style={{ backgroundColor: formData.brandColor }}
                        >
                          {(formData.shortName || formData.name).substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {formData.displayName || formData.name || 'Mandantenname'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formData.domain || 'domain.abacusai.app'}
                          </div>
                        </div>
                        <Badge className={selectedPlan?.color}>
                          {selectedPlan?.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <div>
              {currentStep > 1 && (
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(prev => prev - 1)}
                >
                  Zurück
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Abbrechen
              </Button>
              {currentStep < 2 ? (
                <Button onClick={handleNext}>
                  Weiter
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Erstelle...' : 'Mandant erstellen'}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
