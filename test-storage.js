require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function testDelete() {
    console.log("Testing storage list...");
    const { data: list, error: listErr } = await supabase.storage.from('assets-3d').list();
    if(listErr) {
        console.error("List error:", listErr);
        return;
    }
    console.log("Files in bucket:", list.map(f => f.name));

    if(list.length > 0) {
        // Just as an example, trying to delete a non-existent file to see behavior
        console.log("Attempting to delete non-existent file...");
        const { data, error } = await supabase.storage.from('assets-3d').remove(['fake_file_999.glb']);
        console.log("Result:", data, error);
    }
}
testDelete();
