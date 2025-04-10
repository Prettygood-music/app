import { mkdir, writeFile } from 'fs/promises';
import { join, dirname, extname } from 'path';
import { existsSync } from 'fs';
import { customAlphabet } from 'nanoid';

// Create a custom ID generator using lowercase letters and numbers
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 12);

// Base directories for different media types
const BASE_DIRS = {
  audio: 'uploads/audio',
  image: 'uploads/images',
};

// Ensure storage directories exist
async function ensureDirectoryExists(directory: string): Promise<void> {
  if (!existsSync(directory)) {
    await mkdir(directory, { recursive: true });
  }
}

// Generate a unique filename
function generateUniqueFilename(originalFilename: string): string {
  const ext = extname(originalFilename).toLowerCase();
  const timestamp = Date.now();
  const uniqueId = nanoid();
  return `${timestamp}-${uniqueId}${ext}`;
}

/**
 * Stores a file on the local filesystem
 * @param file The file buffer to store
 * @param type The type of file (audio or image)
 * @param originalFilename The original filename
 * @returns The relative URL path to access the file
 */
export async function storeFile(
  file: Buffer | Uint8Array,
  type: 'audio' | 'image',
  originalFilename: string
): Promise<string> {
  // Get the base directory for this file type
  const baseDir = BASE_DIRS[type];
  
  // Generate a unique filename
  const filename = generateUniqueFilename(originalFilename);
  
  // Create year/month-based directory structure for better organization
  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const relativePath = join(baseDir, yearMonth);
  const absolutePath = join(process.cwd(), 'static', relativePath);
  
  // Ensure the directory exists
  await ensureDirectoryExists(absolutePath);
  
  // Full path to the file
  const fullPath = join(absolutePath, filename);
  
  // Write the file
  await writeFile(fullPath, file);
  
  // Return the public URL path (relative to static)
  return join('/', relativePath, filename);
}

/**
 * Gets the absolute path for a file given its URL path
 * @param urlPath The URL path to the file
 * @returns The absolute path to the file on disk
 */
export function getFilePath(urlPath: string): string {
  return join(process.cwd(), 'static', urlPath);
}
