const supabase = require('../config/supabase');
const { isNetworkError } = require('../utils/supabaseAuth');

// Ambil semua pengguna
exports.getAllUsers = async (req, res) => {
    try {
        const { data, error } = await supabase.auth.admin.listUsers();
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        
        // Memformat data balikan
        const users = data.users.map(u => ({
            id: u.id,
            email: u.email,
            name: u.user_metadata?.name || 'Tanpa Nama',
            unit: u.user_metadata?.unit || '-',
            status: u.user_metadata?.status || 'Aktif',
            created_at: u.created_at
        }));
        
        res.json({ users });
    } catch (err) {
        if (isNetworkError(err)) {
            console.error('[userController] getAllUsers: koneksi Supabase gagal:', err.cause?.code || err.message);
            return res.status(503).json({ error: 'Layanan sementara tidak dapat dijangkau.' });
        }
        console.error('[userController] getAllUsers: error tidak terduga:', err.message);
        return res.status(500).json({ error: 'Terjadi kesalahan sistem.' });
    }
};

// Buat pengguna baru
exports.createUser = async (req, res) => {
    const { email, password, name, unit, status } = req.body;
    
    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, dan nama wajib diisi.' });
    }
    
    try {
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                name,
                unit: unit || '-',
                status: status || 'Aktif'
            }
        });
        
        if (error) return res.status(400).json({ error: error.message });
        
        res.status(201).json({
            message: 'Pengguna berhasil dibuat',
            user: {
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.name,
                unit: data.user.user_metadata?.unit,
                status: data.user.user_metadata?.status
            }
        });
    } catch (err) {
        if (isNetworkError(err)) {
            return res.status(503).json({ error: 'Layanan sementara tidak dapat dijangkau.' });
        }
        console.error('[userController] createUser: error tidak terduga:', err.message);
        return res.status(500).json({ error: 'Terjadi kesalahan sistem.' });
    }
};

// Update pengguna
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, unit, status, password } = req.body;
    
    const updatePayload = {
        user_metadata: {}
    };
    
    if (name) updatePayload.user_metadata.name = name;
    if (unit) updatePayload.user_metadata.unit = unit;
    if (status) updatePayload.user_metadata.status = status;
    if (password) updatePayload.password = password; // Reset password jika ada
    
    try {
        const { data, error } = await supabase.auth.admin.updateUserById(id, updatePayload);
        if (error) return res.status(400).json({ error: error.message });
        
        res.json({
            message: 'Pengguna berhasil diperbarui',
            user: {
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.name,
                unit: data.user.user_metadata?.unit,
                status: data.user.user_metadata?.status
            }
        });
    } catch (err) {
        if (isNetworkError(err)) {
            return res.status(503).json({ error: 'Layanan sementara tidak dapat dijangkau.' });
        }
        console.error('[userController] updateUser: error tidak terduga:', err.message);
        return res.status(500).json({ error: 'Terjadi kesalahan sistem.' });
    }
};

// Hapus pengguna
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    
    try {
        const { error } = await supabase.auth.admin.deleteUser(id);
        if (error) return res.status(400).json({ error: error.message });
        
        res.json({ message: 'Pengguna berhasil dihapus' });
    } catch (err) {
        if (isNetworkError(err)) {
            return res.status(503).json({ error: 'Layanan sementara tidak dapat dijangkau.' });
        }
        console.error('[userController] deleteUser: error tidak terduga:', err.message);
        return res.status(500).json({ error: 'Terjadi kesalahan sistem.' });
    }
};
