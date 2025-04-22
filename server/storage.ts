import { IStorage } from './storage-interface.js';
import { mongoStorage } from './storage-mongo.js';

// Export the MongoDB storage implementation
export const storage = mongoStorage;
