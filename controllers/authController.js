const supabase = require('../config/supabase');

exports.register = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email dan password harus diisi' });
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) return res.status(400).json({ error: error.message });
    
    res.json({
        message: 'Registrasi berhasil. Silakan cek email Anda jika verifikasi diaktifkan.',
        user: data.user
    });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email dan password harus diisi' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) return res.status(401).json({ error: 'Email atau password salah', details: error.message });
    
    res.json({
        message: 'Login berhasil',
        token: data.session?.access_token,
        user: data.user
    });
};

exports.logout = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token tidak ditemukan.' });
    }

    const token = authHeader.split(' ')[1];

    // Verifikasi token valid sebelum dicabut
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
        return res.status(401).json({ error: 'Token tidak valid atau sudah kedaluwarsa.' });
    }

    // Cabut sesi dengan melewatkan JWT token langsung (bukan userId)
    const { error } = await supabase.auth.admin.signOut(token);
    if (error) return res.status(500).json({ error: 'Gagal melakukan logout.', details: error.message });

    console.log(`[Auth] Logout berhasil: ${user.email}`);
    res.json({ message: 'Logout berhasil. Sesi telah dicabut.' });
};

exports.verify = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token tidak ditemukan' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return res.status(401).json({ error: 'Token tidak valid atau sudah kedaluwarsa' });
    }

    res.json({ valid: true, user: { id: user.id, email: user.email } });
};
