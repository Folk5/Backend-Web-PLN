const prisma = require('../config/db');

exports.getKatalog = async (req, res) => {
  try {
    const data = await prisma.katalogInstruktur.findMany({
      include: { jadwal: true },
      orderBy: { nama_instruktur: 'asc' }
    });

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const enrichedData = data.map(instruktur => {
      let total_jp_bulan_ini = 0;
      let total_jp_5_tahun = 0;
      
      instruktur.jadwal.forEach(j => {
        const d = new Date(j.tanggal_mulai);
        const y = d.getFullYear();
        const m = d.getMonth();
        
        if (y === currentYear && m === currentMonth) {
          total_jp_bulan_ini += j.jumlah_jp;
        }
        
        // 5 tahun (termasuk tahun ini dan 4 tahun sebelumnya)
        if (y >= currentYear - 4 && y <= currentYear) {
          total_jp_5_tahun += j.jumlah_jp;
        }
      });
      
      // Hapus properti jadwal dari respons jika tidak diperlukan (opsional)
      const { jadwal, ...rest } = instruktur;
      
      return {
        ...rest,
        total_jp_bulan_ini,
        total_jp_5_tahun
      };
    });

    res.json(enrichedData);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data' });
  }
};

exports.createKatalog = async (req, res) => {
  try {
    if (req.user.role !== 'UPDL') {
      return res.status(403).json({ error: 'Akses ditolak. Hanya user UPDL yang dapat menambah data.' });
    }
    const nipValue = req.body.nip;
    if (!nipValue || !nipValue.trim()) {
      return res.status(400).json({ error: 'NIP tidak boleh kosong' });
    }
    const data = await prisma.katalogInstruktur.create({
      data: {
        nip: nipValue.trim(),
        nama_instruktur: req.body.nama_instruktur,
        status: req.body.status,
        keahlian: req.body.keahlian || null,
        unit: req.body.unit || null
      }
    });
    res.json(data);
  } catch (error) {
    console.error('[createKatalog] Error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'NIP sudah terdaftar. Gunakan NIP yang berbeda.' });
    }
    res.status(500).json({ error: 'Gagal menambah data', detail: error.message });
  }
};

exports.updateKatalog = async (req, res) => {
  try {
    if (req.user.role !== 'UPDL') {
      return res.status(403).json({ error: 'Akses ditolak. Hanya user UPDL yang dapat mengubah data.' });
    }
    const nipValue = req.body.nip;
    if (!nipValue || !nipValue.trim()) {
      return res.status(400).json({ error: 'NIP tidak boleh kosong' });
    }
    const data = await prisma.katalogInstruktur.update({
      where: { id: req.params.id },
      data: {
        nip: nipValue.trim(),
        nama_instruktur: req.body.nama_instruktur,
        status: req.body.status,
        keahlian: req.body.keahlian || null,
        unit: req.body.unit || null
      }
    });
    res.json(data);
  } catch (error) {
    console.error('[updateKatalog] Error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'NIP sudah digunakan oleh instruktur lain.' });
    }
    res.status(500).json({ error: 'Gagal update data', detail: error.message });
  }
};

exports.deleteKatalog = async (req, res) => {
  try {
    if (req.user.role !== 'UPDL') {
      return res.status(403).json({ error: 'Akses ditolak. Hanya user UPDL yang dapat menghapus data.' });
    }
    await prisma.katalogInstruktur.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Gagal hapus data' });
  }
};

// Jadwal Instruktur
exports.getJadwal = async (req, res) => {
  try {
    const data = await prisma.jadwalInstruktur.findMany({
      include: { katalog: true },
      orderBy: { tanggal_mulai: 'desc' }
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data' });
  }
};

exports.createJadwal = async (req, res) => {
  try {
    if (req.user.role !== 'UPDL') {
      return res.status(403).json({ error: 'Akses ditolak. Hanya user UPDL yang dapat menambah jadwal.' });
    }
    const data = await prisma.jadwalInstruktur.create({
      data: {
        katalog_id: req.body.katalog_id,
        updl: req.body.updl,
        mata_pelajaran: req.body.mata_pelajaran,
        tanggal_mulai: new Date(req.body.tanggal_mulai),
        tanggal_selesai: new Date(req.body.tanggal_selesai),
        jumlah_jp: parseInt(req.body.jumlah_jp || 0)
      }
    });
    res.json(data);
  } catch (error) {
    console.error('[createJadwal] Error:', error);
    res.status(500).json({ error: 'Gagal menambah data', detail: error.message });
  }
};

exports.updateJadwal = async (req, res) => {
  try {
    if (req.user.role !== 'UPDL') {
      return res.status(403).json({ error: 'Akses ditolak. Hanya user UPDL yang dapat mengubah jadwal.' });
    }
    const data = await prisma.jadwalInstruktur.update({
      where: { id: req.params.id },
      data: {
        katalog_id: req.body.katalog_id,
        updl: req.body.updl,
        mata_pelajaran: req.body.mata_pelajaran,
        tanggal_mulai: new Date(req.body.tanggal_mulai),
        tanggal_selesai: new Date(req.body.tanggal_selesai),
        jumlah_jp: parseInt(req.body.jumlah_jp || 0)
      }
    });
    res.json(data);
  } catch (error) {
    console.error('[updateJadwal] Error:', error);
    res.status(500).json({ error: 'Gagal update data', detail: error.message });
  }
};

exports.deleteJadwal = async (req, res) => {
  try {
    if (req.user.role !== 'UPDL') {
      return res.status(403).json({ error: 'Akses ditolak. Hanya user UPDL yang dapat menghapus jadwal.' });
    }
    await prisma.jadwalInstruktur.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Gagal hapus data' });
  }
};
