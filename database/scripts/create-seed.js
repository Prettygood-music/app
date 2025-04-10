#!/usr/bin/env node

/**
 * Script to create a new seed file with proper naming
 * 
 * Usage: 
 *   npm run create-seed -- "name_of_seed_file"
 */

const fs = require('fs');
const path = require('path');

// Ensure we have a seed name
if (process.argv.length < 3) {
  console.error('Please provide a seed file name');
  console.error('Example: npm run create-seed -- "test_artists_data"');
  process.exit(1);
}

// Get the seed name from arguments
let seedName = process.argv[2];

// Clean up the seed name
seedName = seedName
  .toLowerCase()
  .replace(/[^a-z0-9_]/g, '_') // Replace non-alphanumeric characters with underscores
  .replace(/_+/g, '_')         // Replace multiple underscores with single underscore
  .replace(/^_|_$/g, '');      // Remove leading and trailing underscores

if (!seedName) {
  console.error('Invalid seed name');
  process.exit(1);
}

// Find the seed directory
const seedDir = path.join(__dirname, '..', 'seed');

// Create seed directory if it doesn't exist
if (!fs.existsSync(seedDir)) {
  fs.mkdirSync(seedDir, { recursive: true });
}

// Find the latest seed number
let nextSeedNumber = 1;
try {
  const existingSeeds = fs.readdirSync(seedDir)
    .filter(file => file.endsWith('.sql'))
    .map(file => parseInt(file.split('_')[0], 10))
    .filter(num => !isNaN(num));

  if (existingSeeds.length > 0) {
    nextSeedNumber = Math.max(...existingSeeds) + 1;
  }
} catch (error) {
  console.error('Error reading seed directory:', error);
  process.exit(1);
}

// Format the seed number with leading zeros
const formattedNumber = String(nextSeedNumber).padStart(3, '0');

// Create the seed filename
const filename = `${formattedNumber}_${seedName}.sql`;
const seedPath = path.join(seedDir, filename);

// Create the seed template
const template = `-- Seed file: ${filename}
-- Description: 

-- Write your seed SQL data here
-- Tips:
-- 1. Use predictable IDs (e.g., UUIDs starting with specific prefixes)
-- 2. Use ON CONFLICT DO NOTHING to make the seed file idempotent
-- 3. Add comments to explain the purpose of the data

`;

// Write the seed file
try {
  fs.writeFileSync(seedPath, template);
  console.log(`Created seed file: ${seedPath}`);
} catch (error) {
  console.error('Error creating seed file:', error);
  process.exit(1);
}
