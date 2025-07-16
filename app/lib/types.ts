export type Expense = {
  id: string
  amount: number
  category: string
  description: string
  date: Date
}

export type ExpenseFormData = Omit<Expense, 'id' | 'date'> & {
  date: string
}

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Other'
] as const

export type DateRange = {
  from: Date | undefined
  to: Date | undefined
}

// ===== SPRINT 3: WECREATE MODULE TYPES =====

export type CreativeProject = {
  id: string
  title: string
  description?: string
  projectType: CreativeProjectType
  status: ProjectStatus
  aiPrompt?: string
  aiConfidenceScore?: number
  aiSentimentScore?: number
  aiComplexityScore?: number
  aiRecommendations?: any[]
  isCollaborative: boolean
  maxCollaborators?: number
  currentCollaborators?: number
  workflowStage?: string
  deadlineDate?: Date
  tenantId: string
  createdBy: string
  assignedTo?: string
  tags: string[]
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export type CreativeAsset = {
  id: string
  projectId: string
  title: string
  description?: string
  assetType: AssetType
  fileUrl?: string
  fileSize?: number
  fileMimeType?: string
  thumbnailUrl?: string
  aiGeneratedPrompt?: string
  aiConfidenceScore?: number
  aiTags: string[]
  aiDescription?: string
  aiQualityScore?: number
  aiStyleAnalysis?: any
  contentHash?: string
  colorPalette?: any[]
  dominantColors: string[]
  textContent?: string
  viewCount: number
  downloadCount: number
  usageContext?: any[]
  performanceMetrics?: any
  tenantId: string
  createdBy: string
  isPublic: boolean
  licenseType?: string
  expiryDate?: Date
  createdAt: Date
  updatedAt: Date
}

export type ContentTemplate = {
  id: string
  title: string
  description?: string
  category: TemplateCategory
  templateType: string
  templateData: any
  previewUrl?: string
  thumbnailUrl?: string
  aiOptimized: boolean
  aiPerformanceScore?: number
  aiSuitabilityTags: string[]
  aiRecommendedUse?: any[]
  usageCount: number
  averageRating?: number
  isPopular: boolean
  tenantId: string
  createdBy: string
  isPublic: boolean
  isPremium: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export type InteractiveStory = {
  id: string
  projectId: string
  title: string
  description?: string
  storyType: StoryType
  storyData: any
  currentVersion: string
  isPublished: boolean
  publicUrl?: string
  aiNarrativeScore?: number
  aiEngagementPrediction?: number
  aiOptimizations?: any[]
  viewCount: number
  completionRate?: number
  averageEngagementTime?: number
  tenantId: string
  createdBy: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export enum CreativeProjectType {
  GENERAL = 'GENERAL',
  MARKETING_CAMPAIGN = 'MARKETING_CAMPAIGN',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  PRESENTATION = 'PRESENTATION',
  VIDEO_CONTENT = 'VIDEO_CONTENT',
  GRAPHIC_DESIGN = 'GRAPHIC_DESIGN',
  BRAND_IDENTITY = 'BRAND_IDENTITY',
  INTERACTIVE_STORY = 'INTERACTIVE_STORY',
  AI_AVATAR_CREATION = 'AI_AVATAR_CREATION'
}

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
  CANCELLED = 'CANCELLED'
}

export enum AssetType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
  TEMPLATE = 'TEMPLATE',
  AVATAR = 'AVATAR',
  LOGO = 'LOGO',
  ICON = 'ICON',
  FONT = 'FONT',
  COLOR_PALETTE = 'COLOR_PALETTE',
  DESIGN_SYSTEM = 'DESIGN_SYSTEM'
}

export enum TemplateCategory {
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  MARKETING = 'MARKETING',
  PRESENTATION = 'PRESENTATION',
  EMAIL = 'EMAIL',
  DOCUMENT = 'DOCUMENT',
  GRAPHIC_DESIGN = 'GRAPHIC_DESIGN',
  VIDEO = 'VIDEO',
  AVATAR = 'AVATAR',
  BRAND_KIT = 'BRAND_KIT'
}

export enum StoryType {
  LINEAR = 'LINEAR',
  BRANCHING = 'BRANCHING',
  INTERACTIVE_PRESENTATION = 'INTERACTIVE_PRESENTATION',
  WORKSHOP_GUIDE = 'WORKSHOP_GUIDE',
  CUSTOMER_JOURNEY = 'CUSTOMER_JOURNEY',
  PRODUCT_DEMO = 'PRODUCT_DEMO'
}

export enum CollaborationRole {
  VIEWER = 'VIEWER',
  CONTRIBUTOR = 'CONTRIBUTOR',
  EDITOR = 'EDITOR',
  MANAGER = 'MANAGER',
  OWNER = 'OWNER'
}

// ===== SPRINT 3: WESELL MODULE TYPES =====

export type Customer = {
  id: string
  customerNumber: string
  companyName?: string
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  website?: string
  billingAddress?: any
  shippingAddress?: any
  industry?: string
  companySize?: CompanySize
  annualRevenue?: number
  customerType: CustomerType
  customerTier: CustomerTier
  lifecycleStage?: string
  aiLifetimeValue?: number
  aiChurnProbability?: number
  aiCrossSellScore?: number
  aiUpsellPotential?: number
  aiEngagementScore?: number
  aiSentimentScore?: number
  aiNextBestAction?: string
  firstContactDate?: Date
  lastContactDate?: Date
  totalOrderValue?: number
  totalOrders: number
  averageOrderValue?: number
  tenantId: string
  assignedSalesRep?: string
  source?: string
  tags: string[]
  notes?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type Lead = {
  id: string
  customerId: string
  leadSource?: string
  status: LeadStatus
  qualificationScore?: number
  budgetRange?: string
  timeframe?: string
  decisionMaker?: boolean
  aiQualificationScore?: number
  aiConversionProbability?: number
  aiPriorityScore?: number
  aiRecommendedActions?: any[]
  aiNextContactDate?: Date
  lastContactDate?: Date
  nextFollowUpDate?: Date
  contactAttempts: number
  tenantId: string
  assignedTo?: string
  notes?: string
  createdBy: string
  convertedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export type SalesOpportunity = {
  id: string
  customerId: string
  opportunityName: string
  description?: string
  stage: OpportunityStage
  estimatedValue?: number
  estimatedCloseDate?: Date
  actualCloseDate?: Date
  probability?: number
  aiCloseProbability?: number
  aiRevenuePrediktion?: number
  aiRiskFactors?: any[]
  aiRecommendations?: any[]
  aiCompetitorAnalysis?: any
  competitorInfo?: any
  decisionCriteria?: any[]
  keyStakeholders?: any[]
  tenantId: string
  assignedTo: string
  createdBy: string
  source?: string
  tags: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type SalesProposal = {
  id: string
  opportunityId: string
  proposalNumber: string
  title: string
  description?: string
  aiGeneratedContent: boolean
  aiPrompt?: string
  aiConfidenceScore?: number
  aiPersonalizationScore?: number
  proposalData: any
  totalValue?: number
  validUntil?: Date
  documentUrl?: string
  templateUsed?: string
  status: ProposalStatus
  sentAt?: Date
  viewedAt?: Date
  acceptedAt?: Date
  rejectedAt?: Date
  viewCount: number
  timeSpentViewing: number
  tenantId: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export enum CompanySize {
  UNKNOWN = 'UNKNOWN',
  MICRO = 'MICRO',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  ENTERPRISE = 'ENTERPRISE'
}

export enum CustomerType {
  PROSPECT = 'PROSPECT',
  LEAD = 'LEAD',
  ACTIVE_CUSTOMER = 'ACTIVE_CUSTOMER',
  INACTIVE_CUSTOMER = 'INACTIVE_CUSTOMER',
  VIP_CUSTOMER = 'VIP_CUSTOMER',
  PARTNER = 'PARTNER',
  VENDOR = 'VENDOR'
}

export enum CustomerTier {
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  VIP = 'VIP',
  ENTERPRISE = 'ENTERPRISE'
}

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  PROPOSAL_SENT = 'PROPOSAL_SENT',
  NEGOTIATION = 'NEGOTIATION',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST',
  DISQUALIFIED = 'DISQUALIFIED'
}

export enum OpportunityStage {
  DISCOVERY = 'DISCOVERY',
  QUALIFICATION = 'QUALIFICATION',
  PROPOSAL = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST'
}

export enum ProposalStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  SENT = 'SENT',
  VIEWED = 'VIEWED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

// Form Types for UI Components
export type CreateProjectForm = {
  title: string
  description?: string
  projectType: CreativeProjectType
  isCollaborative: boolean
  maxCollaborators?: number
  deadlineDate?: string
  tags: string[]
}

export type GenerateContentForm = {
  prompt: string
  assetType: AssetType
  style?: string
  mood?: string
  targetAudience?: string
  additionalInstructions?: string
}

export type CreateCustomerForm = {
  companyName?: string
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  website?: string
  industry?: string
  companySize?: CompanySize
  customerType: CustomerType
  customerTier: CustomerTier
  source?: string
  tags: string[]
  notes?: string
}

export type CreateLeadForm = {
  customerId: string
  leadSource?: string
  qualificationScore?: number
  budgetRange?: string
  timeframe?: string
  decisionMaker?: boolean
  notes?: string
}

export type CreateOpportunityForm = {
  customerId: string
  opportunityName: string
  description?: string
  stage: OpportunityStage
  estimatedValue?: number
  estimatedCloseDate?: string
  probability?: number
  tags: string[]
}

// ===== SPRINT 4: ADVANCED AI ENGINE & ENTERPRISE TYPES =====

// ===== AI ENGINE TYPES =====

export type AIModel = {
  id: string
  name: string
  description?: string
  modelType: AIModelType
  version: string
  status: ModelStatus
  modelConfig: any
  trainingData?: any
  hyperparameters?: any
  accuracy?: number
  precision?: number
  recall?: number
  f1Score?: number
  confidenceThreshold?: number
  deploymentEndpoint?: string
  deploymentStatus: DeploymentStatus
  lastTrainedAt?: Date
  lastDeployedAt?: Date
  nextRetrainingDate?: Date
  predictionCount: number
  averageResponseTime?: number
  lastUsedAt?: Date
  tenantId: string
  createdBy: string
  isActive: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export type AIDecision = {
  id: string
  modelId: string
  decisionType: DecisionType
  context: any
  inputData: any
  outputData: any
  confidenceScore: number
  decisionReasoning?: string
  alternativeOptions?: any[]
  riskAssessment?: any
  status: DecisionStatus
  executedAt?: Date
  reviewedAt?: Date
  reviewedBy?: string
  requiresHumanReview: boolean
  humanApprovalRequired: boolean
  humanFeedback?: string
  outcomeRating?: number
  tenantId: string
  moduleSource: string
  affectedEntity?: string
  createdAt: Date
  updatedAt: Date
}

export type AIOrchestrator = {
  id: string
  name: string
  description?: string
  orchestrationRules: any[]
  enabledModules: ModuleType[]
  eventTriggers: any[]
  workflowDefinition: any
  executionCount: number
  successRate: number
  averageExecutionTime: number
  lastExecutedAt?: Date
  isActive: boolean
  priority: OrchestratorPriority
  retryPolicy: any
  timeoutSettings: any
  tenantId: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export enum AIModelType {
  CUSTOMER_BEHAVIOR_PREDICTION = 'CUSTOMER_BEHAVIOR_PREDICTION',
  RESOURCE_OPTIMIZATION = 'RESOURCE_OPTIMIZATION',
  ANOMALY_DETECTION = 'ANOMALY_DETECTION',
  DYNAMIC_PRICING = 'DYNAMIC_PRICING',
  CONTENT_PERSONALIZATION = 'CONTENT_PERSONALIZATION',
  PROCESS_AUTOMATION = 'PROCESS_AUTOMATION',
  QUALITY_ASSURANCE = 'QUALITY_ASSURANCE',
  PERFORMANCE_FORECASTING = 'PERFORMANCE_FORECASTING',
  CHURN_PREDICTION = 'CHURN_PREDICTION',
  LEAD_SCORING = 'LEAD_SCORING',
  FRAUD_DETECTION = 'FRAUD_DETECTION',
  DEMAND_FORECASTING = 'DEMAND_FORECASTING'
}

export enum ModelStatus {
  TRAINING = 'TRAINING',
  READY = 'READY',
  DEPLOYED = 'DEPLOYED',
  DEPRECATED = 'DEPRECATED',
  ERROR = 'ERROR',
  MAINTENANCE = 'MAINTENANCE'
}

export enum DeploymentStatus {
  NOT_DEPLOYED = 'NOT_DEPLOYED',
  DEPLOYING = 'DEPLOYING',
  DEPLOYED = 'DEPLOYED',
  FAILED = 'FAILED',
  UPDATING = 'UPDATING',
  ROLLING_BACK = 'ROLLING_BACK'
}

export enum DecisionType {
  APPROVE_PAYMENT = 'APPROVE_PAYMENT',
  VALIDATE_INVOICE = 'VALIDATE_INVOICE',
  ALLOCATE_RESOURCES = 'ALLOCATE_RESOURCES',
  SCHEDULE_DELIVERY = 'SCHEDULE_DELIVERY',
  ASSIGN_TASK = 'ASSIGN_TASK',
  ESCALATE_ISSUE = 'ESCALATE_ISSUE',
  RECOMMEND_ACTION = 'RECOMMEND_ACTION',
  OPTIMIZE_ROUTE = 'OPTIMIZE_ROUTE',
  PREDICT_DEMAND = 'PREDICT_DEMAND',
  CLASSIFY_DOCUMENT = 'CLASSIFY_DOCUMENT',
  PERSONALIZE_CONTENT = 'PERSONALIZE_CONTENT',
  AUTOMATE_WORKFLOW = 'AUTOMATE_WORKFLOW'
}

export enum DecisionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  EXECUTED = 'EXECUTED',
  REJECTED = 'REJECTED',
  FAILED = 'FAILED',
  ROLLED_BACK = 'ROLLED_BACK',
  UNDER_REVIEW = 'UNDER_REVIEW'
}

export enum OrchestratorPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum OrchestrationStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  TIMEOUT = 'TIMEOUT'
}

// ===== API MANAGEMENT TYPES =====

export type APIEndpoint = {
  id: string
  name: string
  path: string
  method: HTTPMethod
  description?: string
  isPublic: boolean
  requiresAuth: boolean
  rateLimitRpm?: number
  rateLimitRph?: number
  requestSchema?: any
  responseSchema?: any
  exampleRequest?: any
  exampleResponse?: any
  averageResponseTime?: number
  successRate?: number
  totalRequests: number
  errorCount: number
  version: string
  isDeprecated: boolean
  deprecationDate?: Date
  allowedOrigins: string[]
  requiredScopes: string[]
  tenantId?: string
  createdBy: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type WebhookEndpoint = {
  id: string
  name: string
  url: string
  secret?: string
  events: WebhookEvent[]
  isActive: boolean
  retryPolicy: any
  timeoutMs: number
  filterRules?: any[]
  deliveryCount: number
  failureCount: number
  averageResponseTime: number
  lastDeliveryAt?: Date
  lastFailureAt?: Date
  tenantId: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS'
}

export enum WebhookEvent {
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  ORDER_CREATED = 'ORDER_CREATED',
  ORDER_UPDATED = 'ORDER_UPDATED',
  PAYMENT_PROCESSED = 'PAYMENT_PROCESSED',
  SHIPMENT_CREATED = 'SHIPMENT_CREATED',
  SHIPMENT_DELIVERED = 'SHIPMENT_DELIVERED',
  INVOICE_GENERATED = 'INVOICE_GENERATED',
  INVOICE_PAID = 'INVOICE_PAID',
  AI_DECISION_MADE = 'AI_DECISION_MADE',
  PERFORMANCE_ALERT = 'PERFORMANCE_ALERT',
  SYSTEM_ERROR = 'SYSTEM_ERROR'
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  RETRYING = 'RETRYING'
}

// ===== MONITORING & PERFORMANCE TYPES =====

export type SystemMetric = {
  id: string
  metricName: string
  metricType: MetricType
  value: number
  unit?: string
  component?: string
  instance?: string
  environment?: string
  tags: any
  timestamp: Date
  collectionInterval?: number
  tenantId?: string
}

export type AlertRule = {
  id: string
  name: string
  description?: string
  metricQuery: string
  threshold: number
  operator: AlertOperator
  evaluationWindow: number
  severity: AlertSeverity
  isActive: boolean
  silenceUntil?: Date
  notificationChannels: any[]
  cooldownPeriod: number
  lastEvaluatedAt?: Date
  lastTriggeredAt?: Date
  triggerCount: number
  tenantId?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export enum MetricType {
  COUNTER = 'COUNTER',
  GAUGE = 'GAUGE',
  HISTOGRAM = 'HISTOGRAM',
  SUMMARY = 'SUMMARY',
  TIMER = 'TIMER'
}

export enum AlertOperator {
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
  LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL'
}

export enum AlertSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

export enum IncidentStatus {
  OPEN = 'OPEN',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  INVESTIGATING = 'INVESTIGATING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

// ===== SECURITY & COMPLIANCE TYPES =====

export type SecurityAuditLog = {
  id: string
  eventType: SecurityEventType
  severity: SecuritySeverity
  description: string
  details: any
  userId?: string
  sessionId?: string
  ipAddress?: string
  userAgent?: string
  resourceType?: string
  resourceId?: string
  action?: string
  requestPath?: string
  requestMethod?: string
  requestHeaders?: any
  riskScore?: number
  anomalyScore?: number
  tenantId?: string
  timestamp: Date
}

export type ComplianceRecord = {
  id: string
  complianceType: ComplianceType
  status: ComplianceStatus
  dataSubjectId?: string
  requestType?: string
  description?: string
  processedBy?: string
  processedAt?: Date
  completedAt?: Date
  evidenceUrls: string[]
  documentation?: any
  legalBasis?: string
  retentionPeriod?: number
  expiryDate?: Date
  tenantId: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export enum SecurityEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  DATA_ACCESS = 'DATA_ACCESS',
  DATA_MODIFICATION = 'DATA_MODIFICATION',
  API_ACCESS = 'API_ACCESS',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  SECURITY_VIOLATION = 'SECURITY_VIOLATION',
  COMPLIANCE_CHECK = 'COMPLIANCE_CHECK'
}

export enum SecuritySeverity {
  INFO = 'INFO',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum ComplianceType {
  GDPR_DATA_ACCESS = 'GDPR_DATA_ACCESS',
  GDPR_DATA_RECTIFICATION = 'GDPR_DATA_RECTIFICATION',
  GDPR_DATA_ERASURE = 'GDPR_DATA_ERASURE',
  GDPR_DATA_PORTABILITY = 'GDPR_DATA_PORTABILITY',
  SOC2_CONTROL_CHECK = 'SOC2_CONTROL_CHECK',
  ISO27001_AUDIT = 'ISO27001_AUDIT',
  PRIVACY_ASSESSMENT = 'PRIVACY_ASSESSMENT',
  DATA_RETENTION_REVIEW = 'DATA_RETENTION_REVIEW'
}

export enum ComplianceStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

// ===== LOCALIZATION TYPES =====

export type Translation = {
  id: string
  key: string
  namespace?: string
  locale: string
  value: string
  description?: string
  isAutoTranslated: boolean
  translationQuality?: number
  translatedBy?: string
  reviewedBy?: string
  reviewedAt?: Date
  usageCount: number
  lastUsedAt?: Date
  tenantId?: string
  createdAt: Date
  updatedAt: Date
}

export type LocaleSettings = {
  id: string
  locale: string
  displayName: string
  nativeName: string
  country?: string
  currency?: string
  currencySymbol?: string
  dateFormat?: string
  timeFormat?: string
  numberFormat?: any
  isRTL: boolean
  isEnabled: boolean
  completionPercentage: number
  aiModelSupport: boolean
  speechRecognition: boolean
  textToSpeech: boolean
  createdAt: Date
  updatedAt: Date
}

// ===== WHITE-LABEL TYPES =====

export type TenantCustomization = {
  id: string
  tenantId: string
  brandName?: string
  logoUrl?: string
  faviconUrl?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  backgroundColor?: string
  textColor?: string
  darkModeEnabled: boolean
  customTheme?: any
  layoutConfig?: any
  customCSS?: string
  customJS?: string
  customDomain?: string
  customSubdomain?: string
  customUrls?: any
  enabledFeatures: string[]
  disabledFeatures: string[]
  featurePermissions?: any
  emailTemplates?: any
  emailSignature?: string
  supportEmail?: string
  supportPhone?: string
  privacyPolicyUrl?: string
  termsOfServiceUrl?: string
  cookiePolicyUrl?: string
  legalDocuments?: any
  integrationConfig?: any
  webhookSettings?: any
  createdAt: Date
  updatedAt: Date
}

export enum WhiteLabelPackage {
  BASIC = 'BASIC',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
  CUSTOM = 'CUSTOM'
}

// ===== FORM TYPES FOR SPRINT 4 =====

export type CreateAIModelForm = {
  name: string
  description?: string
  modelType: AIModelType
  modelConfig?: any
  confidenceThreshold?: number
  tags: string[]
}

export type CreateAPIEndpointForm = {
  name: string
  path: string
  method: HTTPMethod
  description?: string
  isPublic: boolean
  requiresAuth: boolean
  rateLimitRpm?: number
  rateLimitRph?: number
  allowedOrigins?: string[]
  requiredScopes?: string[]
}

export type CreateWebhookForm = {
  name: string
  url: string
  events: WebhookEvent[]
  secret?: string
  retryPolicy?: any
  timeoutMs?: number
  filterRules?: any[]
}

export type CreateAlertRuleForm = {
  name: string
  description?: string
  metricQuery: string
  threshold: number
  operator: AlertOperator
  evaluationWindow: number
  severity: AlertSeverity
  notificationChannels: any[]
  cooldownPeriod: number
}

export type TenantCustomizationForm = {
  brandName?: string
  logoUrl?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  customDomain?: string
  enabledFeatures?: string[]
  supportEmail?: string
  supportPhone?: string
}

// ===== ANALYTICS & INSIGHTS TYPES =====

export type AIInsight = {
  id: string
  type: 'PREDICTION' | 'RECOMMENDATION' | 'ANOMALY' | 'OPTIMIZATION'
  title: string
  description: string
  confidence: number
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  data: any
  actionItems?: string[]
  expiresAt?: Date
  moduleSource: string
  tenantId: string
  createdAt: Date
}

export type PerformanceDashboard = {
  apiResponseTime: number
  systemUptime: number
  activeUsers: number
  aiDecisionsPerHour: number
  errorRate: number
  throughput: number
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  networkLatency: number
}

export type ModuleType = 'HR' | 'FINANCE' | 'LOGISTICS' | 'WECREATE' | 'WESELL' | 'COMPLIANCE' | 'ANALYTICS' | 'AI_ENGINE' | 'MONITORING' | 'SECURITY'