-- 1. Buat Tabel Categories Baru
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    value TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('material', 'tool')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Isi data default kategori (Sesuai yang ada di UI Admin sebelumnya)
INSERT INTO public.categories (name, value, type) VALUES
-- Kategori Material
('Pengencang', 'pengencang', 'material'),
('Insulasi', 'insulasi', 'material'),
('Kabel', 'kabel', 'material'),
('Penyangga', 'penyangga', 'material'),
('Lainnya', 'lainnya', 'material'),
-- Kategori Tools
('Alat K3', 'k3', 'tool'),
('Alat Teknis', 'teknis', 'tool'),
('Pengukuran', 'pengukuran', 'tool');

-- 3. Hapus Kolom Lama & Tambah category_id di Materials
ALTER TABLE public.materials 
  DROP COLUMN IF EXISTS "categoryLabel",
  DROP COLUMN IF EXISTS "icon",
  DROP COLUMN IF EXISTS "shortDesc",
  DROP COLUMN IF EXISTS "specs",
  DROP COLUMN IF EXISTS "shape",
  DROP COLUMN IF EXISTS "color3d",
  ADD COLUMN "category_id" UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- 4. Hapus Kolom Lama & Tambah category_id di Tools
ALTER TABLE public.tools 
  DROP COLUMN IF EXISTS "category",
  DROP COLUMN IF EXISTS "categoryLabel",
  DROP COLUMN IF EXISTS "icon",
  DROP COLUMN IF EXISTS "procedure",
  ADD COLUMN "category_id" UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- 5. Izinkan akses publik (RLS - Opsional jika menggunakan anonymous reads, sesuaikan dengan setting Supabase Anda)
-- ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Bisa dibaca semua orang" ON public.categories FOR SELECT USING (true);
-- CREATE POLICY "Hanya bisa diubah lewat API Key (Service Role) / Auth" ON public.categories FOR ALL USING (true);
