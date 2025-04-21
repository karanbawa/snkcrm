import { IStorage } from './storage';
import { storage as memStorage } from './storage';
import { mongoStorage } from './storage-mongo';
import { log } from './vite';

// Flag to indicate if MongoDB connection was successful
let isMongoConnected = false;

// Function to set MongoDB connection status
export function setMongoConnectionStatus(status: boolean) {
  isMongoConnected = status;
  log(`MongoDB connection status set to: ${status}`, 'storage-factory');
}

// Storage factory - returns the appropriate storage implementation
export function getStorage(): IStorage {
  if (isMongoConnected) {
    log('Using MongoDB storage', 'storage-factory');
    return mongoStorage;
  } else {
    log('Using in-memory storage (MongoDB not connected)', 'storage-factory');
    return memStorage;
  }
}