
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  ArrowRight,
  Save,
  Send,
  FileText,
  Calendar,
  Euro,
  AlertCircle,
  CheckCircle,
  Upload
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const SERVICE_CATEGORIES = [
  { value: 'IT_SERVICES', label: 'IT Services', description: 'Software-Entwicklung, System-Integration' },
  { value: 'MARKETING_SERVICES', label: 'Marketing Services', description: 'Digital Marketing, Content-Erstellung' },
  { value: 'HR_SERVICES', label: 'HR Services', description: 'Recruiting, Training, HR-Beratung' },
  { value: 'LEGAL_SERVICES', label: 'Legal Services', description: 'Vertragsrecht, Compliance' },
  { value: 'FINANCIAL_SERVICES', label: 'Finance Services', description: 'Buchhaltung, Steuerberatung' },
  { value: 'CONSULTING_BERATUNG', label: 'Consulting Services', description: 'Strategieberatung, Prozessoptimierung' },
];

const SERVICE_TYPES = {
  IT_SERVICES: [
    { value: 'SOFTWARE_DEVELOPMENT', label: 'Software-Entwicklung' },
    { value: 'SYSTEM_INTEGRATION', label: 'System-Integration' },
    { value: 'IT_SUPPORT', label: 'IT-Support' },
  ],
  MARKETING_SERVICES: [
    { value: 'DIGITAL_MARKETING', label: 'Digital Marketing' },
    { value: 'CONTENT_CREATION', label: 'Content-Erstellung' },
    { value: 'BRANDING', label: 'Branding' },
  ],
  HR_SERVICES: [
    { value: 'RECRUITMENT', label: 'Recruiting' },
    { value: 'TRAINING', label: 'Training' },
    { value: 'HR_CONSULTING', label: 'HR-Beratung' },
  ],
  LEGAL_SERVICES: [
    { value: 'CONTRACT_LAW', label: 'Vertragsrecht' },
    { value: 'CORPORATE_LAW', label: 'Gesellschaftsrecht' },
    { value: 'COMPLIANCE', label: 'Compliance' },
  ],
  FINANCIAL_SERVICES: [
    { value: 'ACCOUNTING', label: 'Buchhaltung' },
    { value: 'TAX_ADVISORY', label: 'Steuerberatung' },
    { value: 'FINANCIAL_PLANNING', label: 'Finanzplanung' },
  ],
  CONSULTING_BERATUNG: [
    { value: 'STRATEGY_CONSULTING', label: 'Strategieberatung' },
    { value: 'PROCESS_OPTIMIZATION', label: 'Prozessoptimierung' },
    { value: 'CHANGE_MANAGEMENT', label: 'Change Management' },
  ],
};

export function NewServiceRequestForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    serviceType: '',
    description: '',
    requirements: '',
    budget: '',
    deadline: '',
    priority: 'MEDIUM',
    additionalInfo: '',
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (isDraft = false) => {
    // Simulate API call
    console.log('Submitting request:', { ...formData, isDraft });
    
    // Show success message and redirect
    router.push('/customer-portal/requests');
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.title && formData.category && formData.serviceType;
      case 2:
        return formData.description && formData.requirements;
      case 3:
        return formData.budget && formData.deadline;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Neue Service-Anfrage</h1>
          <p className="text-gray-600">Erstellen Sie eine neue Anfrage für professionelle Services</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step < currentStep ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                step
              )}
            </div>
            {step < 4 && (
              <div
                className={`w-24 h-1 ml-2 ${
                  step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Service Category & Type */}
      {currentStep === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Service-Kategorie wählen</CardTitle>
              <CardDescription>
                Wählen Sie die passende Service-Kategorie und den spezifischen Service-Typ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titel der Anfrage</Label>
                <Input
                  id="title"
                  placeholder="z.B. Website-Entwicklung für E-Commerce"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Service-Kategorie</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value, serviceType: '' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kategorie wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div>
                          <div className="font-medium">{category.label}</div>
                          <div className="text-sm text-gray-500">{category.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.category && (
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service-Typ</Label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Service-Typ wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_TYPES[formData.category as keyof typeof SERVICE_TYPES]?.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Description & Requirements */}
      {currentStep === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Beschreibung & Anforderungen</CardTitle>
              <CardDescription>
                Beschreiben Sie Ihre Anforderungen so detailliert wie möglich
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">Projekt-Beschreibung</Label>
                <Textarea
                  id="description"
                  placeholder="Beschreiben Sie Ihr Projekt und Ihre Ziele..."
                  className="min-h-[120px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Spezifische Anforderungen</Label>
                <Textarea
                  id="requirements"
                  placeholder="Listen Sie spezifische Anforderungen, Technologien, Standards etc. auf..."
                  className="min-h-[120px]"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Zusätzliche Informationen (optional)</Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Weitere wichtige Informationen..."
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 3: Budget & Timeline */}
      {currentStep === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Budget & Zeitplan</CardTitle>
              <CardDescription>
                Geben Sie Ihr Budget und den gewünschten Zeitrahmen an
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (EUR)</Label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="budget"
                      type="number"
                      placeholder="25000"
                      className="pl-10"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Gewünschter Abschluss</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="deadline"
                      type="date"
                      className="pl-10"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priorität</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Niedrig</SelectItem>
                    <SelectItem value="MEDIUM">Mittel</SelectItem>
                    <SelectItem value="HIGH">Hoch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 4: Review & Submit */}
      {currentStep === 4 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Zusammenfassung</CardTitle>
              <CardDescription>
                Überprüfen Sie Ihre Angaben vor dem Absenden
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Titel</h3>
                  <p className="text-gray-600">{formData.title}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Service-Kategorie</h3>
                  <p className="text-gray-600">
                    {SERVICE_CATEGORIES.find(c => c.value === formData.category)?.label}
                    {' - '}
                    {SERVICE_TYPES[formData.category as keyof typeof SERVICE_TYPES]?.find(t => t.value === formData.serviceType)?.label}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Budget & Deadline</h3>
                  <p className="text-gray-600">€{formData.budget} bis {formData.deadline}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Priorität</h3>
                  <Badge variant="secondary">
                    {formData.priority === 'LOW' ? 'Niedrig' : formData.priority === 'MEDIUM' ? 'Mittel' : 'Hoch'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <div>
          {currentStep > 1 && (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => handleSubmit(true)}>
            <Save className="h-4 w-4 mr-2" />
            Als Entwurf speichern
          </Button>
          
          {currentStep < totalSteps ? (
            <Button 
              onClick={handleNext}
              disabled={!isStepValid(currentStep)}
            >
              Weiter
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={() => handleSubmit(false)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Anfrage absenden
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
