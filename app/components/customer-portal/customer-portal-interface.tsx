
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MessageCircle, 
  Download, 
  FileText,
  Bell,
  Settings,
  User,
  CreditCard,
  BarChart3,
  HelpCircle,
  Send,
  Paperclip,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Bot,
  Sparkles
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface CustomerData {
  customer: {
    id: string
    companyName: string
    firstName: string
    lastName: string
    email: string
    customerTier: string
  }
  portalAccount: {
    id: string
    accessLevel: string
    preferredLanguage: string
    lastLoginAt: string
  }
}

interface Ticket {
  id: string
  ticketNumber: string
  subject: string
  status: string
  priority: string
  category: string
  createdAt: string
  messageCount: number
  lastMessage: any
}

interface Download {
  id: string
  fileName: string
  resourceType: string
  downloadCount: number
  lastDownloadAt: string
  fileUrl: string
}

export default function CustomerPortalInterface() {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [downloads, setDownloads] = useState<Download[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  
  // New ticket form
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: 'GENERAL',
    priority: 'MEDIUM'
  })
  const [submittingTicket, setSubmittingTicket] = useState(false)

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      id: '1',
      type: 'ai',
      message: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date().toISOString()
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  useEffect(() => {
    // Initialize customer portal
    initializePortal()
  }, [])

  const initializePortal = async () => {
    try {
      // In a real implementation, this would validate the customer token
      // For demo, we'll simulate customer data
      setCustomerData({
        customer: {
          id: '1',
          companyName: 'TechCorp Solutions',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@techcorp.com',
          customerTier: 'PREMIUM'
        },
        portalAccount: {
          id: '1',
          accessLevel: 'STANDARD',
          preferredLanguage: 'en',
          lastLoginAt: new Date().toISOString()
        }
      })

      // Fetch tickets and downloads
      await Promise.all([
        fetchTickets(),
        fetchDownloads()
      ])

      setLoading(false)
    } catch (error) {
      console.error('Error initializing portal:', error)
      setLoading(false)
    }
  }

  const fetchTickets = async () => {
    try {
      // Simulate tickets data
      setTickets([
        {
          id: '1',
          ticketNumber: 'TICKET-2024-000001',
          subject: 'Integration Support Needed',
          status: 'OPEN',
          priority: 'HIGH',
          category: 'TECHNICAL_SUPPORT',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          messageCount: 3,
          lastMessage: {
            message: 'We will need to schedule a call to discuss this further.',
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
          }
        },
        {
          id: '2',
          ticketNumber: 'TICKET-2024-000002',
          subject: 'Billing Question',
          status: 'RESOLVED',
          priority: 'MEDIUM',
          category: 'BILLING',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          messageCount: 2,
          lastMessage: {
            message: 'Thank you for the clarification. This has been resolved.',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        }
      ])
    } catch (error) {
      console.error('Error fetching tickets:', error)
    }
  }

  const fetchDownloads = async () => {
    try {
      // Simulate downloads data
      setDownloads([
        {
          id: '1',
          fileName: 'Invoice_2024_Q1.pdf',
          resourceType: 'INVOICE',
          downloadCount: 3,
          lastDownloadAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          fileUrl: '/api/download/invoice-q1-2024'
        },
        {
          id: '2',
          fileName: 'Integration_Guide.pdf',
          resourceType: 'DOCUMENT',
          downloadCount: 1,
          lastDownloadAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          fileUrl: '/api/download/integration-guide'
        }
      ])
    } catch (error) {
      console.error('Error fetching downloads:', error)
    }
  }

  const submitTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmittingTicket(true)
    try {
      // Simulate ticket submission
      await new Promise(resolve => setTimeout(resolve, 1500))

      const ticket: Ticket = {
        id: Math.random().toString(),
        ticketNumber: `TICKET-2024-${String(tickets.length + 1).padStart(6, '0')}`,
        subject: newTicket.subject,
        status: 'OPEN',
        priority: newTicket.priority,
        category: newTicket.category,
        createdAt: new Date().toISOString(),
        messageCount: 1,
        lastMessage: {
          message: newTicket.description,
          createdAt: new Date().toISOString()
        }
      }

      setTickets(prev => [ticket, ...prev])
      setNewTicket({ subject: '', description: '', category: 'GENERAL', priority: 'MEDIUM' })
      toast.success('Support ticket created successfully!')
      setActiveTab('support')
    } catch (error) {
      console.error('Error creating ticket:', error)
      toast.error('Failed to create ticket')
    } finally {
      setSubmittingTicket(false)
    }
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return

    const userMessage = {
      id: Math.random().toString(),
      type: 'user',
      message: chatInput,
      timestamp: new Date().toISOString()
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setChatLoading(true)

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1500))

      const aiMessage = {
        id: Math.random().toString(),
        type: 'ai',
        message: 'I understand you need help with that. Let me connect you with the right resources or escalate to our support team if needed.',
        timestamp: new Date().toISOString()
      }

      setChatMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending chat message:', error)
    } finally {
      setChatLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN': return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'IN_PROGRESS': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'RESOLVED': return <CheckCircle className="w-4 h-4 text-green-500" />
      default: return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600 bg-red-50'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50'
      case 'LOW': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (loading) {
    return <CustomerPortalSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {customerData?.customer.companyName}
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {customerData?.customer.firstName}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                {customerData?.customer.customerTier}
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
            <TabsTrigger value="chat">AI Assistant</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Open Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {tickets.filter(t => t.status === 'OPEN').length}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Active support requests</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Downloads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {downloads.length}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Available resources</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Account Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">Active</div>
                  <p className="text-xs text-gray-600 mt-1">Premium tier</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest interactions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tickets.slice(0, 3).map((ticket) => (
                    <div key={ticket.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      {getStatusIcon(ticket.status)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{ticket.subject}</span>
                          <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {ticket.ticketNumber} • {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            {/* Create New Ticket */}
            <Card>
              <CardHeader>
                <CardTitle>Create Support Ticket</CardTitle>
                <CardDescription>Get help from our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                      placeholder="Brief description of your issue"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newTicket.category} onValueChange={(value) => setNewTicket({...newTicket, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GENERAL">General</SelectItem>
                        <SelectItem value="TECHNICAL_SUPPORT">Technical Support</SelectItem>
                        <SelectItem value="BILLING">Billing</SelectItem>
                        <SelectItem value="ACCOUNT">Account</SelectItem>
                        <SelectItem value="FEATURE_REQUEST">Feature Request</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                    placeholder="Detailed description of your issue..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({...newTicket, priority: value})}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={submitTicket} disabled={submittingTicket}>
                  {submittingTicket ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Create Ticket
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Existing Tickets */}
            <Card>
              <CardHeader>
                <CardTitle>Your Support Tickets</CardTitle>
                <CardDescription>Track the status of your support requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {getStatusIcon(ticket.status)}
                            <h3 className="font-medium">{ticket.subject}</h3>
                            <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                            <Badge variant="outline">
                              {ticket.category.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            {ticket.ticketNumber} • Created {new Date(ticket.createdAt).toLocaleDateString()}
                          </div>
                          
                          {ticket.lastMessage && (
                            <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                              Latest: {ticket.lastMessage.message}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {ticket.messageCount} messages
                          </span>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="downloads" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Downloads</CardTitle>
                <CardDescription>Access your documents and resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {downloads.map((download) => (
                    <div key={download.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{download.fileName}</h3>
                          <div className="text-sm text-gray-600">
                            {download.resourceType} • Downloaded {download.downloadCount} times
                          </div>
                          <div className="text-xs text-gray-500">
                            Last downloaded {new Date(download.lastDownloadAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <Card className="h-96">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="w-5 h-5 mr-2 text-purple-600" />
                  AI Assistant
                </CardTitle>
                <CardDescription>Get instant help with our AI-powered assistant</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {chatMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        {message.type === 'ai' && (
                          <div className="flex items-center mb-1">
                            <Sparkles className="w-3 h-3 mr-1" />
                            <span className="text-xs font-medium">AI Assistant</span>
                          </div>
                        )}
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>
                  ))}
                  
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-4 py-2 rounded-lg">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  />
                  <Button onClick={sendChatMessage} disabled={chatLoading || !chatInput.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Manage your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Company Name</Label>
                    <Input value={customerData?.customer.companyName} disabled />
                  </div>
                  
                  <div>
                    <Label>Customer Tier</Label>
                    <Input value={customerData?.customer.customerTier} disabled />
                  </div>
                  
                  <div>
                    <Label>Email</Label>
                    <Input value={customerData?.customer.email} disabled />
                  </div>
                  
                  <div>
                    <Label>Access Level</Label>
                    <Input value={customerData?.portalAccount.accessLevel} disabled />
                  </div>
                </div>
                
                <div>
                  <Label>Last Login</Label>
                  <Input 
                    value={new Date(customerData?.portalAccount.lastLoginAt || '').toLocaleString()} 
                    disabled 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function CustomerPortalSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div>
                <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mt-2 animate-pulse"></div>
              </div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </div>
  )
}
