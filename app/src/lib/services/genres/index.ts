/**
 * Genres Service - Main Export File
 * 
 * This file exports all genre-related functions and types.
 */

// Export all types
export * from './types';

// Export all service functions
export * from './genres-service';

// Export utility functions that might be useful elsewhere
export { 
  formatDuration, 
  formatReleaseDate, 
  generateRandomColor, 
  slugify 
} from './utils';
