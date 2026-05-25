/**
 * controllers/helpers/storage.js
 * Shared helper untuk operasi Local Storage.
 */

const fs = require('fs');
const path = require('path');

/**
 * Ekstrak filename dari URL.
 * @param {string} publicUrl - URL publik file
 * @param {string} bucket    - Nama bucket ('assets-3d' | 'images')
 * @returns {string|null}
 */
function extractStoragePath(publicUrl, bucket) {
  if (!publicUrl || publicUrl === '-') return null;
  const marker = `/uploads/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(publicUrl.substring(idx + marker.length));
}

/**
 * Hapus satu file dari Local Storage.
 * @param {string} bucket - Nama bucket
 * @param {string} url    - Public URL file yang akan dihapus
 */
async function deleteFromStorage(bucket, url) {
  if (!url || url === '-') return;
  const filename = extractStoragePath(url, bucket);
  if (!filename) return;

  const filePath = path.join(__dirname, '../../public/uploads', bucket, filename);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error(`[Storage] Gagal hapus dari '${bucket}': ${filename} →`, error.message);
  }
}

module.exports = { extractStoragePath, deleteFromStorage };
