-- Instruksi: Silakan salin semua kode di bawah ini dan paste pada menu "SQL Editor" di dasbor proyek Supabase Anda.
-- Lalu tekan tombol "RUN" di pojok kanan bawah. Skrip ini akan membuat tabel-tabel secara otomatis.

-- 1. Table untuk Modules
CREATE TABLE public.modules (
    id text PRIMARY KEY,
    title text NOT NULL,
    description text,
    "materialCount" integer DEFAULT 0,
    "equipmentCount" integer DEFAULT 0,
    image text
);

-- 2. Table untuk Module Assets (Foreign Key ke modules)
CREATE TABLE public.module_assets (
    id text PRIMARY KEY,
    module_id text REFERENCES public.modules(id) ON DELETE CASCADE,
    name text NOT NULL,
    file text NOT NULL
);

-- 3. Table untuk Tools
CREATE TABLE public.tools (
    id text PRIMARY KEY,
    name text NOT NULL,
    category text,
    "categoryLabel" text,
    icon text,
    "bgGradient" text,
    description text,
    standard text,
    status text,
    procedure jsonb DEFAULT '[]'::jsonb
);

-- 4. Table untuk Materials
CREATE TABLE public.materials (
    id text PRIMARY KEY,
    name text NOT NULL,
    code text,
    "categoryLabel" text,
    icon text,
    "bgGradient" text,
    "shortDesc" text,
    description text,
    specs jsonb DEFAULT '{}'::jsonb,
    shape text,
    color3d integer
);

-- =======================================================================
-- MENGIZINKAN PEMBACAAN DARI PUBLIC API (Mematikan Proteksi RLS Read)
-- =======================================================================

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable Read for public" ON public.modules FOR SELECT USING (true);

ALTER TABLE public.module_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable Read for public" ON public.module_assets FOR SELECT USING (true);

ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable Read for public" ON public.tools FOR SELECT USING (true);

ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable Read for public" ON public.materials FOR SELECT USING (true);
