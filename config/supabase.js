require('dotenv').config({ override: true });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('CRITICAL ERROR: Missing Supabase URL or SUPABASE_SERVICE_KEY in .env file');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
