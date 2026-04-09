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
    const { error } = await supabase.auth.signOut();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Logout berhasil' });
};
