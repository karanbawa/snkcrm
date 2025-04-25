export type CustomerStatus = 
  | "Lead" 
  | "Email Sent" 
  | "Meeting Scheduled" 
  | "Negotiation" 
  | "Won" 
  | "Lost";

export type CustomerType = 
  | "Retailer" 
  | "Distributor" 
  | "Contractor" 
  | "Designer" 
  | "Architect" 
  | "Builder" 
  | "Other";

export type Priority = "High" | "Medium" | "Low";

export type ValueTier = "Premium" | "Standard" | "Basic" | "";

export type DirectImport = "Yes" | "No" | "Distributor" | "";

export interface Customer {
  _id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  city: string;
  website: string;
  isReturningCustomer: boolean;
  customerType: CustomerType;
  requirements: string;
  status: CustomerStatus;
  priority: Priority;
  tags: string[];
  valueTier: ValueTier;
  directImport: DirectImport;
  lastFollowUpDate: string;
  nextFollowUpDate: string;
  lastContactNotes: string;
  keyMeetingPoints: string;
  isHotLead: boolean;
  isPinned: boolean;
  notes: Note[];
}

export interface Note {
  id: string;
  customerId: string;
  text: string;
  timestamp: string;
  nextStep: string;
  isKey: boolean;
  images?: string[];
}

export interface EmailLog {
  id: string;
  customerId: string;
  subject: string;
  summary: string;
  date: string;
}

export interface ActivityLog {
  id: string;
  customerId: string;
  action: string;
  description: string;
  timestamp: string;
}