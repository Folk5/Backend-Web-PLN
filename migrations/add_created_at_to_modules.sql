-- =====================================================
-- MIGRASI: Tambah kolom created_at & updated_at
-- Tabel  : modules, materials, tools
-- Tanggal: 2026-04-27
-- Cara pakai:
--   1. Buka Supabase Dashboard → SQL Editor
--   2. Copy-paste seluruh isi file ini
--   3. Klik "Run"
-- =====================================================

-- ── 1. Tabel: modules ─────────────────────────────────
ALTER TABLE public.modules
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ── 2. Tabel: materials ───────────────────────────────
ALTER TABLE public.materials
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ── 3. Tabel: tools ───────────────────────────────────
ALTER TABLE public.tools
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ── 4. Trigger: auto-update kolom updated_at ──────────
-- Buat fungsi trigger (hanya sekali, berlaku untuk semua tabel)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Pasang trigger ke tabel modules
DROP TRIGGER IF EXISTS trg_modules_updated_at ON public.modules;
CREATE TRIGGER trg_modules_updated_at
    BEFORE UPDATE ON public.modules
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Pasang trigger ke tabel materials
DROP TRIGGER IF EXISTS trg_materials_updated_at ON public.materials;
CREATE TRIGGER trg_materials_updated_at
    BEFORE UPDATE ON public.materials
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Pasang trigger ke tabel tools
DROP TRIGGER IF EXISTS trg_tools_updated_at ON public.tools;
CREATE TRIGGER trg_tools_updated_at
    BEFORE UPDATE ON public.tools
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Verifikasi ────────────────────────────────────────
-- Jalankan query ini setelah migrasi untuk memastikan kolom berhasil ditambahkan:
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name IN ('modules', 'materials', 'tools')
--   AND column_name IN ('created_at', 'updated_at')
-- ORDER BY table_name, column_name;
