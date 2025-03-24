#!/usr/bin/env ts-node
/**
 * This script generates TypeScript types from the database schema.
 * It uses the PostgreSQL introspection APIs to extract the table structure
 * and generates corresponding TypeScript types.
 * 
 * Usage:
 * npm run generate-types
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Configuration
const OUTPUT_PATH = path.resolve(__dirname, '../../app/src/lib/types/database/schema.ts');
const OUTPUT_DIR = path.dirname(OUTPUT_PATH);

// Ensure the