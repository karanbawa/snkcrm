export type Priority = "High" | "Medium" | "Low";

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

export type ValueTier = "Premium" | "Standard" | "Basic" | "";

export type DirectImport = "Yes" | "No" | "Distributor" | "";

export interface Customer {
  id: string;
  isReturningCustomer: boolean;
  
  // Basic Info
  name: string;
  country: string;
  region: string;
  city: string;
  
  // Contact Info
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  
  // Business Details
  customerType: CustomerType;
  requirements: string;
  status: CustomerStatus;
  priority: Priority;
  tags: string[];
  valueTier: ValueTier;
  directImport: DirectImport;
  
  // Dates
  lastFollowUpDate: string;
  nextFollowUpDate: string;
  
  // Notes
  lastContactNotes: string;
  keyMeetingPoints: string;
  
  // Notes Collection
  notes: Note[];
}

export interface Note {
  id: string;
  text: string;
  timestamp: string;
  nextStep: string;
  isKey: boolean;
  images: string[]; // Base64 strings for simplicity
}
