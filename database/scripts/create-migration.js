#!/usr/bin/env node

/**
 * Script to create a new migration file with proper naming
 * 
 * Usage: 
 *   npm run create-migration -- "name_of_migration"
 */

const fs = require('fs');
const path = require('path');

// Ensure we have a migration name
if (process.argv.length < 3) {
  console.error('Please provide a migration name');
  console.error('Example: npm run create-migration -- "create_users_table"');
  process.exit(1);
}

// Get the migration name from arguments
let migrationName = process.argv[2];

// Clean up the migration name
migrationName = migrationName
  .toLowerCase()
  .replace(/[^a-z0-9_]/g, '_') // Replace non-alphanumeric characters with underscores
  .replace(/_+/g, '_')         // Replace multiple underscores with single underscore
  .replace(/^_|_$/g, '');      // Remove leading and trailing underscores

if (!migrationName) {
  console.error('Invalid migration name');
  process.exit(1);
}

// Find the migrations directory
const migrationsDir = path.join(__dirname, '..', 'migrations');

// Create migrations directory if it doesn't exist
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

// Find the latest migration number
let nextMigrationNumber = 1;
try {
  const existingMigrations = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .map(file => parseInt(file.split('_')[0], 10))
    .filter(num => !isNaN(num));

  if (existingMigrations.length > 0) {
    nextMigrationNumber = Math.max(...existingMigrations) + 1;
  }
} catch (error) {
  console.error('Error reading migrations directory:', error);
  process.exit(1);
}

// Format the migration number with leading zeros
const formattedNumber = String(nextMigrationNumber).padStart(3, '0');

// Create the migration filename
const filename = `${formattedNumber}_${migrationName}.sql`;
const migrationPath = path.join(migrationsDir, filename);

// Create the migration template
const template = `-- Migration: ${filename}
-- Description: 

-- Write your migration SQL here

`;

// Write the migration file
try {
  fs.writeFileSync(migrationPath, template);
  console.log(`Created migration: ${migrationPath}`);
} catch (error) {
  console.error('Error creating migration file:', error);
  process.exit(1);
}
