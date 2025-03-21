/**
 * Advanced Type Generator for prettygood.music
 * 
 * This script connects to the PostgreSQL database and generates TypeScript
 * interfaces based on the database schema. It handles tables, views, enums,
 * domains, and functions.
 */

import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'prettygood',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
};

// Output paths for generated types
const OUTPUT_DIR = process.env.OUTPUT_DIR || path.join(__dirname, '../../../common/src/types/db');
const MODELS_DIR = path.join(OUTPUT_DIR, 'models');
const ENUMS_DIR = path.join(OUTPUT_DIR, 'enums');
const FUNCTIONS_DIR = path.join(OUTPUT_DIR, 'functions');

// Schemas to include
const SCHEMAS = ['prettygood']; // Can be extended to include more schemas

// Map PostgreSQL types to TypeScript types
const pgToTsType = (pgType: string, isNullable: boolean = false, schema: string = 'prettygood'): string => {
  const nullableSuffix = isNullable ? ' | null' : '';

  // Handle array types
  if (pgType.endsWith('[]')) {
    const baseType = pgType.substring(0, pgType.length - 2);
    return `${pgToTsType(baseType, false, schema)}[]${nullableSuffix}`;
  }

  // Handle known PostgreSQL types
  switch (pgType.toLowerCase()) {
    case 'int':
    case 'int2':
    case 'int4':
    case 'int8':
    case 'smallint':
    case 'integer':
    case 'bigint':
    case 'serial':
    case 'bigserial':
    case 'numeric':
    case 'decimal':
    case 'real':
    case 'double precision':
    case 'float':
    case 'float4':
    case 'float8':
      return `number${nullableSuffix}`;
    case 'boolean':
    case 'bool':
      return `boolean${nullableSuffix}`;
    case 'json':
    case 'jsonb':
      return `any${nullableSuffix}`;
    case 'date':
    case 'timestamp':
    case 'timestamptz':
    case 'timestamp with time zone':
    case 'timestamp without time zone':
      return `Date${nullableSuffix}`;
    case 'uuid':
      return `string${nullableSuffix}`;
    case 'text[]':
    case 'varchar[]':
    case 'character varying[]':
      return `string[]${nullableSuffix}`;
    case 'integer[]':
    case 'int[]':
    case 'int4[]':
      return `number[]${nullableSuffix}`;
    default:
      // For enums, reference the generated enum type
      if (customEnums[pgType]) {
        return `${toCamelCase(pgType, true)}${nullableSuffix}`;
      }
      
      // For any other type, use string as the default
      return `string${nullableSuffix}`;
  }
};

// Store for custom enum types we discover
const customEnums: Record<string, string[]> = {};

// Generate interface for a table or view
const generateTableInterface = async (pool: Pool, tableName: string, schema: string): Promise<string> => {
  // Get column information
  const { rows } = await pool.query(`
    SELECT
      column_name,
      data_type,
      udt_name,
      is_nullable,
      column_default,
      CASE 
        WHEN column_default LIKE 'nextval%' THEN true 
        ELSE false 
      END as is_serial
    FROM
      information_schema.columns
    WHERE
      table_schema = $1
      AND table_name = $2
    ORDER BY
      ordinal_position
  `, [schema, tableName]);

  if (rows.length === 0) {
    throw new Error(`No columns found for ${schema}.${tableName}`);
  }

  // Get primary key columns
  const pkResult = await pool.query(`
    SELECT a.attname
    FROM pg_index i
    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
    WHERE i.indrelid = ($1 || '.' || $2)::regclass
    AND i.indisprimary
  `, [schema, tableName]);
  
  const primaryKeys = new Set(pkResult.rows.map(row => row.attname));

  // Start building the interface
  let interfaceStr = `/**
 * Represents the ${schema}.${tableName} table/view.
 * @generated This is a generated type. Do not modify directly.
 */
export interface ${toCamelCase(tableName, true)} {\n`;

  // Add each column as a property
  for (const row of rows) {
    const columnName = row.column_name;
    const isNullable = row.is_nullable === 'YES' && !primaryKeys.has(columnName);
    const dataType = row.udt_name || row.data_type;
    const isSerial = row.is_serial;
    
    // Comment for the property
    interfaceStr += `  /**\n`;
    interfaceStr += `   * ${isSerial ? 'Auto-incrementing ' : ''}${primaryKeys.has(columnName) ? 'Primary key. ' : ''}`;
    interfaceStr += `${row.column_default ? `Default: ${row.column_default}. ` : ''}`;
    interfaceStr += `\n   * Type: ${dataType}\n`;
    interfaceStr += `   */\n`;
    
    let tsType = pgToTsType(dataType, isNullable, schema);
    interfaceStr += `  ${columnName}${isNullable ? '?' : ''}: ${tsType};\n\n`;
  }

  interfaceStr += '}\n';
  return interfaceStr;
};

