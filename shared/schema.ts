import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
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

export type Priority = "High" | "Medium" | "Low";

export type ValueTier = "Premium" | "Standard" | "Basic" | "";

export type DirectImport = "Yes" | "No" | "Distributor" | "";

// Customers table
export const customers = pgTable("customers", {
  id: text("id").notNull().primaryKey(),
  isReturningCustomer: boolean("is_returning_customer").notNull().default(false),
  
  // Basic Info
  name: text("name").notNull(),
  country: text("country").notNull(),
  region: text("region").notNull(),
  city: text("city").notNull(),
  
  // Contact Info
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  website: text("website").notNull(),
  
  // Business Details
  customerType: text("customer_type").notNull(),
  requirements: text("requirements").notNull(),
  status: text("status").notNull(),
  priority: text("priority").notNull(),
  tags: text("tags").array().notNull(),
  valueTier: text("value_tier").notNull(),
  directImport: text("direct_import").notNull(),
  
  // Dates
  lastFollowUpDate: text("last_follow_up_date").notNull(),
  nextFollowUpDate: text("next_follow_up_date").notNull(),
  
  // Notes
  lastContactNotes: text("last_contact_notes").notNull(),
  keyMeetingPoints: text("key_meeting_points").notNull(),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Notes table
export const notes = pgTable("notes", {
  id: text("id").notNull().primaryKey(),
  customerId: text("customer_id").notNull().references(() => customers.id, { onDelete: 'cascade' }),
  text: text("text").notNull(),
  nextStep: text("next_step").notNull(),
  isKey: boolean("is_key").notNull().default(false),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  images: text("images").array().notNull(),
});

// Setup relations
export const customersRelations = relations(customers, ({ many }) => ({
  notes: many(notes),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  customer: one(customers, {
    fields: [notes.customerId],
    references: [customers.id],
  }),
}));

// Insert schemas for validation
export const insertCustomerSchema = createInsertSchema(customers);
export const insertNoteSchema = createInsertSchema(notes);

// Types
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type InsertNote = typeof notes.$inferInsert;
