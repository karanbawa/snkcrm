import mongoose from 'mongoose';
import { log } from './vite';
import 'dotenv/config';

// MongoDB connection URL from environment variable
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set');
}

// Connection options for MongoDB
const isSrvUri = MONGODB_URI.startsWith('mongodb+srv://');
const mongoUri = MONGODB_URI; // Create a constant after the check

export async function connectToMongoDB() {
  try {
    // Log connection attempt (redact sensitive information)
    log(`Attempting to connect to MongoDB with URI: ${mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`, 'mongo');
    
    // Set connection options based on type of URI
    const connectOptions: any = {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      connectTimeoutMS: 10000
    };
    
    // For SRV URIs, we shouldn't add the directConnection option
    if (!isSrvUri) {
      connectOptions.directConnection = true;
    }
    
    // Connect with appropriate options
    const connectPromise = mongoose.connect(mongoUri, connectOptions);
    
    await connectPromise;
    log('Successfully connected to MongoDB', 'mongo');
    return mongoose.connection;
  } catch (error) {
    log(`Error connecting to MongoDB: ${error}`, 'mongo');
    throw error; // Let the application handle the error
  }
}

// Define Mongoose schemas and models
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  country: { type: String, required: true },
  region: { type: String, default: '' },
  city: { type: String, required: true },
  website: { type: String, default: '' },
  isReturningCustomer: { type: Boolean, default: false },
  customerType: { 
    type: String, 
    enum: ['Retailer', 'Distributor', 'Contractor', 'Designer', 'Architect', 'Builder', 'Other'],
    default: 'Other' 
  },
  requirements: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Lead', 'Email Sent', 'Meeting Scheduled', 'Negotiation', 'Won', 'Lost'],
    default: 'Lead'
  },
  priority: { 
    type: String, 
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  tags: [{ type: String }],
  valueTier: { 
    type: String, 
    enum: ['Premium', 'Standard', 'Basic', ''],
    default: 'Standard' 
  },
  directImport: { 
    type: String, 
    enum: ['Yes', 'No', 'Distributor', ''],
    default: 'No'
  },
  lastFollowUpDate: { type: String, default: '' },
  nextFollowUpDate: { type: String, default: '' },
  lastContactNotes: { type: String, default: '' },
  keyMeetingPoints: { type: String, default: '' },
  isHotLead: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const noteSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer',
    required: true 
  },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  nextStep: { type: String, default: '' },
  isKey: { type: Boolean, default: false },
  images: [{ type: String }]
});

const emailLogSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer',
    required: true 
  },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  sentBy: { type: String, default: '' }
});

const activityLogSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer',
    required: true 
  },
  activity: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  performedBy: { type: String, default: '' },
  details: { type: String, default: '' }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

// Create and export models
export const Customer = mongoose.model('Customer', customerSchema);
export const Note = mongoose.model('Note', noteSchema);
export const EmailLog = mongoose.model('EmailLog', emailLogSchema);
export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export const User = mongoose.model('User', userSchema);

// Helper function to convert string ID to MongoDB ObjectId
export function toMongoId(id: string) {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch (error) {
    return null;
  }
}