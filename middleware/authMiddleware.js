const jwt = require('jsonwebtoken');

const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        // Cek apakah request memiliki Header Authorization dengan awalan Bearer
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Akses ditolak! Anda belum Login (Tidak ada token valid).' });
        }

        const token = authHeader.split(' ')[1];
        
        // Verifikasi token dengan JWT_SECRET
        const secret = process.env.JWT_SECRET || 'supersecretjwtkey_pln_2026_pusdiklat';
        
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Sesi anda tidak valid atau sudah kadaluwarsa.' });
            }
            
            // Menyimpan objek identitas user di dalam memori request
            req.user = decoded; // decoded biasanya berisi id, email, role, dll.
            
            // Lanjutkan perjalanan ke eksekusi Controller
            next();
        });
        
    } catch (err) {
        console.error('[authMiddleware] Error tidak terduga:', err.message);
        return res.status(500).json({ error: 'Terjadi kesalahan sistem saat memverifikasi autentikasi.' });
    }
};

module.exports = requireAuth;
