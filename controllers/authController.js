const supabase = require('../config/supabase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_pln_2026_pusdiklat';

exports.register = async (req, res) => {
    const { email, password, name, unit } = req.body || {};

    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, dan nama wajib diisi.' });
    }

    try {
        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Simpan ke tabel public.users
        const { data, error } = await supabase
            .from('users')
            .insert([{
                email,
                password_hash: passwordHash,
                name,
                unit: unit || '-',
                status: 'Offline'
            }])
            .select('id, email, name, unit, status, created_at')
            .single();

        if (error) {
            if (error.code === '23505') { // Unique violation
                return res.status(400).json({ error: 'Email sudah terdaftar.' });
            }
            return res.status(400).json({ error: error.message });
        }

        res.json({
            message: 'Registrasi berhasil.',
            user: data
        });
    } catch (err) {
        console.error('[authController] register: error tidak terduga:', err.message);
        return res.status(500).json({ error: 'Terjadi kesalahan sistem.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ error: 'Email dan password wajib diisi.' });
    }

    try {
        // Ambil user dari database
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(401).json({ error: 'Email atau password salah.' });
        }

        // Bandingkan password
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ error: 'Email atau password salah.' });
        }

        // Set status Online di database
        await supabase
            .from('users')
            .update({ status: 'Online' })
            .eq('id', user.id);

        user.status = 'Online';

        // Buat JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, unit: user.unit, status: user.status },
            SECRET,
            { expiresIn: '24h' }
        );

        // Hapus password_hash dari response
        delete user.password_hash;

        res.json({
            message: 'Login berhasil',
            token: token,
            user: user
        });
    } catch (err) {
        console.error('[authController] login: error tidak terduga:', err.message);
        return res.status(500).json({ error: 'Terjadi kesalahan sistem.' });
    }
};

exports.logout = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.json({ message: 'Logout berhasil. Sesi klien telah dicabut.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET);
        
        // Update status menjadi Offline
        await supabase
            .from('users')
            .update({ status: 'Offline' })
            .eq('id', decoded.id);
            
    } catch (err) {
        // Token mungkin sudah invalid, abaikan saja
    }

    res.json({ message: 'Logout berhasil. Sesi klien telah dicabut.' });
};

exports.verify = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token tidak ditemukan' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET);
        res.json({ valid: true, user: decoded });
    } catch (err) {
        return res.status(401).json({ error: 'Token tidak valid atau sudah kedaluwarsa' });
    }
};
