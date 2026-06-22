const prisma = require('../config/db');
const bcrypt = require('bcrypt');

// Ambil semua pengguna
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, unit: true, status: true, created_at: true, last_active_at: true },
    });

    const THRESHOLD = 30 * 60 * 1000; // 30 menit
    const now = new Date();

    const updatedUsers = users.map(user => {
      if (user.status === 'Online' && (now - new Date(user.last_active_at)) > THRESHOLD) {
        user.status = 'Offline';
        // Asynchronously update database to keep it consistent
        prisma.user.update({ where: { id: user.id }, data: { status: 'Offline' } }).catch(() => {});
      }
      return user;
    });

    updatedUsers.sort((a, b) => {
      // 1. Online di atas Offline
      if (a.status === 'Online' && b.status !== 'Online') return -1;
      if (a.status !== 'Online' && b.status === 'Online') return 1;
      
      // 2. Jika status sama, urutkan berdasarkan abjad A-Z (name)
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    res.json({ users: updatedUsers });
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

    const user = await prisma.user.create({
      data: {
        email,
        password_hash: passwordHash,
        name,
        unit: unit || '-',
        status: 'Offline',
      },
      select: { id: true, email: true, name: true, unit: true, status: true, created_at: true },
    });

    res.status(201).json({
      message: 'Pengguna berhasil dibuat',
      user,
    });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'Email sudah terdaftar.' });
    }
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

    const user = await prisma.user.update({
      where: { id },
      data: updatePayload,
      select: { id: true, email: true, name: true, unit: true, status: true, created_at: true },
    });

    res.json({
      message: 'Pengguna berhasil diperbarui',
      user,
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
    await prisma.user.delete({
      where: { id },
    });

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
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password_hash: true },
    });

    if (!user) {
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
    await prisma.user.update({
      where: { id: userId },
      data: { password_hash: newPasswordHash },
    });

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
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, email, unit: unit || '-' },
      select: { id: true, email: true, name: true, unit: true, status: true },
    });

    res.json({ message: 'Profil berhasil diperbarui', user });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'Email sudah terdaftar.' });
    }
    console.error('[userController] updateProfile:', err.message);
    return res.status(500).json({ error: 'Terjadi kesalahan sistem.' });
  }
};
