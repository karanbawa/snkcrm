import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import { 
  users, customers, notes,
  type User, type InsertUser,
  type Customer, type InsertCustomer,
  type Note, type InsertNote
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
  
  // Note operations
  getNotesForCustomer(customerId: string): Promise<Note[]>;
  getNoteById(id: string): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: string, note: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: string): Promise<boolean>;
  toggleKeyNote(id: string): Promise<Note | undefined>;
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
}

export const storage = new DatabaseStorage();
