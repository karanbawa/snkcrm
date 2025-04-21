import { IStorage } from './storage-interface';
import { mongoStorage } from './storage-mongo';

// Export the MongoDB storage implementation
export const storage = mongoStorage;
