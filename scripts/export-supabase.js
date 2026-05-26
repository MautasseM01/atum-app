/**
 * export-supabase.js
 * STEP 1: Export source-of-all-language from Supabase or local JSON
 *
 * Extracts the 5,083 classified words into supabase-export.json
 * Reads from Supabase ETYMOLOGY_PATTERNS table if env vars are set,
 * otherwise falls back to the existing etymology-database.json
 *
 * Usage:
 *   node scripts/export-supabase.js
 *   # or with live Supabase:
 *   SUPABASE_URL=... SUPABASE_KEY=... node scripts/export-supabase.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '..', 'data');
const SOURCE_DB = path.resolve(
  __dirname, '..', '..',
  'languge', 'Sacred-Language-Content', 'source-of-all-Language',
  'source-of-all-language', 'public', 'data', 'etymology-database.json'
);
const OUTPUT = path.join(DATA_DIR, 'supabase-export.json');

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  let words;

  if (supabaseUrl && supabaseKey) {
    console.log('Connecting to Supabase...');
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('etymology_patterns')
      .select('*');
    if (error) throw error;
    words = data;
    console.log(`Exported ${words.length} words from Supabase`);
  } else {
    console.log('No Supabase credentials — reading from local etymology-database.json');
    if (!fs.existsSync(SOURCE_DB)) {
      throw new Error(`Source database not found at ${SOURCE_DB}`);
    }
    words = JSON.parse(fs.readFileSync(SOURCE_DB, 'utf-8'));
    console.log(`Read ${words.length} words from local file`);
  }

  const exportData = {
    meta: {
      description: 'Source-of-all-Language — complete etymology database',
      total: words.length,
      exportedAt: new Date().toISOString(),
      source: supabaseUrl ? 'supabase' : 'local-file',
    },
    words,
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(exportData, null, 2), 'utf-8');
  console.log(`Wrote ${words.length} words to ${OUTPUT}`);
}

main().catch((err) => {
  console.error('Export failed:', err);
  process.exit(1);
});
