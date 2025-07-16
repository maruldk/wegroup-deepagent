
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { UserPlus, Save, Upload, Calendar as CalendarIcon, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { de } from "date-fns/locale"

interface FormData {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth?: Date
    address: string
    emergencyContact: string
    emergencyPhone: string
  }
  employment: {
    employeeId: string
    department: string
    position: string
    startDate?: Date
    employmentType: string
    workLocation: string
    directManager: string
    salary: string
    probationPeriod: string
  }
  access: {
    systemAccess: boolean
    emailAccount: boolean
    buildingAccess: boolean
    equipmentNeeded: string[]
    specialPermissions: string[]
  }
  documents: {
    contract: File | null
    idDocument: File | null
    certificates: File[]
    medicalCertificate: File | null
  }
}

export default function NewEmployeePage() {
  const [currentTab, setCurrentTab] = useState("personal")
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      emergencyContact: "",
      emergencyPhone: ""
    },
    employment: {
      employeeId: "",
      department: "",
      position: "",
      employmentType: "",
      workLocation: "",
      directManager: "",
      salary: "",
      probationPeriod: "6"
    },
    access: {
      systemAccess: true,
      emailAccount: true,
      buildingAccess: true,
      equipmentNeeded: [],
      specialPermissions: []
    },
    documents: {
      contract: null,
      idDocument: null,
      certificates: [],
      medicalCertificate: null
    }
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const updateFormData = (section: keyof FormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const validateCurrentTab = () => {
    const errors: string[] = []
    
    switch (currentTab) {
      case "personal":
        if (!formData.personalInfo.firstName) errors.push("Vorname ist erforderlich")
        if (!formData.personalInfo.lastName) errors.push("Nachname ist erforderlich")
        if (!formData.personalInfo.email) errors.push("E-Mail ist erforderlich")
        if (!formData.personalInfo.phone) errors.push("Telefonnummer ist erforderlich")
        break
      case "employment":
        if (!formData.employment.department) errors.push("Abteilung ist erforderlich")
        if (!formData.employment.position) errors.push("Position ist erforderlich")
        if (!formData.employment.employmentType) errors.push("Beschäftigungsart ist erforderlich")
        if (!formData.employment.salary) errors.push("Gehalt ist erforderlich")
        break
    }
    
    setValidationErrors(errors)
    return errors.length === 0
  }

  const nextTab = () => {
    if (!validateCurrentTab()) return
    
    const tabs = ["personal", "employment", "access", "documents", "review"]
    const currentIndex = tabs.indexOf(currentTab)
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1])
    }
  }

  const prevTab = () => {
    const tabs = ["personal", "employment", "access", "documents", "review"]
    const currentIndex = tabs.indexOf(currentTab)
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1])
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // Redirect to employee list or show success message
      alert("Mitarbeiter erfolgreich angelegt!")
    }, 2000)
  }

  const getProgressValue = () => {
    const tabs = ["personal", "employment", "access", "documents", "review"]
    const currentIndex = tabs.indexOf(currentTab)
    return ((currentIndex + 1) / tabs.length) * 100
  }

  const isFormComplete = () => {
    return formData.personalInfo.firstName &&
           formData.personalInfo.lastName &&
           formData.personalInfo.email &&
           formData.employment.department &&
           formData.employment.position &&
           formData.employment.employmentType
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zur Übersicht
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Neuen Mitarbeiter anlegen</h1>
          <p className="text-gray-600 mt-1">Vollständige Onboarding-Prozess für neue Teammitglieder</p>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Fortschritt</span>
            <span className="text-sm text-gray-500">{Math.round(getProgressValue())}% abgeschlossen</span>
          </div>
          <Progress value={getProgressValue()} className="h-2" />
        </CardContent>
      </Card>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Bitte korrigieren Sie folgende Fehler:</h4>
                <ul className="list-disc list-inside text-sm text-red-700 mt-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal" className="text-xs">Persönlich</TabsTrigger>
          <TabsTrigger value="employment" className="text-xs">Anstellung</TabsTrigger>
          <TabsTrigger value="access" className="text-xs">Zugang</TabsTrigger>
          <TabsTrigger value="documents" className="text-xs">Dokumente</TabsTrigger>
          <TabsTrigger value="review" className="text-xs">Übersicht</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Persönliche Informationen</CardTitle>
              <CardDescription>Grunddaten des neuen Mitarbeiters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Vorname *</Label>
                  <Input
                    id="firstName"
                    value={formData.personalInfo.firstName}
                    onChange={(e) => updateFormData('personalInfo', 'firstName', e.target.value)}
                    placeholder="Max"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nachname *</Label>
                  <Input
                    id="lastName"
                    value={formData.personalInfo.lastName}
                    onChange={(e) => updateFormData('personalInfo', 'lastName', e.target.value)}
                    placeholder="Mustermann"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">E-Mail Adresse *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={(e) => updateFormData('personalInfo', 'email', e.target.value)}
                    placeholder="max.mustermann@wegroup.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefonnummer *</Label>
                  <Input
                    id="phone"
                    value={formData.personalInfo.phone}
                    onChange={(e) => updateFormData('personalInfo', 'phone', e.target.value)}
                    placeholder="+49 123 456789"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Geburtsdatum</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.personalInfo.dateOfBirth ? 
                        format(formData.personalInfo.dateOfBirth, "dd.MM.yyyy", { locale: de }) : 
                        "Datum auswählen"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.personalInfo.dateOfBirth}
                      onSelect={(date) => updateFormData('personalInfo', 'dateOfBirth', date)}
                      locale={de}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                  id="address"
                  value={formData.personalInfo.address}
                  onChange={(e) => updateFormData('personalInfo', 'address', e.target.value)}
                  placeholder="Musterstraße 123, 12345 Musterstadt"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyContact">Notfallkontakt</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.personalInfo.emergencyContact}
                    onChange={(e) => updateFormData('personalInfo', 'emergencyContact', e.target.value)}
                    placeholder="Maria Mustermann"
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Notfall-Telefon</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.personalInfo.emergencyPhone}
                    onChange={(e) => updateFormData('personalInfo', 'emergencyPhone', e.target.value)}
                    placeholder="+49 987 654321"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Anstellungsdetails</CardTitle>
              <CardDescription>Arbeitsvertrag und Organisationseinbindung</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employeeId">Mitarbeiter-ID</Label>
                  <Input
                    id="employeeId"
                    value={formData.employment.employeeId}
                    onChange={(e) => updateFormData('employment', 'employeeId', e.target.value)}
                    placeholder="EMP-2024-001"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Abteilung *</Label>
                  <Select value={formData.employment.department} onValueChange={(value) => updateFormData('employment', 'department', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Abteilung wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="HR">Human Resources</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    value={formData.employment.position}
                    onChange={(e) => updateFormData('employment', 'position', e.target.value)}
                    placeholder="Senior Developer"
                  />
                </div>
                <div>
                  <Label htmlFor="employmentType">Beschäftigungsart *</Label>
                  <Select value={formData.employment.employmentType} onValueChange={(value) => updateFormData('employment', 'employmentType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Art wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fulltime">Vollzeit</SelectItem>
                      <SelectItem value="parttime">Teilzeit</SelectItem>
                      <SelectItem value="contract">Vertrag</SelectItem>
                      <SelectItem value="intern">Praktikant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="startDate">Startdatum</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.employment.startDate ? 
                        format(formData.employment.startDate, "dd.MM.yyyy", { locale: de }) : 
                        "Startdatum auswählen"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.employment.startDate}
                      onSelect={(date) => updateFormData('employment', 'startDate', date)}
                      locale={de}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workLocation">Arbeitsort</Label>
                  <Select value={formData.employment.workLocation} onValueChange={(value) => updateFormData('employment', 'workLocation', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Arbeitsort wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="office">Büro</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="directManager">Direkte Führungskraft</Label>
                  <Select value={formData.employment.directManager} onValueChange={(value) => updateFormData('employment', 'directManager', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Vorgesetzten wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anna.schmidt">Anna Schmidt</SelectItem>
                      <SelectItem value="michael.weber">Michael Weber</SelectItem>
                      <SelectItem value="thomas.fischer">Thomas Fischer</SelectItem>
                      <SelectItem value="sarah.klein">Sarah Klein</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salary">Jahresgehalt *</Label>
                  <Input
                    id="salary"
                    value={formData.employment.salary}
                    onChange={(e) => updateFormData('employment', 'salary', e.target.value)}
                    placeholder="75000"
                  />
                </div>
                <div>
                  <Label htmlFor="probationPeriod">Probezeit (Monate)</Label>
                  <Select value={formData.employment.probationPeriod} onValueChange={(value) => updateFormData('employment', 'probationPeriod', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Monate</SelectItem>
                      <SelectItem value="6">6 Monate</SelectItem>
                      <SelectItem value="12">12 Monate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Zugangsberechtigungen</CardTitle>
              <CardDescription>System- und Gebäudezugang konfigurieren</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>System-Zugang</Label>
                    <p className="text-sm text-gray-600">Zugang zu internen Systemen und Anwendungen</p>
                  </div>
                  <Switch
                    checked={formData.access.systemAccess}
                    onCheckedChange={(checked) => updateFormData('access', 'systemAccess', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>E-Mail Account</Label>
                    <p className="text-sm text-gray-600">Firmenemail und Office 365 Zugang</p>
                  </div>
                  <Switch
                    checked={formData.access.emailAccount}
                    onCheckedChange={(checked) => updateFormData('access', 'emailAccount', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Gebäudezugang</Label>
                    <p className="text-sm text-gray-600">Zutritt zu Büroräumlichkeiten</p>
                  </div>
                  <Switch
                    checked={formData.access.buildingAccess}
                    onCheckedChange={(checked) => updateFormData('access', 'buildingAccess', checked)}
                  />
                </div>
              </div>

              <div>
                <Label>Benötigte Ausrüstung</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {['Laptop', 'Monitor', 'Tastatur', 'Maus', 'Headset', 'Handy'].map((item) => (
                    <Badge
                      key={item}
                      variant={formData.access.equipmentNeeded.includes(item) ? "default" : "outline"}
                      className="cursor-pointer justify-center p-2"
                      onClick={() => {
                        const current = formData.access.equipmentNeeded
                        const updated = current.includes(item)
                          ? current.filter(i => i !== item)
                          : [...current, item]
                        updateFormData('access', 'equipmentNeeded', updated)
                      }}
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Spezielle Berechtigungen</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {['Admin-Rechte', 'Finanz-Zugang', 'HR-System', 'CRM-Vollzugriff'].map((item) => (
                    <Badge
                      key={item}
                      variant={formData.access.specialPermissions.includes(item) ? "default" : "outline"}
                      className="cursor-pointer justify-center p-2"
                      onClick={() => {
                        const current = formData.access.specialPermissions
                        const updated = current.includes(item)
                          ? current.filter(i => i !== item)
                          : [...current, item]
                        updateFormData('access', 'specialPermissions', updated)
                      }}
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dokumente</CardTitle>
              <CardDescription>Upload wichtiger Dokumente und Nachweise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Arbeitsvertrag</h4>
                  <p className="text-sm text-gray-600 mb-2">PDF, max. 10MB</p>
                  <Button variant="outline" size="sm">
                    Datei auswählen
                  </Button>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Ausweisdokument</h4>
                  <p className="text-sm text-gray-600 mb-2">PDF oder Bild, max. 5MB</p>
                  <Button variant="outline" size="sm">
                    Datei auswählen
                  </Button>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Zeugnisse</h4>
                  <p className="text-sm text-gray-600 mb-2">Mehrere Dateien möglich</p>
                  <Button variant="outline" size="sm">
                    Dateien auswählen
                  </Button>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Gesundheitszeugnis</h4>
                  <p className="text-sm text-gray-600 mb-2">Optional, PDF max. 5MB</p>
                  <Button variant="outline" size="sm">
                    Datei auswählen
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Übersicht und Bestätigung</CardTitle>
              <CardDescription>Prüfen Sie alle Angaben vor der finalen Erstellung</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Persönliche Daten</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Name:</span> {formData.personalInfo.firstName} {formData.personalInfo.lastName}</div>
                    <div><span className="text-gray-600">E-Mail:</span> {formData.personalInfo.email}</div>
                    <div><span className="text-gray-600">Telefon:</span> {formData.personalInfo.phone}</div>
                    {formData.personalInfo.dateOfBirth && (
                      <div><span className="text-gray-600">Geburtsdatum:</span> {format(formData.personalInfo.dateOfBirth, "dd.MM.yyyy", { locale: de })}</div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Anstellung</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Abteilung:</span> {formData.employment.department}</div>
                    <div><span className="text-gray-600">Position:</span> {formData.employment.position}</div>
                    <div><span className="text-gray-600">Beschäftigungsart:</span> {formData.employment.employmentType}</div>
                    {formData.employment.startDate && (
                      <div><span className="text-gray-600">Startdatum:</span> {format(formData.employment.startDate, "dd.MM.yyyy", { locale: de })}</div>
                    )}
                    {formData.employment.salary && (
                      <div><span className="text-gray-600">Gehalt:</span> €{parseInt(formData.employment.salary).toLocaleString()}</div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Zugangsberechtigungen</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.access.systemAccess && <Badge>System-Zugang</Badge>}
                  {formData.access.emailAccount && <Badge>E-Mail Account</Badge>}
                  {formData.access.buildingAccess && <Badge>Gebäudezugang</Badge>}
                  {formData.access.equipmentNeeded.map(item => (
                    <Badge key={item} variant="outline">{item}</Badge>
                  ))}
                  {formData.access.specialPermissions.map(item => (
                    <Badge key={item} variant="secondary">{item}</Badge>
                  ))}
                </div>
              </div>

              {isFormComplete() ? (
                <div className="flex items-center space-x-2 p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-800">Alle erforderlichen Angaben sind vollständig</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 p-4 bg-yellow-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-yellow-800">Bitte vervollständigen Sie alle Pflichtfelder</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={prevTab} 
          disabled={currentTab === "personal"}
        >
          Zurück
        </Button>
        
        {currentTab === "review" ? (
          <Button 
            onClick={handleSubmit} 
            disabled={!isFormComplete() || isSubmitting}
            className="min-w-32"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Wird erstellt...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Mitarbeiter anlegen
              </>
            )}
          </Button>
        ) : (
          <Button onClick={nextTab}>
            Weiter
          </Button>
        )}
      </div>
    </div>
  )
}