// Generate enum type definitions
const generateEnumTypes = async (pool: Pool): Promise<void> => {
  // Query to get all enum types from PostgreSQL
  const { rows } = await pool.query(`
    SELECT 
      t.typname AS enum_name,
      e.enumlabel AS enum_value,
      n.nspname AS schema_name
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = ANY($1)
    ORDER BY t.typname, e.enumsortorder
  `, [SCHEMAS]);

  // Group enum values by enum name
  for (const row of rows) {
    const enumName = row.enum_name;
    const enumValue = row.enum_value;
    
    if (!customEnums[enumName]) {
      customEnums[enumName] = [];
    }
    
    customEnums[enumName].push(enumValue);
  }

  // Create enum directory if it doesn't exist
  if (!fs.existsSync(ENUMS_DIR)) {
    fs.mkdirSync(ENUMS_DIR, { recursive: true });
  }
  
  // Generate TypeScript enum for each PostgreSQL enum
  let indexContent = '// Auto-generated enum definitions\n\n';
  
  for (const [enumName, enumValues] of Object.entries(customEnums)) {
    const tsEnumName = toCamelCase(enumName, true);
    let enumContent = `/**
 * Represents the ${enumName} enum type from the database.
 * @generated This is a generated type. Do not modify directly.
 */
export enum ${tsEnumName} {\n`;

    // Add each enum value
    for (const value of enumValues) {
      const enumKey = value.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').toUpperCase();
      enumContent += `  ${enumKey} = '${value}',\n`;
    }

    enumContent += '}\n';
    
    // Write enum file
    fs.writeFileSync(path.join(ENUMS_DIR, `${enumName}.ts`), enumContent);
    
    // Add to index
    indexContent += `export { ${tsEnumName} } from './${enumName}';\n`;
  }
  
  // Write index file
  fs.writeFileSync(path.join(ENUMS_DIR, 'index.ts'), indexContent);
};

