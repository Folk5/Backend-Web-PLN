const supabase = require('../config/supabase');
const bcrypt = require('bcrypt');

// Ambil semua pengguna
exports.getAllUsers = async (req, res) => {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('id, email, name, unit, status, created_at');
            
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        
        res.json({ users });
    } catch (err) {
        console.error('[userController] getAllUsers: error tidak terduga:', err.message);
        return res.status(500).json({ error: 'Terjadi kesalahan sistem.' });
    }
};

// Buat pengguna baru (Dari Admin Panel)
exports.createUser = async (req, res) => {
    const { email, password, name, unit } = req.body;
    
    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, dan nama wajib diisi.' });
    }
    
    try {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

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
            if (error.code === '23505') return res.status(400).json({ error: 'Email sudah terdaftar.' });
            return res.status(400).json({ error: error.message });
        }
        
        res.status(201).json({
            message: 'Pengguna berhasil dibuat',
            user: data
        });
    } catch (err) {
        console.error('[userController] createUser: error tidak terduga:', err.message);
        return res.status(500).json({ error: 'Terjadi kesalahan sistem.' });
    }
};

// Update pengguna
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, unit, password } = req.body;
    
    const updatePayload = {};
    
    if (name) updatePayload.name = name;
    if (unit) updatePayload.unit = unit;
    
    try {
        if (password) {
            const saltRounds = 10;
            updatePayload.password_hash = await bcrypt.hash(password, saltRounds);
        }
        
        const { data, error } = await supabase
            .from('users')
            .update(updatePayload)
            .eq('id', id)
            .select('id, email, name, unit, status, created_at')
            .single();
            
        if (error) return res.status(400).json({ error: error.message });
        
        res.json({
            message: 'Pengguna berhasil diperbarui',
            user: data
        });
    } catch (err) {
        console.error('[userController] updateUser: error tidak terduga:', err.message);
        return res.status(500).json({ error: 'Terjadi kesalahan sistem.' });
    }
};

// Hapus pengguna
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    
    try {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id);
            
        if (error) return res.status(400).json({ error: error.message });
        
        res.json({ message: 'Pengguna berhasil dihapus' });
    } catch (err) {
        console.error('[userController] deleteUser: error tidak terduga:', err.message);
        return res.status(500).json({ error: 'Terjadi kesalahan sistem.' });
    }
};
