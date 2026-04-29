const { isNetworkError, verifyTokenWithRetry } = require('../utils/supabaseAuth');

const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        // Cek apakah request memiliki Header Authorization dengan awalan Bearer
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Akses ditolak! Anda belum Login (Tidak ada token valid).' });
        }

        const token = authHeader.split(' ')[1];
        
        // Verifikasi token ke Supabase, dengan retry jika ada gangguan jaringan sementara
        const { user, error } = await verifyTokenWithRetry(token);
        
        if (error || !user) {
            return res.status(401).json({ error: 'Sesi anda tidak valid atau sudah kadaluwarsa.' });
        }

        // Menyimpan objek identitas user di dalam memori request
        req.user = user;
        
        // Lanjutkan perjalanan ke eksekusi Controller
        next();
        
    } catch (err) {
        // Jika tetap gagal setelah retry (misal: Supabase sedang down)
        if (isNetworkError(err)) {
            console.error('[authMiddleware] Koneksi ke Supabase terputus setelah semua retry:', err.cause?.code || err.message);
            return res.status(503).json({ error: 'Layanan autentikasi sementara tidak dapat dijangkau. Coba lagi.' });
        }
        console.error('[authMiddleware] Error tidak terduga:', err.message);
        return res.status(500).json({ error: 'Terjadi kesalahan sistem saat memverifikasi autentikasi.' });
    }
};

module.exports = requireAuth;