// Generate types for stored procedures/functions
const generateFunctionTypes = async (pool: Pool): Promise<void> => {
  // Query to get all functions from PostgreSQL
  const { rows } = await pool.query(`
    SELECT
      n.nspname AS schema_name,
      p.proname AS function_name,
      pg_get_function_arguments(p.oid) AS arguments,
      pg_get_function_result(p.oid) AS result_type,
      d.description AS description
    FROM pg_proc p
    LEFT JOIN pg_namespace n ON p.pronamespace = n.oid
    LEFT JOIN pg_description d ON p.oid = d.objoid
    WHERE n.nspname = ANY($1)
    AND p.prokind = 'f'  -- only regular functions, not aggregates or procedures
    ORDER BY n.nspname, p.proname
  `, [SCHEMAS]);

  // Create functions directory if it doesn't exist
  if (!fs.existsSync(FUNCTIONS_DIR)) {
    fs.mkdirSync(FUNCTIONS_DIR, { recursive: true });
  }
  
  let indexContent = '// Auto-generated function type definitions\n\n';
  
  for (const func of rows) {
    const functionName = func.function_name;
    const schemaName = func.schema_name;
    
    // Skip system functions
    if (functionName.startsWith('pg_') || 
        functionName.startsWith('_pg_') ||
        functionName === 'armor' ||
        functionName === 'crypt' ||
        functionName === 'dearmor' ||
        functionName === 'decrypt' ||
        functionName === 'decrypt_iv' ||
        functionName === 'digest' ||
        functionName === 'encrypt' ||
        functionName === 'encrypt_iv' ||
        functionName === 'gen_random_bytes' ||
        functionName === 'gen_random_uuid' ||
        functionName === 'hmac' ||
        functionName === 'pgp_armor_headers' ||
        functionName === 'pgp_key_id' ||
        functionName === 'pgp_pub_decrypt' ||
        functionName === 'pgp_pub_decrypt_bytea' ||
        functionName === 'pgp_pub_encrypt' ||
        functionName === 'pgp_pub_encrypt_bytea' ||
        functionName === 'pgp_sym_decrypt' ||
        functionName === 'pgp_sym_decrypt_bytea' ||
        functionName === 'pgp_sym_encrypt' ||
        functionName === 'pgp_sym_encrypt_bytea') {
      continue;
    }
    
    // Parse function arguments
    const args = func.arguments.split(',')
      .filter(arg => arg.trim() !== '')
      .map(arg => {
        const parts = arg.trim().split(' ');
        if (parts.length >= 2) {
          const argName = parts[0].replace(/"/g, '');
          const argType = parts.slice(1).join(' ');
          return { name: argName, type: argType };
        }
        return null;
      })
      .filter(arg => arg !== null);
    
    // Convert result type to TypeScript
    let resultType = func.result_type;
    if (resultType.toLowerCase().includes('setof')) {
      // Handle SETOF types (returns multiple rows)
      const setofMatch = resultType.match(/setof\s+(\S+)/i);
      if (setofMatch && setofMatch[1]) {
        resultType = `${pgToTsType(setofMatch[1], false, schemaName)}[]`;
      } else {
        resultType = 'any[]';
      }
    } else if (resultType.toLowerCase() === 'record' || resultType.toLowerCase().includes('record')) {
      resultType = 'any';
    } else if (resultType.toLowerCase() === 'void') {
      resultType = 'void';
    } else if (resultType.toLowerCase() === 'trigger') {
      resultType = 'any';
    } else {
      resultType = pgToTsType(resultType, false, schemaName);
    }
    
    // Generate TypeScript interface for the function
    const interfaceName = `${toCamelCase(functionName, true)}Function`;
    let functionContent = `/**
 * Type definition for the ${schemaName}.${functionName} database function.
 * ${func.description ? `* ${func.description}` : ''}
 * @generated This is a generated type. Do not modify directly.
 */
export interface ${interfaceName} {\n`;

    // Function signature
    functionContent += `  /**\n`;
    if (func.description) {
      functionContent += `   * ${func.description}\n`;
    }
    functionContent += `   * @returns ${resultType}\n`;
    functionContent += `   */\n`;
    functionContent += `  (`;
    
    // Add arguments
    if (args.length > 0) {
      functionContent += args.map(arg => {
        if (!arg) return '';
        const tsType = pgToTsType(arg.type, false, schemaName);
        return `${arg.name}: ${tsType}`;
      }).join(', ');
    }
    
    functionContent += `): Promise<${resultType}>;\n`;
    functionContent += `}\n`;
    
    // Write function file
    fs.writeFileSync(path.join(FUNCTIONS_DIR, `${functionName}.ts`), functionContent);
    
    // Add to index
    indexContent += `export { ${interfaceName} } from './${functionName}';\n`;
  }
  
  // Write index file
  fs.writeFileSync(path.join(FUNCTIONS_DIR, 'index.ts'), indexContent);
};

// Generate all types
const generateAllTypes = async () => {
  const pool = new Pool(dbConfig);

  try {
    // Ensure output directories exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    if (!fs.existsSync(MODELS_DIR)) {
      fs.mkdirSync(MODELS_DIR, { recursive: true });
    }

    // Generate enum types first
    console.log('Generating enum types...');
    await generateEnumTypes(pool);

    // Generate table and view interfaces
    let indexContent = '// Auto-generated database type definitions\n\n';

    for (const schema of SCHEMAS) {
      // Get all tables and views in the schema
      const { rows: tables } = await pool.query(`
        SELECT table_name, table_type
        FROM information_schema.tables
        WHERE table_schema = $1
        AND table_type IN ('BASE TABLE', 'VIEW')
        ORDER BY table_name
      `, [schema]);

      console.log(`Generating types for ${tables.length} tables in ${schema} schema...`);

      // Generate a file for each table/view
      for (const table of tables) {
        const tableName = table.table_name;
        const interfaceName = toCamelCase(tableName, true);
        const tableType = table.table_type === 'BASE TABLE' ? 'table' : 'view';
        
        console.log(`  Generating type for ${schema}.${tableName} (${tableType})...`);
        
        try {
          const interfaceContent = await generateTableInterface(pool, tableName, schema);
          const fileName = `${tableName}.ts`;
          
          fs.writeFileSync(path.join(MODELS_DIR, fileName), interfaceContent);
          
          // Add export to index file
          indexContent += `export { ${interfaceName} } from './models/${tableName}';\n`;
        } catch (err) {
          console.error(`  Error generating type for ${schema}.${tableName}:`, err);
        }
      }
    }

    // Generate function types
    console.log('Generating function types...');
    await generateFunctionTypes(pool);

    // Write the main index file
    indexContent += `\n// Export enums\nexport * from './enums';\n\n`;
    indexContent += `// Export function types\nexport * from './functions';\n`;
    fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), indexContent);

    console.log(`\nType generation complete: types written to ${OUTPUT_DIR}`);

  } catch (error) {
    console.error('Error generating types:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Helper function to convert snake_case to CamelCase
function toCamelCase(str: string, upperFirst: boolean = false): string {
  const result = str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
  if (upperFirst) {
    return result.charAt(0).toUpperCase() + result.slice(1);
  }
  return result;
}

// Run the type generator
generateAllTypes().catch(console.error);
