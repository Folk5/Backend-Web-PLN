-- ============================================================
-- MIGRATION: Tambah kolom `status` ke tabel modules
-- Jalankan di Supabase Dashboard → SQL Editor → RUN
-- ============================================================

-- 1. Tambah kolom status (default 'Aktif' agar data lama tidak null)
ALTER TABLE public.modules 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'Aktif';

-- 2. Pastikan hanya nilai yang valid yang bisa dimasukkan
ALTER TABLE public.modules 
ADD CONSTRAINT modules_status_check 
CHECK (status IN ('Aktif', 'Draft', 'Nonaktif'));

-- ============================================================
-- VERIFIKASI: Jalankan ini untuk cek hasilnya
-- ============================================================
-- SELECT id, title, status FROM public.modules;
