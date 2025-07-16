
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  FileText, 
  Clock, 
  Euro, 
  Upload, 
  Download, 
  Send, 
  Edit, 
  Eye,
  AlertTriangle,
  CheckCircle,
  Timer,
  Target,
  Award,
  BarChart3,
  TrendingUp,
  Calendar,
  User,
  Building,
  Truck,
  Package,
  MapPin,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Trash2,
  Save,
  X,
  Info,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TenderRequirement {
  id: string;
  requirement: string;
  mandatory: boolean;
  fulfilled: boolean;
  notes?: string;
}

interface BidSubmission {
  id: string;
  tenderId: string;
  tenderTitle: string;
  tenderNumber: string;
  proposedPrice: number;
  currency: string;
  transitTime: number;
  validUntil: Date;
  technicalProposal: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'WINNING' | 'REJECTED';
  submittedAt?: Date;
  deadline: Date;
  requirements: TenderRequirement[];
  aiScore: number;
  competitivePosition: 'LEADING' | 'COMPETITIVE' | 'BEHIND';
}

interface TenderDetails {
  id: string;
  title: string;
  tenderNumber: string;
  description: string;
  estimatedValue: number;
  currency: string;
  deadline: Date;
  requirements: TenderRequirement[];
  transportType: string;
  cargoType: string;
  pickupLocation: string;
  deliveryLocation: string;
  specialInstructions?: string;
  contactPerson: string;
  contactEmail: string;
  documents: string[];
}

