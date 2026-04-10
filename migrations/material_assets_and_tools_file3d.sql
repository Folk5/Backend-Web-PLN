-- ============================================================
-- MIGRATION: Tambah tabel material_assets dan kolom file3d di tools
-- Jalankan di Supabase Dashboard → SQL Editor → RUN
-- ============================================================

-- 1. Tambah tabel material_assets untuk menyimpan varian 3D dari tiap material
CREATE TABLE IF NOT EXISTS public.material_assets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    material_id text REFERENCES public.materials(id) ON DELETE CASCADE,
    name text NOT NULL,
    file text NOT NULL
);

-- Mengaktifkan akses baca publik
ALTER TABLE public.material_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable Read for public on material_assets" ON public.material_assets FOR SELECT USING (true);


-- 2. Tambah kolom file3d ke tabel tools (Peralatan) karena tidak memiliki varian
ALTER TABLE public.tools 
ADD COLUMN IF NOT EXISTS file3d text;
