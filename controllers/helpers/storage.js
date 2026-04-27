/**
 * controllers/helpers/storage.js
 * Shared helper untuk operasi Supabase Storage.
 * Digunakan oleh moduleController, materialController, toolController.
 */

const supabase = require('../../config/supabase');

/**
 * Ekstrak path relatif dari public URL Supabase Storage.
 * Mendukung semua bucket (assets-3d, images, dll).
 * @param {string} publicUrl - URL publik file
 * @param {string} bucket    - Nama bucket ('assets-3d' | 'images')
 * @returns {string|null}
 */
function extractStoragePath(publicUrl, bucket) {
    if (!publicUrl || publicUrl === '-') return null;
    // Format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
    const marker = `/object/public/${bucket}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(publicUrl.substring(idx + marker.length));
}

/**
 * Hapus satu file dari Supabase Storage.
 * Tidak throw error — hanya log jika gagal.
 * @param {string} bucket - Nama bucket
 * @param {string} url    - Public URL file yang akan dihapus
 */
async function deleteFromStorage(bucket, url) {
    if (!url || url === '-') return;
    const path = extractStoragePath(url, bucket);
    if (!path) return;
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) {
        console.error(`[Storage] Gagal hapus dari '${bucket}': ${path} →`, error.message);
    } else {
        console.log(`[Storage] Berhasil hapus dari '${bucket}': ${path}`);
    }
}

module.exports = { extractStoragePath, deleteFromStorage };