export function SupplierBidManager() {
  const [bids, setBids] = useState<BidSubmission[]>([]);
  const [selectedTender, setSelectedTender] = useState<TenderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showBidForm, setShowBidForm] = useState(false);
  const [currentBid, setCurrentBid] = useState<Partial<BidSubmission>>({});

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockBids: BidSubmission[] = [
        {
          id: 'bid-001',
          tenderId: 'tender-001',
          tenderTitle: 'Regional Transport Services Q2',
          tenderNumber: 'TEN-2025-0045',
          proposedPrice: 425000,
          currency: 'EUR',
          transitTime: 48,
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          technicalProposal: 'Comprehensive transport solution with dedicated fleet and real-time tracking.',
          status: 'SUBMITTED',
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          requirements: [
            { id: 'req-1', requirement: 'ISO 9001 Certification', mandatory: true, fulfilled: true },
            { id: 'req-2', requirement: 'SQAS Certificate', mandatory: true, fulfilled: true },
            { id: 'req-3', requirement: 'ADR License', mandatory: false, fulfilled: true }
          ],
          aiScore: 87,
          competitivePosition: 'LEADING'
        },
        {
          id: 'bid-002',
          tenderId: 'tender-002',
          tenderTitle: 'Automotive Parts Distribution',
          tenderNumber: 'TEN-2025-0046',
          proposedPrice: 118000,
          currency: 'EUR',
          transitTime: 24,
          validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          technicalProposal: 'Specialized automotive parts handling with temperature-controlled vehicles.',
          status: 'UNDER_REVIEW',
          submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          requirements: [
            { id: 'req-1', requirement: 'Temperature Control', mandatory: true, fulfilled: true },
            { id: 'req-2', requirement: 'GPS Tracking', mandatory: true, fulfilled: true }
          ],
          aiScore: 92,
          competitivePosition: 'COMPETITIVE'
        },
        {
          id: 'bid-003',
          tenderId: 'tender-003',
          tenderTitle: 'Pharmaceutical Cold Chain',
          tenderNumber: 'TEN-2025-0047',
          proposedPrice: 750000,
          currency: 'EUR',
          transitTime: 72,
          validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          technicalProposal: 'GDP-compliant cold chain solution with validated temperature monitoring.',
          status: 'DRAFT',
          deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
          requirements: [
            { id: 'req-1', requirement: 'GDP Certification', mandatory: true, fulfilled: true },
            { id: 'req-2', requirement: 'Validated Cold Chain', mandatory: true, fulfilled: true },
            { id: 'req-3', requirement: 'Pharmaceutical Experience', mandatory: false, fulfilled: true }
          ],
          aiScore: 94,
          competitivePosition: 'LEADING'
        }
      ];

      setBids(mockBids);
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBid = async (bidId: string) => {
    try {
      setSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setBids(prev => prev.map(bid => 
        bid.id === bidId 
          ? { ...bid, status: 'SUBMITTED', submittedAt: new Date() }
          : bid
      ));
      
      setShowBidForm(false);
      setCurrentBid({});
    } catch (error) {
      console.error('Error submitting bid:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = async (bidData: Partial<BidSubmission>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (bidData.id) {
        setBids(prev => prev.map(bid => 
          bid.id === bidData.id ? { ...bid, ...bidData } : bid
        ));
      } else {
        const newBid: BidSubmission = {
          id: `bid-${Date.now()}`,
          tenderId: bidData.tenderId || '',
          tenderTitle: bidData.tenderTitle || '',
          tenderNumber: bidData.tenderNumber || '',
          proposedPrice: bidData.proposedPrice || 0,
          currency: bidData.currency || 'EUR',
          transitTime: bidData.transitTime || 24,
          validUntil: bidData.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          technicalProposal: bidData.technicalProposal || '',
          status: 'DRAFT',
          deadline: bidData.deadline || new Date(),
          requirements: bidData.requirements || [],
          aiScore: 0,
          competitivePosition: 'COMPETITIVE'
        };
        setBids(prev => [...prev, newBid]);
      }
      
      setShowBidForm(false);
      setCurrentBid({});
    } catch (error) {
      console.error('Error saving bid:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800';
      case 'UNDER_REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'WINNING': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompetitiveColor = (position: string) => {
    switch (position) {
      case 'LEADING': return 'text-green-600';
      case 'COMPETITIVE': return 'text-yellow-600';
      case 'BEHIND': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getUrgencyColor = (deadline: Date) => {
    const hoursLeft = (deadline.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursLeft <= 24) return 'text-red-600';
    if (hoursLeft <= 48) return 'text-orange-600';
    return 'text-green-600';
  };

  const filteredBids = bids.filter(bid => {
    const matchesSearch = bid.tenderTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bid.tenderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || bid.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bid manager...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bid Manager</h2>
          <p className="text-gray-600">Manage your tender bids and submissions</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={() => setShowBidForm(true)} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Bid
          </Button>
          <Button onClick={fetchBids} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bids</p>
                <p className="text-2xl font-bold">{bids.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Submitted</p>
                <p className="text-2xl font-bold">{bids.filter(b => b.status === 'SUBMITTED' || b.status === 'UNDER_REVIEW').length}</p>
              </div>
              <Send className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Winning</p>
                <p className="text-2xl font-bold">{bids.filter(b => b.status === 'WINNING').length}</p>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg AI Score</p>
                <p className="text-2xl font-bold">
                  {bids.length > 0 ? Math.round(bids.reduce((sum, b) => sum + b.aiScore, 0) / bids.length) : 0}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search bids..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="SUBMITTED">Submitted</SelectItem>
            <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
            <SelectItem value="WINNING">Winning</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bids List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredBids.map((bid) => (
          <motion.div
            key={bid.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <CardTitle className="text-lg">{bid.tenderTitle}</CardTitle>
                      <Badge className={getStatusColor(bid.status)}>
                        {bid.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>{bid.tenderNumber}</span>
                      <span>•</span>
                      <span className={getUrgencyColor(bid.deadline)}>
                        <Clock className="inline h-4 w-4 mr-1" />
                        {Math.ceil((bid.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                      </span>
                      <span>•</span>
                      <span className={getCompetitiveColor(bid.competitivePosition)}>
                        <Target className="inline h-4 w-4 mr-1" />
                        {bid.competitivePosition}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">AI Score</p>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{bid.aiScore}/100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Bid Details */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Proposed Price</p>
                      <p className="text-lg font-semibold">€{bid.proposedPrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Transit Time</p>
                      <p className="text-lg font-semibold">{bid.transitTime}h</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Valid Until</p>
                      <p className="text-lg font-semibold">{bid.validUntil.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Deadline</p>
                      <p className={`text-lg font-semibold ${getUrgencyColor(bid.deadline)}`}>
                        {bid.deadline.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Requirements</p>
                    <div className="flex flex-wrap gap-2">
                      {bid.requirements.map((req) => (
                        <Badge 
                          key={req.id} 
                          variant={req.fulfilled ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {req.fulfilled ? <CheckCircle className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                          {req.requirement}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Technical Proposal Preview */}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Technical Proposal</p>
                    <p className="text-sm text-gray-800 line-clamp-2">{bid.technicalProposal}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {bid.status === 'DRAFT' && (
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {bid.status === 'DRAFT' && (
                        <>
                          <Button variant="outline" size="sm">
                            <Save className="h-4 w-4 mr-2" />
                            Save Draft
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleSubmitBid(bid.id)}
                            disabled={submitting}
                          >
                            {submitting ? (
                              <>
                                <Timer className="h-4 w-4 mr-2 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Submit Bid
                              </>
                            )}
                          </Button>
                        </>
                      )}
                      {bid.status === 'SUBMITTED' && (
                        <Badge variant="outline" className="text-blue-600">
                          <Timer className="h-3 w-3 mr-1" />
                          Awaiting Review
                        </Badge>
                      )}
                      {bid.status === 'WINNING' && (
                        <Badge className="bg-green-100 text-green-800">
                          <Award className="h-3 w-3 mr-1" />
                          Winning Bid
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredBids.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No bids found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
          <Button onClick={() => setShowBidForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Bid
          </Button>
        </div>
      )}

      {/* Bid Form Modal */}
      {showBidForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Create New Bid</h3>
              <Button variant="outline" onClick={() => setShowBidForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tender-title">Tender Title</Label>
                  <Input
                    id="tender-title"
                    placeholder="Enter tender title"
                    value={currentBid.tenderTitle || ''}
                    onChange={(e) => setCurrentBid(prev => ({ ...prev, tenderTitle: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="tender-number">Tender Number</Label>
                  <Input
                    id="tender-number"
                    placeholder="TEN-2025-XXXX"
                    value={currentBid.tenderNumber || ''}
                    onChange={(e) => setCurrentBid(prev => ({ ...prev, tenderNumber: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="proposed-price">Proposed Price (€)</Label>
                  <Input
                    id="proposed-price"
                    type="number"
                    placeholder="0"
                    value={currentBid.proposedPrice || ''}
                    onChange={(e) => setCurrentBid(prev => ({ ...prev, proposedPrice: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="transit-time">Transit Time (hours)</Label>
                  <Input
                    id="transit-time"
                    type="number"
                    placeholder="24"
                    value={currentBid.transitTime || ''}
                    onChange={(e) => setCurrentBid(prev => ({ ...prev, transitTime: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="technical-proposal">Technical Proposal</Label>
                <Textarea
                  id="technical-proposal"
                  placeholder="Describe your technical approach and solution..."
                  rows={4}
                  value={currentBid.technicalProposal || ''}
                  onChange={(e) => setCurrentBid(prev => ({ ...prev, technicalProposal: e.target.value }))}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button variant="outline" onClick={() => setShowBidForm(false)}>
                  Cancel
                </Button>
                <Button variant="outline" onClick={() => handleSaveDraft(currentBid)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button onClick={() => handleSubmitBid(currentBid.id || '')}>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Bid
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
