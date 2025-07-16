
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Package, 
  MapPin, 
  Calendar, 
  Truck, 
  AlertTriangle, 
  Thermometer,
  Shield,
  Clock,
  Euro,
  FileText,
  Send,
  Save,
  X,
  Plus,
  Minus,
  Info,
  CheckCircle,
  Navigation,
  Zap,
  Target,
  Star,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TransportRequestData {
  requestType: 'ROAD' | 'AIR' | 'SEA' | 'RAIL';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  cargoType: string;
  cargoWeight: number;
  cargoVolume: number;
  cargoValue: number;
  cargoDescription: string;
  isDangerous: boolean;
  dangerousClass?: string;
  pickupAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    contactPerson: string;
    contactPhone: string;
  };
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    contactPerson: string;
    contactPhone: string;
  };
  pickupDate: string;
  deliveryDate: string;
  flexibleTiming: boolean;
  temperatureControlled: boolean;
  temperatureMin?: number;
  temperatureMax?: number;
  requiresInsurance: boolean;
  specialInstructions: string;
  documents: File[];
}

interface EstimatedQuote {
  supplier: string;
  estimatedPrice: number;
  transitTime: number;
  reliability: number;
  aiScore: number;
}

export function TransportRequestForm() {
  const [formData, setFormData] = useState<TransportRequestData>({
    requestType: 'ROAD',
    priority: 'NORMAL',
    cargoType: '',
    cargoWeight: 0,
    cargoVolume: 0,
    cargoValue: 0,
    cargoDescription: '',
    isDangerous: false,
    dangerousClass: '',
    pickupAddress: {
      street: '',
      city: '',
      postalCode: '',
      country: 'Germany',
      contactPerson: '',
      contactPhone: ''
    },
    deliveryAddress: {
      street: '',
      city: '',
      postalCode: '',
      country: 'Germany',
      contactPerson: '',
      contactPhone: ''
    },
    pickupDate: '',
    deliveryDate: '',
    flexibleTiming: false,
    temperatureControlled: false,
    temperatureMin: 0,
    temperatureMax: 0,
    requiresInsurance: false,
    specialInstructions: '',
    documents: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [estimatedQuotes, setEstimatedQuotes] = useState<EstimatedQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requestNumber, setRequestNumber] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const totalSteps = 4;

  const cargoTypes = [
    'Electronics',
    'Automotive Parts',
    'Industrial Equipment',
    'Chemicals',
    'Textiles',
    'Food & Beverages',
    'Pharmaceutical',
    'Consumer Goods',
    'Raw Materials',
    'Other'
  ];

  const dangerousClasses = [
    'Class 1 - Explosives',
    'Class 2 - Gases',
    'Class 3 - Flammable Liquids',
    'Class 4 - Flammable Solids',
    'Class 5 - Oxidizing Substances',
    'Class 6 - Toxic Substances',
    'Class 7 - Radioactive Materials',
    'Class 8 - Corrosive Substances',
    'Class 9 - Miscellaneous'
  ];

  const countries = [
    'Germany',
    'Austria',
    'Switzerland',
    'France',
    'Netherlands',
    'Belgium',
    'Luxembourg',
    'Denmark',
    'Poland',
    'Czech Republic',
    'Other'
  ];

  useEffect(() => {
    if (currentStep === 4) {
      generateEstimatedQuotes();
    }
  }, [currentStep]);

  const generateEstimatedQuotes = async () => {
    setLoading(true);
    
    // Simulate API call to get estimated quotes
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockQuotes: EstimatedQuote[] = [
      {
        supplier: 'Trans Europa GmbH',
        estimatedPrice: 1250,
        transitTime: 24,
        reliability: 0.96,
        aiScore: 94
      },
      {
        supplier: 'Spedition Schmidt',
        estimatedPrice: 1180,
        transitTime: 28,
        reliability: 0.94,
        aiScore: 91
      },
      {
        supplier: 'Fast Freight Express',
        estimatedPrice: 1320,
        transitTime: 20,
        reliability: 0.92,
        aiScore: 89
      },
      {
        supplier: 'Logistics Pro',
        estimatedPrice: 1150,
        transitTime: 32,
        reliability: 0.90,
        aiScore: 85
      }
    ];

    setEstimatedQuotes(mockQuotes.sort((a, b) => b.aiScore - a.aiScore));
    setLoading(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (type: 'pickup' | 'delivery', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [`${type}Address`]: {
        ...(prev[`${type}Address` as keyof typeof prev] as object || {}),
        [field]: value
      }
    }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...Array.from(files)]
      }));
    }
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.requestType && formData.cargoType !== '' && formData.cargoWeight > 0;
      case 2:
        return formData.pickupAddress.street !== '' && formData.pickupAddress.city !== '' &&
               formData.deliveryAddress.street !== '' && formData.deliveryAddress.city !== '';
      case 3:
        return formData.pickupDate !== '' && formData.deliveryDate !== '';
      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate request number
      const requestNumber = `road-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
      setRequestNumber(requestNumber);
      setShowSuccess(true);
      
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const saveDraft = async () => {
    try {
      // Simulate API call to save draft
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Show success message
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'NORMAL': return 'bg-blue-100 text-blue-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'ROAD': return <Truck className="h-5 w-5" />;
      case 'AIR': return <Package className="h-5 w-5" />;
      case 'SEA': return <Navigation className="h-5 w-5" />;
      case 'RAIL': return <Zap className="h-5 w-5" />;
      default: return <Truck className="h-5 w-5" />;
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-900 mb-2">Request Submitted Successfully!</h2>
              <p className="text-green-700 mb-6">Your transport request has been created and sent to suppliers.</p>
              
              <div className="bg-white rounded-lg p-6 mb-6">
                <h3 className="font-semibold mb-4">Request Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Request Number</p>
                    <p className="font-medium">{requestNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Transport Type</p>
                    <p className="font-medium">{formData.requestType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Cargo Type</p>
                    <p className="font-medium">{formData.cargoType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Priority</p>
                    <Badge className={getPriorityColor(formData.priority)}>
                      {formData.priority}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-gray-700">
                  <strong>Next Steps:</strong>
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Suppliers will be notified automatically</li>
                  <li>• You'll receive quotes within 24 hours</li>
                  <li>• Track progress in your dashboard</li>
                </ul>
              </div>
              
              <div className="flex justify-center space-x-4 mt-8">
                <Button variant="outline" onClick={() => setShowSuccess(false)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Another Request
                </Button>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  View Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Transport Request</h1>
        <p className="text-gray-600">Fill in the details to create your transport request</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-gray-500">
            {currentStep === 1 && 'Cargo Details'}
            {currentStep === 2 && 'Addresses'}
            {currentStep === 3 && 'Timing & Requirements'}
            {currentStep === 4 && 'Review & Submit'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Step 1: Cargo Details */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold mb-4">Cargo Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="transport-type">Transport Type</Label>
                    <Select value={formData.requestType} onValueChange={(value) => handleInputChange('requestType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transport type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ROAD">
                          <div className="flex items-center space-x-2">
                            <Truck className="h-4 w-4" />
                            <span>Road Transport</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="AIR">
                          <div className="flex items-center space-x-2">
                            <Package className="h-4 w-4" />
                            <span>Air Transport</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="SEA">
                          <div className="flex items-center space-x-2">
                            <Navigation className="h-4 w-4" />
                            <span>Sea Transport</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="RAIL">
                          <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4" />
                            <span>Rail Transport</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low Priority</SelectItem>
                        <SelectItem value="NORMAL">Normal Priority</SelectItem>
                        <SelectItem value="HIGH">High Priority</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="cargo-type">Cargo Type</Label>
                    <Select value={formData.cargoType} onValueChange={(value) => handleInputChange('cargoType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cargo type" />
                      </SelectTrigger>
                      <SelectContent>
                        {cargoTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="cargo-weight">Weight (kg)</Label>
                    <Input
                      id="cargo-weight"
                      type="number"
                      placeholder="0"
                      value={formData.cargoWeight || ''}
                      onChange={(e) => handleInputChange('cargoWeight', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cargo-volume">Volume (m³)</Label>
                    <Input
                      id="cargo-volume"
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      value={formData.cargoVolume || ''}
                      onChange={(e) => handleInputChange('cargoVolume', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cargo-value">Value (€)</Label>
                    <Input
                      id="cargo-value"
                      type="number"
                      placeholder="0"
                      value={formData.cargoValue || ''}
                      onChange={(e) => handleInputChange('cargoValue', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="cargo-description">Cargo Description</Label>
                  <Textarea
                    id="cargo-description"
                    placeholder="Describe your cargo in detail..."
                    value={formData.cargoDescription}
                    onChange={(e) => handleInputChange('cargoDescription', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dangerous-goods"
                      checked={formData.isDangerous}
                      onCheckedChange={(checked) => handleInputChange('isDangerous', checked)}
                    />
                    <Label htmlFor="dangerous-goods" className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span>Dangerous Goods</span>
                    </Label>
                  </div>

                  {formData.isDangerous && (
                    <div>
                      <Label htmlFor="dangerous-class">Dangerous Goods Class</Label>
                      <Select value={formData.dangerousClass} onValueChange={(value) => handleInputChange('dangerousClass', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select dangerous goods class" />
                        </SelectTrigger>
                        <SelectContent>
                          {dangerousClasses.map(dClass => (
                            <SelectItem key={dClass} value={dClass}>{dClass}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Addresses */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold mb-4">Pickup & Delivery Addresses</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Pickup Address */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold">Pickup Address</h3>
                    </div>
                    
                    <div>
                      <Label htmlFor="pickup-street">Street Address</Label>
                      <Input
                        id="pickup-street"
                        placeholder="Street address"
                        value={formData.pickupAddress.street}
                        onChange={(e) => handleAddressChange('pickup', 'street', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pickup-city">City</Label>
                        <Input
                          id="pickup-city"
                          placeholder="City"
                          value={formData.pickupAddress.city}
                          onChange={(e) => handleAddressChange('pickup', 'city', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="pickup-postal">Postal Code</Label>
                        <Input
                          id="pickup-postal"
                          placeholder="Postal code"
                          value={formData.pickupAddress.postalCode}
                          onChange={(e) => handleAddressChange('pickup', 'postalCode', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="pickup-country">Country</Label>
                      <Select value={formData.pickupAddress.country} onValueChange={(value) => handleAddressChange('pickup', 'country', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map(country => (
                            <SelectItem key={country} value={country}>{country}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="pickup-contact">Contact Person</Label>
                      <Input
                        id="pickup-contact"
                        placeholder="Contact person"
                        value={formData.pickupAddress.contactPerson}
                        onChange={(e) => handleAddressChange('pickup', 'contactPerson', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="pickup-phone">Contact Phone</Label>
                      <Input
                        id="pickup-phone"
                        placeholder="Phone number"
                        value={formData.pickupAddress.contactPhone}
                        onChange={(e) => handleAddressChange('pickup', 'contactPhone', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Navigation className="h-5 w-5 text-red-600" />
                      <h3 className="font-semibold">Delivery Address</h3>
                    </div>
                    
                    <div>
                      <Label htmlFor="delivery-street">Street Address</Label>
                      <Input
                        id="delivery-street"
                        placeholder="Street address"
                        value={formData.deliveryAddress.street}
                        onChange={(e) => handleAddressChange('delivery', 'street', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="delivery-city">City</Label>
                        <Input
                          id="delivery-city"
                          placeholder="City"
                          value={formData.deliveryAddress.city}
                          onChange={(e) => handleAddressChange('delivery', 'city', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="delivery-postal">Postal Code</Label>
                        <Input
                          id="delivery-postal"
                          placeholder="Postal code"
                          value={formData.deliveryAddress.postalCode}
                          onChange={(e) => handleAddressChange('delivery', 'postalCode', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="delivery-country">Country</Label>
                      <Select value={formData.deliveryAddress.country} onValueChange={(value) => handleAddressChange('delivery', 'country', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map(country => (
                            <SelectItem key={country} value={country}>{country}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="delivery-contact">Contact Person</Label>
                      <Input
                        id="delivery-contact"
                        placeholder="Contact person"
                        value={formData.deliveryAddress.contactPerson}
                        onChange={(e) => handleAddressChange('delivery', 'contactPerson', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="delivery-phone">Contact Phone</Label>
                      <Input
                        id="delivery-phone"
                        placeholder="Phone number"
                        value={formData.deliveryAddress.contactPhone}
                        onChange={(e) => handleAddressChange('delivery', 'contactPhone', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Timing & Requirements */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold mb-4">Timing & Special Requirements</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="pickup-date">Pickup Date</Label>
                    <Input
                      id="pickup-date"
                      type="datetime-local"
                      value={formData.pickupDate}
                      onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="delivery-date">Delivery Date</Label>
                    <Input
                      id="delivery-date"
                      type="datetime-local"
                      value={formData.deliveryDate}
                      onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="flexible-timing"
                    checked={formData.flexibleTiming}
                    onCheckedChange={(checked) => handleInputChange('flexibleTiming', checked)}
                  />
                  <Label htmlFor="flexible-timing" className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>Flexible timing (±2 hours)</span>
                  </Label>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="temperature-controlled"
                      checked={formData.temperatureControlled}
                      onCheckedChange={(checked) => handleInputChange('temperatureControlled', checked)}
                    />
                    <Label htmlFor="temperature-controlled" className="flex items-center space-x-2">
                      <Thermometer className="h-4 w-4 text-blue-500" />
                      <span>Temperature Controlled</span>
                    </Label>
                  </div>

                  {formData.temperatureControlled && (
                    <div className="grid grid-cols-2 gap-4 ml-6">
                      <div>
                        <Label htmlFor="temp-min">Min Temperature (°C)</Label>
                        <Input
                          id="temp-min"
                          type="number"
                          placeholder="0"
                          value={formData.temperatureMin || ''}
                          onChange={(e) => handleInputChange('temperatureMin', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="temp-max">Max Temperature (°C)</Label>
                        <Input
                          id="temp-max"
                          type="number"
                          placeholder="0"
                          value={formData.temperatureMax || ''}
                          onChange={(e) => handleInputChange('temperatureMax', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requires-insurance"
                    checked={formData.requiresInsurance}
                    onCheckedChange={(checked) => handleInputChange('requiresInsurance', checked)}
                  />
                  <Label htmlFor="requires-insurance" className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Requires Insurance</span>
                  </Label>
                </div>

                <div>
                  <Label htmlFor="special-instructions">Special Instructions</Label>
                  <Textarea
                    id="special-instructions"
                    placeholder="Any special handling instructions..."
                    value={formData.specialInstructions}
                    onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="documents">Documents</Label>
                  <div className="mt-2">
                    <input
                      id="documents"
                      type="file"
                      multiple
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('documents')?.click()}
                      className="mb-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Documents
                    </Button>
                    
                    {formData.documents.length > 0 && (
                      <div className="space-y-2">
                        {formData.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{doc.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDocument(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold mb-4">Review & Submit</h2>
                
                {/* Request Summary */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold mb-4">Request Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Transport Type</p>
                      <div className="flex items-center space-x-2">
                        {getTransportIcon(formData.requestType)}
                        <span className="font-medium">{formData.requestType}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600">Priority</p>
                      <Badge className={getPriorityColor(formData.priority)}>
                        {formData.priority}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-gray-600">Cargo Type</p>
                      <p className="font-medium">{formData.cargoType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Weight</p>
                      <p className="font-medium">{formData.cargoWeight} kg</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Pickup</p>
                      <p className="font-medium">{formData.pickupAddress.city}, {formData.pickupAddress.country}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Delivery</p>
                      <p className="font-medium">{formData.deliveryAddress.city}, {formData.deliveryAddress.country}</p>
                    </div>
                  </div>
                </div>

                {/* Estimated Quotes */}
                <div>
                  <h3 className="font-semibold mb-4">Estimated Quotes</h3>
                  
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Calculating estimates...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {estimatedQuotes.map((quote, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium">{quote.supplier}</p>
                              <p className="text-sm text-gray-500">{quote.transitTime}h transit • {Math.round(quote.reliability * 100)}% reliability</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold">€{quote.estimatedPrice.toLocaleString()}</p>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm font-medium">{quote.aiScore}/100</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="flex items-center space-x-2">
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
              <Button variant="outline" onClick={saveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              {currentStep < totalSteps ? (
                <Button onClick={nextStep} disabled={!validateStep(currentStep)}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
