import { IStorage, Customer as CustomerType } from './storage-interface.js';
import { Customer, Note, EmailLog, ActivityLog, User, toMongoId } from './mongo.js';
import mongoose from 'mongoose';
import { log } from './vite.js';
import { MongoClient, ObjectId, Db, Collection } from 'mongodb';

// Storage implementation for MongoDB
export class MongoStorage implements IStorage {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private customersCollection: Collection | null = null;
  private usersCollection: Collection | null = null;
  private notesCollection: Collection | null = null;
  private emailLogsCollection: Collection | null = null;
  private activityLogsCollection: Collection | null = null;

  async connect(uri: string): Promise<void> {
    this.client = new MongoClient(uri);
    await this.client.connect();
    this.db = this.client.db();
    this.customersCollection = this.db.collection('customers');
    this.usersCollection = this.db.collection('users');
    this.notesCollection = this.db.collection('notes');
    this.emailLogsCollection = this.db.collection('emailLogs');
    this.activityLogsCollection = this.db.collection('activityLogs');
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      this.customersCollection = null;
      this.usersCollection = null;
      this.notesCollection = null;
      this.emailLogsCollection = null;
      this.activityLogsCollection = null;
    }
  }

  async createCustomer(customerData: Omit<CustomerType, '_id'>): Promise<CustomerType> {
    if (!this.customersCollection) throw new Error('Not connected to database');
    const result = await this.customersCollection.insertOne({
      ...customerData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return {
      ...customerData,
      _id: result.insertedId.toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async getCustomers(): Promise<CustomerType[]> {
    if (!this.customersCollection) throw new Error('Not connected to database');
    const customers = await this.customersCollection.find().toArray();
    return customers.map(customer => ({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      address: customer.address || '',
      _id: customer._id.toString(),
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    }));
  }

  async getCustomerById(id: string): Promise<CustomerType | null> {
    if (!this.customersCollection) throw new Error('Not connected to database');
    const customer = await this.customersCollection.findOne({ _id: new ObjectId(id) });
    if (!customer) return null;
    return {
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      address: customer.address || '',
      _id: customer._id.toString(),
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    };
  }

  async updateCustomer(id: string, updateData: Partial<CustomerType>): Promise<CustomerType | null> {
    if (!this.customersCollection) throw new Error('Not connected to database');
    const result = await this.customersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!result) return null;
    return {
      name: result.name,
      email: result.email,
      phone: result.phone || '',
      address: result.address || '',
      _id: result._id.toString(),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    };
  }

  async deleteCustomer(id: string): Promise<boolean> {
    if (!this.customersCollection) throw new Error('Not connected to database');
    const result = await this.customersCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  // User operations
  async getUser(id: number): Promise<any | undefined> {
    try {
      const user = await User.findOne({ _id: id });
      return user ? this.transformUser(user) : undefined;
    } catch (error) {
      log(`Error getting user: ${error}`, 'mongo-storage');
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    try {
      const user = await User.findOne({ username });
      return user ? this.transformUser(user) : undefined;
    } catch (error) {
      log(`Error getting user by username: ${error}`, 'mongo-storage');
      return undefined;
    }
  }

  async createUser(insertUser: any): Promise<any> {
    try {
      const user = new User(insertUser);
      const savedUser = await user.save();
      return this.transformUser(savedUser);
    } catch (error) {
      log(`Error creating user: ${error}`, 'mongo-storage');
      throw error;
    }
  }

  // Customer operations
  async getAllCustomers(): Promise<any[]> {
    try {
      const customers = await Customer.find();
      return customers.map(customer => this.transformCustomer(customer));
    } catch (error) {
      log(`Error getting all customers: ${error}`, 'mongo-storage');
      return [];
    }
  }

  async getCustomer(id: string): Promise<any | undefined> {
    try {
      const mongoId = toMongoId(id);
      if (!mongoId) return undefined;
      
      const customer = await Customer.findById(mongoId);
      return customer ? this.transformCustomer(customer) : undefined;
    } catch (error) {
      log(`Error getting customer: ${error}`, 'mongo-storage');
      return undefined;
    }
  }

  // Note operations
  async getNotesForCustomer(customerId: string): Promise<any[]> {
    try {
      const mongoId = toMongoId(customerId);
      if (!mongoId) return [];
      
      const notes = await Note.find({ customerId: mongoId }).sort({ timestamp: -1 });
      return notes.map(note => this.transformNote(note));
    } catch (error) {
      log(`Error getting notes for customer: ${error}`, 'mongo-storage');
      return [];
    }
  }

  async getNoteById(id: string): Promise<any | undefined> {
    try {
      const mongoId = toMongoId(id);
      if (!mongoId) return undefined;
      
      const note = await Note.findById(mongoId);
      return note ? this.transformNote(note) : undefined;
    } catch (error) {
      log(`Error getting note by id: ${error}`, 'mongo-storage');
      return undefined;
    }
  }

  async createNote(note: Note): Promise<Note> {
    try {
      const { id, ...noteData } = note;
      
      // Convert customerId string to ObjectId
      const customerId = toMongoId(note.customerId);
      if (!customerId) throw new Error('Invalid customer ID');
      
      const newNote = new Note({
        ...noteData,
        customerId,
        timestamp: new Date()
      });
      
      const savedNote = await newNote.save();
      return this.transformNote(savedNote);
    } catch (error) {
      log(`Error creating note: ${error}`, 'mongo-storage');
      throw error;
    }
  }

  async updateNote(id: string, note: Partial<any>): Promise<any | undefined> {
    try {
      const mongoId = toMongoId(id);
      if (!mongoId) return undefined;
      
      const updatedNote = await Note.findByIdAndUpdate(mongoId, note, { new: true });
      return updatedNote ? this.transformNote(updatedNote) : undefined;
    } catch (error) {
      log(`Error updating note: ${error}`, 'mongo-storage');
      return undefined;
    }
  }

  async deleteNote(id: string): Promise<boolean> {
    try {
      const mongoId = toMongoId(id);
      if (!mongoId) return false;
      
      await Note.findByIdAndDelete(mongoId);
      return true;
    } catch (error) {
      log(`Error deleting note: ${error}`, 'mongo-storage');
      return false;
    }
  }

  async toggleKeyNote(id: string): Promise<any | undefined> {
    try {
      const mongoId = toMongoId(id);
      if (!mongoId) return undefined;
      
      const note = await Note.findById(mongoId);
      if (!note) return undefined;
      
      note.isKey = !note.isKey;
      await note.save();
      
      return this.transformNote(note);
    } catch (error) {
      log(`Error toggling key note: ${error}`, 'mongo-storage');
      return undefined;
    }
  }

  // Customer enhancement operations
  async toggleHotLead(id: string): Promise<any | undefined> {
    try {
      const mongoId = toMongoId(id);
      if (!mongoId) return undefined;
      
      const customer = await Customer.findById(mongoId);
      if (!customer) return undefined;
      
      customer.isHotLead = !customer.isHotLead;
      customer.updatedAt = new Date();
      await customer.save();
      
      return this.transformCustomer(customer);
    } catch (error) {
      log(`Error toggling hot lead: ${error}`, 'mongo-storage');
      return undefined;
    }
  }

  async togglePinned(id: string): Promise<any | undefined> {
    try {
      const mongoId = toMongoId(id);
      if (!mongoId) return undefined;
      
      const customer = await Customer.findById(mongoId);
      if (!customer) return undefined;
      
      customer.isPinned = !customer.isPinned;
      customer.updatedAt = new Date();
      await customer.save();
      
      return this.transformCustomer(customer);
    } catch (error) {
      log(`Error toggling pinned: ${error}`, 'mongo-storage');
      return undefined;
    }
  }

  async getCustomersWithUpcomingFollowUps(days: number): Promise<any[]> {
    try {
      // Calculate the date range for upcoming follow-ups
      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + days);
      
      const todayStr = today.toISOString().split('T')[0];
      const futureDateStr = futureDate.toISOString().split('T')[0];
      
      // Find customers with upcoming follow-ups
      // Note: This implementation is a simplification since we're storing dates as strings
      // For a more robust implementation, consider converting nextFollowUpDate to Date type
      const customers = await Customer.find({
        nextFollowUpDate: { $gte: todayStr, $lte: futureDateStr }
      });
      
      return customers.map(customer => this.transformCustomer(customer));
    } catch (error) {
      log(`Error getting customers with upcoming follow-ups: ${error}`, 'mongo-storage');
      return [];
    }
  }

  async getCustomersNeedingAttention(): Promise<any[]> {
    try {
      // Find customers that are hot leads or haven't been followed up in a while
      const customers = await Customer.find({
        $or: [
          { isHotLead: true },
          { isPinned: true }
        ]
      });
      
      return customers.map(customer => this.transformCustomer(customer));
    } catch (error) {
      log(`Error getting customers needing attention: ${error}`, 'mongo-storage');
      return [];
    }
  }

  // Email log operations
  async getEmailLogsForCustomer(customerId: string): Promise<any[]> {
    try {
      const mongoId = toMongoId(customerId);
      if (!mongoId) return [];
      
      const emailLogs = await EmailLog.find({ customerId: mongoId }).sort({ date: -1 });
      return emailLogs.map(log => this.transformEmailLog(log));
    } catch (error) {
      log(`Error getting email logs for customer: ${error}`, 'mongo-storage');
      return [];
    }
  }

  async createEmailLog(emailLog: any): Promise<any> {
    try {
      const { id, ...logData } = emailLog;
      
      // Convert customerId string to ObjectId
      const customerId = toMongoId(emailLog.customerId);
      if (!customerId) throw new Error('Invalid customer ID');
      
      const newEmailLog = new EmailLog({
        ...logData,
        customerId,
        date: new Date()
      });
      
      const savedLog = await newEmailLog.save();
      return this.transformEmailLog(savedLog);
    } catch (error) {
      log(`Error creating email log: ${error}`, 'mongo-storage');
      throw error;
    }
  }

  async deleteEmailLog(id: string): Promise<boolean> {
    try {
      const mongoId = toMongoId(id);
      if (!mongoId) return false;
      
      await EmailLog.findByIdAndDelete(mongoId);
      return true;
    } catch (error) {
      log(`Error deleting email log: ${error}`, 'mongo-storage');
      return false;
    }
  }

  // Activity log operations
  async getAllActivityLogs(limit: number = 50): Promise<any[]> {
    try {
      const activityLogs = await ActivityLog.find()
        .sort({ timestamp: -1 })
        .limit(limit)
        .populate('customerId', 'name');
      
      return activityLogs.map(log => this.transformActivityLog(log));
    } catch (error) {
      log(`Error getting all activity logs: ${error}`, 'mongo-storage');
      return [];
    }
  }

  async getActivityLogsForCustomer(customerId: string): Promise<any[]> {
    try {
      const mongoId = toMongoId(customerId);
      if (!mongoId) return [];
      
      const activityLogs = await ActivityLog.find({ customerId: mongoId }).sort({ timestamp: -1 });
      return activityLogs.map(log => this.transformActivityLog(log));
    } catch (error) {
      log(`Error getting activity logs for customer: ${error}`, 'mongo-storage');
      return [];
    }
  }

  async createActivityLog(activityLog: any): Promise<any> {
    try {
      const { id, ...logData } = activityLog;
      
      // Convert customerId string to ObjectId
      const customerId = toMongoId(activityLog.customerId);
      if (!customerId) throw new Error('Invalid customer ID');
      
      const newActivityLog = new ActivityLog({
        ...logData,
        customerId,
        timestamp: new Date()
      });
      
      const savedLog = await newActivityLog.save();
      return this.transformActivityLog(savedLog);
    } catch (error) {
      log(`Error creating activity log: ${error}`, 'mongo-storage');
      throw error;
    }
  }

  // Helper methods to transform MongoDB documents to the expected format
  private transformUser(user: any): any {
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
  }

  private transformCustomer(customer: any): any {
    return {
      id: customer._id.toString(),
      name: customer.name || '',
      contactPerson: customer.contactPerson || '',
      email: customer.email || '',
      phone: customer.phone || '',
      country: customer.country || '',
      region: customer.region || '',
      city: customer.city || '',
      website: customer.website || '',
      isReturningCustomer: customer.isReturningCustomer || false,
      customerType: customer.customerType || 'Other',
      requirements: customer.requirements || '',
      status: customer.status || 'Lead',
      priority: customer.priority || 'Medium',
      tags: customer.tags || [],
      valueTier: customer.valueTier || 'Standard',
      directImport: customer.directImport || 'No',
      lastFollowUpDate: customer.lastFollowUpDate || '',
      nextFollowUpDate: customer.nextFollowUpDate || '',
      lastContactNotes: customer.lastContactNotes || '',
      keyMeetingPoints: customer.keyMeetingPoints || '',
      isHotLead: customer.isHotLead || false,
      isPinned: customer.isPinned || false,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    };
  }

  private transformNote(note: any): any {
    return {
      id: note._id.toString(),
      customerId: note.customerId.toString(),
      text: note.text,
      timestamp: note.timestamp,
      nextStep: note.nextStep || '',
      isKey: note.isKey || false,
      images: note.images || []
    };
  }

  private transformEmailLog(emailLog: any): any {
    return {
      id: emailLog._id.toString(),
      customerId: emailLog.customerId.toString(),
      subject: emailLog.subject,
      content: emailLog.content,
      date: emailLog.date,
      sentBy: emailLog.sentBy || ''
    };
  }

  private transformActivityLog(activityLog: any): any {
    // Create result object with proper typing
    const log: Record<string, any> = {
      id: activityLog._id.toString(),
      customerId: typeof activityLog.customerId === 'object' ? 
        activityLog.customerId._id.toString() : 
        activityLog.customerId.toString(),
      activity: activityLog.activity,
      timestamp: activityLog.timestamp,
      performedBy: activityLog.performedBy || '',
      details: activityLog.details || ''
    };
    
    // If customer data was populated, add the customer name
    if (typeof activityLog.customerId === 'object' && activityLog.customerId !== null) {
      log.customerName = activityLog.customerId.name;
    }
    
    return log;
  }
}

// Export an instance of the storage
export const mongoStorage = new MongoStorage();

export class CustomerStorage implements IStorage {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private customersCollection: Collection | null = null;
  private usersCollection: Collection | null = null;
  private notesCollection: Collection | null = null;
  private emailLogsCollection: Collection | null = null;
  private activityLogsCollection: Collection | null = null;

  async connect(uri: string): Promise<void> {
    this.client = new MongoClient(uri);
    await this.client.connect();
    this.db = this.client.db('crm');
    this.customersCollection = this.db.collection('customers');
    this.usersCollection = this.db.collection('users');
    this.notesCollection = this.db.collection('notes');
    this.emailLogsCollection = this.db.collection('emailLogs');
    this.activityLogsCollection = this.db.collection('activityLogs');
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      this.customersCollection = null;
      this.usersCollection = null;
      this.notesCollection = null;
      this.emailLogsCollection = null;
      this.activityLogsCollection = null;
    }
  }

  private toCustomer(doc: any): CustomerType {
    return {
      _id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      address: doc.address,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  async createCustomer(customerData: Omit<CustomerType, '_id'>): Promise<CustomerType> {
    if (!this.customersCollection) throw new Error('Not connected to database');
    
    const now = new Date();
    const result = await this.customersCollection.insertOne({
      ...customerData,
      createdAt: now,
      updatedAt: now
    });
    
    return this.toCustomer({ _id: result.insertedId, ...customerData, createdAt: now, updatedAt: now });
  }

  async getCustomers(): Promise<CustomerType[]> {
    if (!this.customersCollection) throw new Error('Not connected to database');
    
    const docs = await this.customersCollection.find().toArray();
    return docs.map(doc => this.toCustomer(doc));
  }

  async getCustomerById(id: string): Promise<CustomerType | null> {
    if (!this.customersCollection) throw new Error('Not connected to database');
    
    const doc = await this.customersCollection.findOne({ _id: new ObjectId(id) });
    return doc ? this.toCustomer(doc) : null;
  }

  async updateCustomer(id: string, updateData: Partial<CustomerType>): Promise<CustomerType | null> {
    if (!this.customersCollection) throw new Error('Not connected to database');
    
    const now = new Date();
    const result = await this.customersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: now } },
      { returnDocument: 'after' }
    );
    
    return result ? this.toCustomer(result) : null;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    if (!this.customersCollection) throw new Error('Not connected to database');
    
    const result = await this.customersCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  // User operations
  async getUser(id: number): Promise<any | undefined> {
    if (!this.usersCollection) throw new Error('Not connected to database');
    return this.usersCollection.findOne({ id });
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    if (!this.usersCollection) throw new Error('Not connected to database');
    return this.usersCollection.findOne({ username });
  }

  async createUser(user: any): Promise<any> {
    if (!this.usersCollection) throw new Error('Not connected to database');
    const result = await this.usersCollection.insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  // Additional customer operations
  async getAllCustomers(): Promise<any[]> {
    if (!this.customersCollection) throw new Error('Not connected to database');
    return this.customersCollection.find().toArray();
  }

  async getCustomer(id: string): Promise<any | undefined> {
    if (!this.customersCollection) throw new Error('Not connected to database');
    return this.customersCollection.findOne({ _id: new ObjectId(id) });
  }

  async toggleHotLead(id: string): Promise<any | undefined> {
    if (!this.customersCollection) throw new Error('Not connected to database');
    const customer = await this.getCustomer(id);
    if (!customer) return undefined;
    const result = await this.customersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { isHotLead: !customer.isHotLead } },
      { returnDocument: 'after' }
    );
    return result;
  }

  async togglePinned(id: string): Promise<any | undefined> {
    if (!this.customersCollection) throw new Error('Not connected to database');
    const customer = await this.getCustomer(id);
    if (!customer) return undefined;
    const result = await this.customersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { isPinned: !customer.isPinned } },
      { returnDocument: 'after' }
    );
    return result;
  }

  async getCustomersWithUpcomingFollowUps(days: number): Promise<any[]> {
    if (!this.customersCollection) throw new Error('Not connected to database');
    const date = new Date();
    date.setDate(date.getDate() + days);
    return this.customersCollection.find({
      nextFollowUp: { $lte: date }
    }).toArray();
  }

  async getCustomersNeedingAttention(): Promise<any[]> {
    if (!this.customersCollection) throw new Error('Not connected to database');
    return this.customersCollection.find({
      $or: [
        { isHotLead: true },
        { isPinned: true },
        { nextFollowUp: { $lte: new Date() } }
      ]
    }).toArray();
  }

  // Note operations
  async getNotesForCustomer(customerId: string): Promise<any[]> {
    if (!this.notesCollection) throw new Error('Not connected to database');
    return this.notesCollection.find({ customerId: new ObjectId(customerId) }).toArray();
  }

  async getNoteById(id: string): Promise<any | undefined> {
    if (!this.notesCollection) throw new Error('Not connected to database');
    return this.notesCollection.findOne({ _id: new ObjectId(id) });
  }

  async createNote(note: any): Promise<any> {
    if (!this.notesCollection) throw new Error('Not connected to database');
    const result = await this.notesCollection.insertOne(note);
    return { ...note, _id: result.insertedId };
  }

  async updateNote(id: string, note: any): Promise<any | undefined> {
    if (!this.notesCollection) throw new Error('Not connected to database');
    const result = await this.notesCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: note },
      { returnDocument: 'after' }
    );
    return result;
  }

  async deleteNote(id: string): Promise<boolean> {
    if (!this.notesCollection) throw new Error('Not connected to database');
    const result = await this.notesCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  async toggleKeyNote(id: string): Promise<any | undefined> {
    if (!this.notesCollection) throw new Error('Not connected to database');
    const note = await this.getNoteById(id);
    if (!note) return undefined;
    const result = await this.notesCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { isKeyNote: !note.isKeyNote } },
      { returnDocument: 'after' }
    );
    return result;
  }

  // Email log operations
  async getEmailLogsForCustomer(customerId: string): Promise<any[]> {
    if (!this.emailLogsCollection) throw new Error('Not connected to database');
    return this.emailLogsCollection.find({ customerId: new ObjectId(customerId) }).toArray();
  }

  async createEmailLog(emailLog: any): Promise<any> {
    if (!this.emailLogsCollection) throw new Error('Not connected to database');
    const result = await this.emailLogsCollection.insertOne(emailLog);
    return { ...emailLog, _id: result.insertedId };
  }

  async deleteEmailLog(id: string): Promise<boolean> {
    if (!this.emailLogsCollection) throw new Error('Not connected to database');
    const result = await this.emailLogsCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  // Activity log operations
  async getAllActivityLogs(limit?: number): Promise<any[]> {
    if (!this.activityLogsCollection) throw new Error('Not connected to database');
    const query = this.activityLogsCollection.find().sort({ createdAt: -1 });
    if (limit) query.limit(limit);
    return query.toArray();
  }

  async getActivityLogsForCustomer(customerId: string): Promise<any[]> {
    if (!this.activityLogsCollection) throw new Error('Not connected to database');
    return this.activityLogsCollection.find({ customerId: new ObjectId(customerId) })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async createActivityLog(activityLog: any): Promise<any> {
    if (!this.activityLogsCollection) throw new Error('Not connected to database');
    const result = await this.activityLogsCollection.insertOne(activityLog);
    return { ...activityLog, _id: result.insertedId };
  }
}