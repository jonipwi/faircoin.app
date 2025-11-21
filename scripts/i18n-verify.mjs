#!/usr/bin/env node

/**
 * i18n Verification Script
 * 
 * Verifies that all translation files have the same structure and key count
 * as the reference English translation file.
 * 
 * Usage: npm run check:i18n
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TRANSLATIONS_DIR = path.join(__dirname, '../lib/i18n/translations');
const REFERENCE_LANG = 'en.json';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function countKeys(obj, prefix = '') {
  let count = 0;
  const keys = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const result = countKeys(obj[key], fullKey);
      count += result.count;
      keys.push(...result.keys);
    } else {
      count++;
      keys.push(fullKey);
    }
  }
  
  return { count, keys };
}

function getAllKeys(obj, prefix = '') {
  const keys = new Set();
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const nestedKeys = getAllKeys(obj[key], fullKey);
      nestedKeys.forEach(k => keys.add(k));
    } else {
      keys.add(fullKey);
    }
  }
  
  return keys;
}

function findMissingKeys(referenceKeys, targetKeys) {
  const missing = [];
  
  for (const key of referenceKeys) {
    if (!targetKeys.has(key)) {
      missing.push(key);
    }
  }
  
  return missing;
}

function findExtraKeys(referenceKeys, targetKeys) {
  const extra = [];
  
  for (const key of targetKeys) {
    if (!referenceKeys.has(key)) {
      extra.push(key);
    }
  }
  
  return extra;
}

async function verifyTranslations() {
  log('\n🌍 FairCoin i18n Verification Tool', 'bright');
  log('━'.repeat(60), 'cyan');
  
  // Read reference file
  const referencePath = path.join(TRANSLATIONS_DIR, REFERENCE_LANG);
  
  if (!fs.existsSync(referencePath)) {
    log(`\n❌ Error: Reference file not found: ${REFERENCE_LANG}`, 'red');
    process.exit(1);
  }
  
  const referenceContent = JSON.parse(fs.readFileSync(referencePath, 'utf8'));
  const referenceResult = countKeys(referenceContent);
  const referenceKeys = getAllKeys(referenceContent);
  
  log(`\n📖 Reference: ${REFERENCE_LANG}`, 'blue');
  log(`   Total keys: ${referenceResult.count}`, 'cyan');
  
  // Get all translation files
  const files = fs.readdirSync(TRANSLATIONS_DIR)
    .filter(f => f.endsWith('.json') && !f.includes('.bak') && !f.includes('.backup'))
    .sort();
  
  if (files.length === 0) {
    log('\n❌ Error: No translation files found', 'red');
    process.exit(1);
  }
  
  log(`\n🔍 Checking ${files.length} translation files...`, 'blue');
  log('━'.repeat(60), 'cyan');
  
  const results = [];
  let hasErrors = false;
  
  for (const file of files) {
    const filePath = path.join(TRANSLATIONS_DIR, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const result = countKeys(content);
    const fileKeys = getAllKeys(content);
    
    const lang = file.replace('.json', '');
    const isReference = file === REFERENCE_LANG;
    const keyCountMatch = result.count === referenceResult.count;
    
    // Find missing and extra keys
    const missingKeys = findMissingKeys(referenceKeys, fileKeys);
    const extraKeys = findExtraKeys(referenceKeys, fileKeys);
    
    results.push({
      lang,
      file,
      count: result.count,
      isReference,
      keyCountMatch,
      missingKeys,
      extraKeys,
      hasIssues: missingKeys.length > 0 || extraKeys.length > 0 || !keyCountMatch
    });
    
    if (!isReference && !keyCountMatch) {
      hasErrors = true;
    }
  }
  
  // Display results
  console.log('\n');
  console.log('┌─────────────┬───────────┬────────┐');
  console.log('│ Language    │ Keys      │ Status │');
  console.log('├─────────────┼───────────┼────────┤');
  
  results.forEach(({ lang, count, isReference, keyCountMatch, hasIssues }) => {
    const langDisplay = lang.padEnd(11);
    const countDisplay = count.toString().padStart(9);
    
    let status;
    if (isReference) {
      status = '  REF ';
    } else if (!hasIssues) {
      status = '  ✅  ';
    } else {
      status = '  ❌  ';
    }
    
    const color = isReference ? 'blue' : (hasIssues ? 'red' : 'green');
    log(`│ ${langDisplay} │ ${countDisplay} │ ${status} │`, color);
  });
  
  console.log('└─────────────┴───────────┴────────┘');
  
  // Show details for files with issues
  const filesWithIssues = results.filter(r => !r.isReference && r.hasIssues);
  
  if (filesWithIssues.length > 0) {
    log('\n⚠️  Issues Found:', 'yellow');
    log('━'.repeat(60), 'yellow');
    
    filesWithIssues.forEach(({ file, missingKeys, extraKeys }) => {
      log(`\n📄 ${file}`, 'yellow');
      
      if (missingKeys.length > 0) {
        log(`   Missing ${missingKeys.length} keys:`, 'red');
        missingKeys.slice(0, 10).forEach(key => {
          log(`     - ${key}`, 'red');
        });
        if (missingKeys.length > 10) {
          log(`     ... and ${missingKeys.length - 10} more`, 'red');
        }
      }
      
      if (extraKeys.length > 0) {
        log(`   Extra ${extraKeys.length} keys:`, 'yellow');
        extraKeys.slice(0, 10).forEach(key => {
          log(`     + ${key}`, 'yellow');
        });
        if (extraKeys.length > 10) {
          log(`     ... and ${extraKeys.length - 10} more`, 'yellow');
        }
      }
    });
  }
  
  // Summary
  log('\n━'.repeat(60), 'cyan');
  
  if (hasErrors || filesWithIssues.length > 0) {
    log(`\n❌ Verification Failed`, 'red');
    log(`   ${filesWithIssues.length} file(s) have issues`, 'red');
    log(`   Reference: ${referenceResult.count} keys`, 'yellow');
    process.exit(1);
  } else {
    log(`\n✅ All translations verified successfully!`, 'green');
    log(`   ${files.length} languages, ${referenceResult.count} keys each`, 'cyan');
    log(`   Total: ${files.length * referenceResult.count} translations`, 'cyan');
  }
  
  log('━'.repeat(60), 'cyan');
  console.log('');
}

// Run verification
verifyTranslations().catch(error => {
  log(`\n❌ Error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
