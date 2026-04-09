const supabase = require('../config/supabase');

const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        // Cek apakah request memiliki Header Authorization dengan awalan Bearer
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Akses ditolak! Anda belum Login (Tidak ada token valid).' });
        }

        const token = authHeader.split(' ')[1];
        
        // Meminta Supabase memvalidasi keaslian token
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            return res.status(401).json({ error: 'Sesi anda tidak valid atau sudah kadaluwarsa.' });
        }

        // Menyimpan objek identitas user di dalam memori request
        req.user = user;
        
        // Lanjutkan perjalanan ke eksekusi Controller input database
        next();
        
    } catch (err) {
        return res.status(500).json({ error: 'Terjadi kesalahan sistem saat memverifikasi autentikasi.' });
    }
};

module.exports = requireAuth;
