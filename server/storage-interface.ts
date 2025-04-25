// Storage interface for all CRUD operations
export interface IStorage {
  connect(uri: string): Promise<void>;
  disconnect(): Promise<void>;
  createCustomer(customer: Omit<Customer, '_id'>): Promise<Customer>;
  getCustomers(): Promise<Customer[]>;
  getCustomerById(id: string): Promise<Customer | null>;
  updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer | null>;
  deleteCustomer(id: string): Promise<boolean>;
  
  // User operations
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  
  // Customer operations
  getAllCustomers(): Promise<any[]>;
  getCustomer(id: string): Promise<any | undefined>;
  toggleHotLead(id: string): Promise<any | undefined>;
  togglePinned(id: string): Promise<any | undefined>;
  getCustomersWithUpcomingFollowUps(days: number): Promise<any[]>; 
  getCustomersNeedingAttention(): Promise<any[]>;
  
  // Note operations
  getNotesForCustomer(customerId: string): Promise<any[]>;
  getNoteById(id: string): Promise<any | undefined>;
  createNote(note: any): Promise<any>;
  updateNote(id: string, note: any): Promise<any | undefined>;
  deleteNote(id: string): Promise<boolean>;
  toggleKeyNote(id: string): Promise<any | undefined>;
  
  // Email log operations
  getEmailLogsForCustomer(customerId: string): Promise<any[]>;
  createEmailLog(emailLog: any): Promise<any>;
  deleteEmailLog(id: string): Promise<boolean>;
  
  // Activity log operations
  getAllActivityLogs(limit?: number): Promise<any[]>;
  getActivityLogsForCustomer(customerId: string): Promise<any[]>;
  createActivityLog(activityLog: any): Promise<any>;
}

export interface Customer {
  _id?: string;
  name: string;
  contactPerson: string;
  email: string;
  phone?: string;
  country: string;
  region?: string;
  city: string;
  website?: string;
  isReturningCustomer?: boolean;
  customerType?: 'Retailer' | 'Distributor' | 'Contractor' | 'Designer' | 'Architect' | 'Builder' | 'Other';
  requirements?: string;
  status?: 'Lead' | 'Email Sent' | 'Meeting Scheduled' | 'Negotiation' | 'Won' | 'Lost';
  priority?: 'High' | 'Medium' | 'Low';
  tags?: string[];
  valueTier?: 'Premium' | 'Standard' | 'Basic' | '';
  directImport?: 'Yes' | 'No' | 'Distributor' | '';
  lastFollowUpDate?: string;
  nextFollowUpDate?: string;
  lastContactNotes?: string;
  keyMeetingPoints?: string;
  isHotLead?: boolean;
  isPinned?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
} 