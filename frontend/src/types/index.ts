export type Role = 'ROLE_USER' | 'ROLE_BUSINESS' | 'ROLE_ADMIN';

export type VerificationStatus = 'NOT_SUBMITTED' | 'PENDING' | 'VERIFIED' | 'REJECTED' | 'CORRECTION_REQUIRED';

export type DocumentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type SchemeStatus = 'DRAFT' | 'IMPORTED' | 'PENDING_REVIEW' | 'PUBLISHED' | 'ACTIVE' | 'EXPIRED' | 'INACTIVE' | 'ARCHIVED' | 'REJECTED';

export type TenderStatus = 'DRAFT' | 'IMPORTED' | 'PENDING_REVIEW' | 'PUBLISHED' | 'ACTIVE' | 'CLOSED' | 'CANCELLED' | 'ARCHIVED' | 'REJECTED';

export type ApplicationStatus = 'INTERESTED' | 'PREPARING' | 'APPLIED' | 'COMPLETED';

export type CategoryType = 'SCHEME' | 'TENDER';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  active: boolean;
  createdAt?: string;
}

export interface JwtAuthResponse {
  accessToken: string;
  tokenType: string;
  id: number;
  fullName: string;
  email: string;
  role: Role;
}

export interface BusinessProfile {
  id?: number;
  userId?: number;
  businessName: string;
  businessType: string;
  industry: string;
  state: string;
  district: string;
  businessEmail?: string;
  phone?: string;
  website?: string;
  businessDescription?: string;
  turnoverRange?: string;
  investmentRange?: string;
  employeeCount?: string;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  submittedAt?: string;
  verifiedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BusinessDocument {
  id: number;
  businessId: number;
  documentType: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  contentType: string;
  status: DocumentStatus;
  rejectionReason?: string;
  uploadedAt: string;
  verifiedAt?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  type: CategoryType;
  active: boolean;
}

export interface Scheme {
  id: number;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  department: string;
  ministry?: string;
  categoryId?: number;
  categoryName?: string;
  schemeType: string;
  state: string;
  district?: string;
  benefits?: string;
  eligibility?: string;
  requiredDocuments?: string;
  applicationProcess?: string;
  startDate?: string;
  deadline?: string;
  officialApplicationUrl?: string;
  officialSourceUrl?: string;
  status: SchemeStatus;
  featured: boolean;
  minInvestment?: number;
  maxInvestment?: number;
  minTurnover?: number;
  maxTurnover?: number;
  targetIndustries?: string;
  targetBusinessTypes?: string;
  sourceName?: string;
  sourceReferenceId?: string;
  sourceLastUpdatedAt?: string;
  lastSyncedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface Tender {
  id: number;
  title: string;
  slug: string;
  tenderNumber: string;
  organization: string;
  department?: string;
  categoryId?: number;
  categoryName?: string;
  description: string;
  location?: string;
  state: string;
  district?: string;
  estimatedValue?: number;
  publishDate?: string;
  closingDate?: string;
  eligibility?: string;
  requiredDocuments?: string;
  requirements?: string;
  officialTenderUrl?: string;
  officialSourceUrl?: string;
  status: TenderStatus;
  featured: boolean;
  targetIndustries?: string;
  targetBusinessTypes?: string;
  sourceName?: string;
  sourceReferenceId?: string;
  sourceLastUpdatedAt?: string;
  lastSyncedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface RecommendationResponse {
  opportunityType: 'SCHEME' | 'TENDER';
  matchScore: number;
  matchReasons: string[];
  scheme?: Scheme;
  tender?: Tender;
}

export interface UserApplication {
  id: number;
  userId: number;
  schemeId?: number;
  schemeTitle?: string;
  tenderId?: number;
  tenderTitle?: string;
  title: string;
  applicationNumber?: string;
  status: ApplicationStatus;
  applicationDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type?: string;
  actionUrl?: string;
  readStatus: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: number;
  actorId?: number;
  actorEmail?: string;
  action: string;
  entityType?: string;
  entityId?: number;
  description?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalBusinesses: number;
  pendingBusinesses: number;
  verifiedBusinesses: number;
  totalSchemes: number;
  activeSchemes: number;
  draftSchemes: number;
  totalTenders: number;
  activeTenders: number;
  closedTenders: number;
  pendingDocuments: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}
