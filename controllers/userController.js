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
      .insert([
        {
          email,
          password_hash: passwordHash,
          name,
          unit: unit || '-',
          status: 'Offline',
        },
      ])
      .select('id, email, name, unit, status, created_at')
      .single();

    if (error) {
      if (error.code === '23505') return res.status(400).json({ error: 'Email sudah terdaftar.' });
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: 'Pengguna berhasil dibuat',
      user: data,
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
      user: data,
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
    const { error } = await supabase.from('users').delete().eq('id', id);

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: 'Pengguna berhasil dihapus' });
  } catch (err) {
    console.error('[userController] deleteUser: error tidak terduga:', err.message);
    return res.status(500).json({ error: 'Terjadi kesalahan sistem.' });
  }
};

// Ubah Password (Untuk user yang sedang login)
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id; // didapat dari requireAuth middleware

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Password lama dan password baru wajib diisi.' });
  }

  try {
    // 1. Ambil data user beserta password_hash saat ini
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', userId)
      .single();

    if (fetchError || !user) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
    }

    // 2. Verifikasi password lama
    const match = await bcrypt.compare(oldPassword, user.password_hash);
    if (!match) {
      return res.status(400).json({ error: 'Password lama tidak cocok.' });
    }

    // 3. Hash password baru
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // 4. Update database
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: newPasswordHash })
      .eq('id', userId);

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    res.json({ message: 'Password berhasil diubah!' });
  } catch (err) {
    console.error('[userController] changePassword: error tidak terduga:', err.message);
    return res.status(500).json({ error: 'Terjadi kesalahan sistem.' });
  }
};

// Ubah Profil Sendiri
exports.updateProfile = async (req, res) => {
  const { name, email, unit } = req.body;
  const userId = req.user.id;

  if (!name || !email) {
    return res.status(400).json({ error: 'Nama dan email wajib diisi.' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .update({ name, email, unit: unit || '-' })
      .eq('id', userId)
      .select('id, email, name, unit, status')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Opsional: Buat token baru jika payload penting berubah (spt email/nama)
    // Kita abaikan dulu jika tidak perlu merefresh token untuk simplisitas.

    res.json({ message: 'Profil berhasil diperbarui', user: data });
  } catch (err) {
    console.error('[userController] updateProfile:', err.message);
    return res.status(500).json({ error: 'Terjadi kesalahan sistem.' });
  }
};
