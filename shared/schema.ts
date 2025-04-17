import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Custom types for the CRM app

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

export type CustomerPriority = "High" | "Medium" | "Low";

export type ValueTier = "Premium" | "Standard" | "Basic";

export type DirectImport = "Yes" | "No" | "Distributor";

export interface Customer {
  id: string;
  returningCustomer: boolean;
  name: string;
  country: string;
  region: string;
  city: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  customerType: CustomerType;
  requirements: string;
  status: CustomerStatus;
  priority: CustomerPriority;
  tags: string[];
  valueTier: ValueTier;
  directImport: DirectImport;
  lastFollowupDate: string;
  nextFollowupDate: string;
  lastContactNotes: string;
  keyMeetingPoints: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerNote {
  id: string;
  customerId: string;
  text: string;
  isKey: boolean;
  nextStep: string;
  timestamp: string;
  images: string[]; // Base64 encoded strings or URLs
}
