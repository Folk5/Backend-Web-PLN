// =========================================================
// TEST KONEKSI & DATABASE - Backend PLN Pusdiklat
// Jalankan dengan: node test-db.js
// =========================================================

require('dotenv').config(); // Muat .env secara manual
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

// ─── Validasi Variabel Environment ───────────────────────
console.log('\n==========================================');
console.log('  🔍 PLN Backend - Test Koneksi Database  ');
console.log('==========================================\n');

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ GAGAL: SUPABASE_URL atau SUPABASE_SERVICE_KEY tidak ditemukan di .env!');
    process.exit(1);
}

console.log('✅ Variabel .env terbaca:');
console.log(`   URL    : ${SUPABASE_URL}`);
console.log(`   KEY    : ${SUPABASE_KEY.slice(0, 20)}... (tersembunyi)`);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── Fungsi Helper ────────────────────────────────────────
function printResult(label, count, error) {
    if (error) {
        console.error(`   ❌ ${label.padEnd(25)} → Error: ${error.message}`);
    } else {
        console.log(`   ✅ ${label.padEnd(25)} → ${count ?? 0} record`);
    }
}

// ─── Test Utama ───────────────────────────────────────────
async function runTests() {
    console.log('\n📡 Mengetes koneksi ke Supabase...\n');

    const tables = [
        'modules',
        'module_assets',
        'module_materials',
        'module_tools',
        'materials',
        'material_assets',
        'tools',
    ];

    let allPassed = true;

    for (const table of tables) {
        const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });

        printResult(`Tabel: ${table}`, count, error);
        if (error) allPassed = false;
    }

    // ─── Test Baca Data Sample ─────────────────────────────
    console.log('\n📦 Mengambil sample data (5 modul pertama)...\n');
    const { data: modules, error: modErr } = await supabase
        .from('modules')
        .select('id, title, status, created_at')
        .limit(5);

    if (modErr) {
        console.error(`   ❌ Gagal ambil data modules: ${modErr.message}`);
        allPassed = false;
    } else if (modules.length === 0) {
        console.warn('   ⚠️  Tabel modules kosong — belum ada data.');
    } else {
        modules.forEach((m, i) => {
            console.log(`   [${i + 1}] ${m.title || '(no title)'} | Status: ${m.status || '-'} | ID: ${m.id}`);
        });
    }

    // ─── Test Storage Bucket ───────────────────────────────
    console.log('\n🪣 Mengecek Storage Buckets...\n');
    const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets();

    if (bucketErr) {
        console.error(`   ❌ Gagal cek bucket: ${bucketErr.message}`);
        allPassed = false;
    } else if (buckets.length === 0) {
        console.warn('   ⚠️  Tidak ada bucket yang ditemukan.');
    } else {
        buckets.forEach(b => {
            console.log(`   🪣 Bucket: ${b.name} (public: ${b.public})`);
        });
    }

    // ─── Ringkasan ─────────────────────────────────────────
    console.log('\n==========================================');
    if (allPassed) {
        console.log('  🎉 SEMUA TEST LULUS! Database siap digunakan.');
    } else {
        console.log('  ⚠️  BEBERAPA TEST GAGAL. Periksa output di atas.');
    }
    console.log('==========================================\n');
    process.exit(allPassed ? 0 : 1);
}

runTests().catch(err => {
    console.error('\n💥 Error tidak terduga:', err.message);
    process.exit(1);
});
