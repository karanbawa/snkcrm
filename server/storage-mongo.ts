import { IStorage } from './storage';
import { Customer, Note, EmailLog, ActivityLog, User, toMongoId } from './mongo';
import mongoose from 'mongoose';
import { log } from './vite';

// Storage implementation for MongoDB
export class MongoStorage implements IStorage {
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

  async createCustomer(customer: any): Promise<any> {
    try {
      // Remove any existing id to let MongoDB generate a new one
      const { id, ...customerData } = customer;
      
      const newCustomer = new Customer({
        ...customerData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const savedCustomer = await newCustomer.save();
      return this.transformCustomer(savedCustomer);
    } catch (error) {
      log(`Error creating customer: ${error}`, 'mongo-storage');
      throw error;
    }
  }

  async updateCustomer(id: string, customer: any): Promise<any | undefined> {
    try {
      const mongoId = toMongoId(id);
      if (!mongoId) return undefined;
      
      const updatedCustomer = await Customer.findByIdAndUpdate(
        mongoId,
        { ...customer, updatedAt: new Date() },
        { new: true }
      );
      
      return updatedCustomer ? this.transformCustomer(updatedCustomer) : undefined;
    } catch (error) {
      log(`Error updating customer: ${error}`, 'mongo-storage');
      return undefined;
    }
  }

  async deleteCustomer(id: string): Promise<boolean> {
    try {
      const mongoId = toMongoId(id);
      if (!mongoId) return false;
      
      // Delete customer and related data
      await Customer.findByIdAndDelete(mongoId);
      await Note.deleteMany({ customerId: mongoId });
      await EmailLog.deleteMany({ customerId: mongoId });
      await ActivityLog.deleteMany({ customerId: mongoId });
      
      return true;
    } catch (error) {
      log(`Error deleting customer: ${error}`, 'mongo-storage');
      return false;
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

  async createNote(note: any): Promise<any> {
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