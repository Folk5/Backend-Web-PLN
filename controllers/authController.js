const prisma = require('../config/db');
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

    // Simpan ke tabel users
    const user = await prisma.user.create({
      data: {
        email,
        password_hash: passwordHash,
        name,
        unit: unit || '-',
        status: 'Offline',
      },
      select: {
        id: true,
        email: true,
        name: true,
        unit: true,
        status: true,
        created_at: true,
      },
    });

    res.json({
      message: 'Registrasi berhasil.',
      user,
    });
  } catch (err) {
    if (err.code === 'P2002') {
      // Unique constraint failed on the fields: (`email`)
      return res.status(400).json({ error: 'Email sudah terdaftar.' });
    }
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
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Email atau password salah.' });
    }

    // Bandingkan password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Email atau password salah.' });
    }

    // Set status Online di database
    await prisma.user.update({
      where: { id: user.id },
      data: { status: 'Online' },
    });

    user.status = 'Online';

    // Buat JWT (Masa berlaku diperpendek menjadi 2 jam untuk keamanan)
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, unit: user.unit, status: user.status },
      SECRET,
      { expiresIn: '2h' }
    );

    // Hapus password_hash dari response
    delete user.password_hash;

    res.json({
      message: 'Login berhasil',
      token: token,
      user: user,
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
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET);
    } catch (e) {
      // Jika token expired, kita coba decode saja tanpa verifikasi signature/waktu
      // agar tetap bisa merubah status menjadi Offline
      decoded = jwt.decode(token);
    }

    if (decoded && decoded.id) {
      await prisma.user.update({
        where: { id: decoded.id },
        data: { status: 'Offline' },
      });
    }
  } catch (err) {
    console.error('Logout error:', err.message);
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
    
    // Ambil data terbaru dari database agar profil tidak mandek di data token lama
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, unit: true, status: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'User tidak ditemukan' });
    }

    res.json({ valid: true, user: user });
  } catch (err) {
    return res.status(401).json({ error: 'Token tidak valid atau sudah kedaluwarsa' });
  }
};
