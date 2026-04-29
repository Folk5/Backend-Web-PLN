const supabase = require('../config/supabase');
const { isNetworkError, verifyTokenWithRetry } = require('../utils/supabaseAuth');

exports.register = async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ error: 'Email dan password harus diisi' });
    }

    try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) return res.status(400).json({ error: error.message });
        res.json({
            message: 'Registrasi berhasil. Silakan cek email Anda jika verifikasi diaktifkan.',
            user: data.user
        });
    } catch (err) {
        if (isNetworkError(err)) {
            console.error('[authController] register: koneksi Supabase gagal:', err.cause?.code || err.message);
            return res.status(503).json({ error: 'Layanan autentikasi sementara tidak dapat dijangkau. Coba lagi.' });
        }
        console.error('[authController] register: error tidak terduga:', err.message);
        return res.status(500).json({ error: 'Terjadi kesalahan sistem.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ error: 'Email dan password harus diisi' });
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return res.status(401).json({ error: 'Email atau password salah', details: error.message });
        res.json({
            message: 'Login berhasil',
            token: data.session?.access_token,
            user: data.user
        });
    } catch (err) {
        if (isNetworkError(err)) {
            console.error('[authController] login: koneksi Supabase gagal:', err.cause?.code || err.message);
            return res.status(503).json({ error: 'Layanan autentikasi sementara tidak dapat dijangkau. Coba lagi.' });
        }
        console.error('[authController] login: error tidak terduga:', err.message);
        return res.status(500).json({ error: 'Terjadi kesalahan sistem.' });
    }
};

exports.logout = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token tidak ditemukan.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const { user, error: userError } = await verifyTokenWithRetry(token);
        if (userError || !user) {
            return res.status(401).json({ error: 'Token tidak valid atau sudah kedaluwarsa.' });
        }

        const { error } = await supabase.auth.admin.signOut(token);
        if (error) return res.status(500).json({ error: 'Gagal melakukan logout.', details: error.message });

        console.log(`[Auth] Logout berhasil: ${user.email}`);
        res.json({ message: 'Logout berhasil. Sesi telah dicabut.' });
    } catch (err) {
        if (isNetworkError(err)) {
            console.error('[authController] logout: koneksi Supabase gagal:', err.cause?.code || err.message);
            return res.status(503).json({ error: 'Layanan autentikasi sementara tidak dapat dijangkau. Coba lagi.' });
        }
        console.error('[authController] logout: error tidak terduga:', err.message);
        return res.status(500).json({ error: 'Terjadi kesalahan sistem.' });
    }
};

exports.verify = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token tidak ditemukan' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const { user, error } = await verifyTokenWithRetry(token);
        if (error || !user) {
            return res.status(401).json({ error: 'Token tidak valid atau sudah kedaluwarsa' });
        }
        res.json({ valid: true, user: { id: user.id, email: user.email } });
    } catch (err) {
        if (isNetworkError(err)) {
            console.error('[authController] verify: koneksi Supabase gagal:', err.cause?.code || err.message);
            return res.status(503).json({ error: 'Layanan autentikasi sementara tidak dapat dijangkau. Coba lagi.' });
        }
        console.error('[authController] verify: error tidak terduga:', err.message);
        return res.status(500).json({ error: 'Terjadi kesalahan sistem.' });
    }
};
