import { eq, desc, and, lte, gte } from "drizzle-orm";
import { db } from "./db";
import { 
  users, customers, notes, emailLogs, activityLogs,
  type User, type InsertUser,
  type Customer, type InsertCustomer,
  type Note, type InsertNote,
  type EmailLog, type InsertEmailLog,
  type ActivityLog, type InsertActivityLog
} from "@shared/schema";

// Storage interface for all CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Customer operations
  getAllCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: InsertCustomer): Promise<Customer | undefined>;
  deleteCustomer(id: string): Promise<boolean>;
  toggleHotLead(id: string): Promise<Customer | undefined>;
  togglePinned(id: string): Promise<Customer | undefined>;
  getCustomersWithUpcomingFollowUps(days: number): Promise<Customer[]>; 
  getCustomersNeedingAttention(): Promise<Customer[]>;
  
  // Note operations
  getNotesForCustomer(customerId: string): Promise<Note[]>;
  getNoteById(id: string): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: string, note: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: string): Promise<boolean>;
  toggleKeyNote(id: string): Promise<Note | undefined>;
  
  // Email log operations
  getEmailLogsForCustomer(customerId: string): Promise<EmailLog[]>;
  createEmailLog(emailLog: InsertEmailLog): Promise<EmailLog>;
  deleteEmailLog(id: string): Promise<boolean>;
  
  // Activity log operations
  getAllActivityLogs(limit?: number): Promise<ActivityLog[]>;
  getActivityLogsForCustomer(customerId: string): Promise<ActivityLog[]>;
  createActivityLog(activityLog: InsertActivityLog): Promise<ActivityLog>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Customer operations
  async getAllCustomers(): Promise<Customer[]> {
    return await db.select().from(customers);
  }
  
  async getCustomer(id: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }
  
  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }
  
  async updateCustomer(id: string, customer: InsertCustomer): Promise<Customer | undefined> {
    const [updatedCustomer] = await db
      .update(customers)
      .set(customer)
      .where(eq(customers.id, id))
      .returning();
    return updatedCustomer;
  }
  
  async deleteCustomer(id: string): Promise<boolean> {
    const result = await db.delete(customers).where(eq(customers.id, id));
    return true; // In PostgreSQL with Drizzle, it doesn't return affected rows
  }
  
  // Note operations
  async getNotesForCustomer(customerId: string): Promise<Note[]> {
    return await db
      .select()
      .from(notes)
      .where(eq(notes.customerId, customerId))
      .orderBy(desc(notes.timestamp));
  }
  
  async getNoteById(id: string): Promise<Note | undefined> {
    const [note] = await db.select().from(notes).where(eq(notes.id, id));
    return note;
  }
  
  async createNote(note: InsertNote): Promise<Note> {
    const [newNote] = await db.insert(notes).values(note).returning();
    return newNote;
  }
  
  async updateNote(id: string, note: Partial<InsertNote>): Promise<Note | undefined> {
    const [updatedNote] = await db
      .update(notes)
      .set(note)
      .where(eq(notes.id, id))
      .returning();
    return updatedNote;
  }
  
  async deleteNote(id: string): Promise<boolean> {
    await db.delete(notes).where(eq(notes.id, id));
    return true;
  }
  
  async toggleKeyNote(id: string): Promise<Note | undefined> {
    const [note] = await db.select().from(notes).where(eq(notes.id, id));
    if (!note) return undefined;
    
    const [updatedNote] = await db
      .update(notes)
      .set({ isKey: !note.isKey })
      .where(eq(notes.id, id))
      .returning();
    
    return updatedNote;
  }
  
  // Enhancement methods for customers
  async toggleHotLead(id: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    if (!customer) return undefined;
    
    const [updatedCustomer] = await db
      .update(customers)
      .set({ isHotLead: !customer.isHotLead })
      .where(eq(customers.id, id))
      .returning();
    
    return updatedCustomer;
  }
  
  async togglePinned(id: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    if (!customer) return undefined;
    
    const [updatedCustomer] = await db
      .update(customers)
      .set({ isPinned: !customer.isPinned })
      .where(eq(customers.id, id))
      .returning();
    
    return updatedCustomer;
  }
  
  async getCustomersWithUpcomingFollowUps(days: number): Promise<Customer[]> {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + days);
    
    const todayISOString = today.toISOString().split('T')[0];
    const endDateISOString = endDate.toISOString().split('T')[0];
    
    return await db
      .select()
      .from(customers)
      .where(
        and(
          gte(customers.nextFollowUpDate, todayISOString),
          lte(customers.nextFollowUpDate, endDateISOString)
        )
      );
  }
  
  async getCustomersNeedingAttention(): Promise<Customer[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoISOString = thirtyDaysAgo.toISOString().split('T')[0];
    
    return await db
      .select()
      .from(customers)
      .where(
        and(
          lte(customers.lastFollowUpDate, thirtyDaysAgoISOString),
          and(
            eq(customers.status, 'Lead'),
            eq(customers.status, 'Email Sent')
          )
        )
      );
  }
  
  // Email log operations
  async getEmailLogsForCustomer(customerId: string): Promise<EmailLog[]> {
    return await db
      .select()
      .from(emailLogs)
      .where(eq(emailLogs.customerId, customerId))
      .orderBy(desc(emailLogs.date));
  }
  
  async createEmailLog(emailLog: InsertEmailLog): Promise<EmailLog> {
    const [newEmailLog] = await db.insert(emailLogs).values(emailLog).returning();
    return newEmailLog;
  }
  
  async deleteEmailLog(id: string): Promise<boolean> {
    await db.delete(emailLogs).where(eq(emailLogs.id, id));
    return true;
  }
  
  // Activity log operations
  async getAllActivityLogs(limit: number = 50): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.timestamp))
      .limit(limit);
  }
  
  async getActivityLogsForCustomer(customerId: string): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.customerId, customerId))
      .orderBy(desc(activityLogs.timestamp));
  }
  
  async createActivityLog(activityLog: InsertActivityLog): Promise<ActivityLog> {
    const [newActivityLog] = await db.insert(activityLogs).values(activityLog).returning();
    return newActivityLog;
  }
}

export const storage = new DatabaseStorage();
