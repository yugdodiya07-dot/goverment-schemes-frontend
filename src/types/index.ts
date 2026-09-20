export type UserRole = 'citizen' | 'admin' | 'officer';
export type UserStatus = 'Active' | 'Blocked' | 'Deleted';
export type ApplicationStatus = 'Submitted' | 'Under Review' | 'Document Verification' | 'Approved' | 'Rejected';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  status: UserStatus;
  age?: number;
  gender?: string;
  state?: string;
  district?: string;
  address?: string;
  pincode?: string;
  annualIncome?: number;
  occupation?: string;
  category?: string;
  disabilityStatus?: boolean;
  specialStatus?: string[];
  department?: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  bannerImage?: string;
  schemeCount: number;
}

export interface IScheme {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: ICategory | string;
  ministry: string;
  department?: string;
  benefitType: string;
  financialBenefit: string;
  eligibilityCriteria: {
    minAge?: number;
    maxAge?: number;
    gender?: string;
    maxIncome?: number;
    eligibleStates?: string[];
    eligibleOccupations?: string[];
    eligibleCategories?: string[];
    requiresDisability?: boolean;
    requiredSpecialStatus?: string[];
  };
  requiredDocuments: string[];
  applicationProcess: string[];
  officialUrl?: string;
  helplineNumber?: string;
  tags: string[];
  bannerImage?: string;
  viewsCount: number;
  applicationsCount: number;
  createdAt: string;
}

export interface IApplication {
  _id: string;
  applicationNumber: string;
  user: IUser | string;
  scheme: IScheme | string;
  formData: Record<string, any>;
  documents: Array<{
    documentName: string;
    documentType: string;
    fileUrl: string;
    uploadedAt: string;
  }>;
  eligibilityScore: number;
  status: ApplicationStatus;
  statusHistory: Array<{
    status: ApplicationStatus;
    comment: string;
    updatedAt: string;
  }>;
  adminRemarks?: string;
  submittedAt: string;
}

export interface IEligibilityBreakdown {
  score: number;
  isEligible: boolean;
  breakdown: {
    age: { score: number; max: number; passed: boolean };
    income: { score: number; max: number; passed: boolean };
    occupation: { score: number; max: number; passed: boolean };
    gender: { score: number; max: number; passed: boolean };
    state: { score: number; max: number; passed: boolean };
    category: { score: number; max: number; passed: boolean };
    disability: { score: number; max: number; passed: boolean };
    specialStatus: { score: number; max: number; passed: boolean };
  };
  matchedRules: string[];
  unmatchedRules: string[];
}
