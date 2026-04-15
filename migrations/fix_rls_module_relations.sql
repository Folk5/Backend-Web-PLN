-- ============================================================
-- MIGRATION: RLS Policies + Pastikan kolom quantity ada
-- pada module_materials & module_tools
-- Jalankan di Supabase Dashboard → SQL Editor → RUN
-- ============================================================

-- 1. Pastikan kolom quantity ada di module_materials (jika belum ada)
ALTER TABLE public.module_materials
ADD COLUMN IF NOT EXISTS quantity integer DEFAULT 1;

-- 2. Pastikan kolom UNIQUE constraint ada (aman jika duplikat)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'module_materials_module_id_material_id_key'
    ) THEN
        ALTER TABLE public.module_materials
        ADD CONSTRAINT module_materials_module_id_material_id_key UNIQUE (module_id, material_id);
    END IF;
END $$;

-- 3. Pastikan UNIQUE constraint di module_tools ada
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'module_tools_module_id_tool_id_key'
    ) THEN
        ALTER TABLE public.module_tools
        ADD CONSTRAINT module_tools_module_id_tool_id_key UNIQUE (module_id, tool_id);
    END IF;
END $$;

-- ---- RLS: module_materials ----
ALTER TABLE public.module_materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable Read for public" ON public.module_materials;
DROP POLICY IF EXISTS "module_materials_select" ON public.module_materials;
DROP POLICY IF EXISTS "module_materials_insert" ON public.module_materials;
DROP POLICY IF EXISTS "module_materials_update" ON public.module_materials;
DROP POLICY IF EXISTS "module_materials_delete" ON public.module_materials;

CREATE POLICY "module_materials_select" ON public.module_materials FOR SELECT USING (true);
CREATE POLICY "module_materials_insert" ON public.module_materials FOR INSERT WITH CHECK (true);
CREATE POLICY "module_materials_update" ON public.module_materials FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "module_materials_delete" ON public.module_materials FOR DELETE USING (true);

-- ---- RLS: module_tools ----
ALTER TABLE public.module_tools ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable Read for public" ON public.module_tools;
DROP POLICY IF EXISTS "module_tools_select" ON public.module_tools;
DROP POLICY IF EXISTS "module_tools_insert" ON public.module_tools;
DROP POLICY IF EXISTS "module_tools_update" ON public.module_tools;
DROP POLICY IF EXISTS "module_tools_delete" ON public.module_tools;

CREATE POLICY "module_tools_select" ON public.module_tools FOR SELECT USING (true);
CREATE POLICY "module_tools_insert" ON public.module_tools FOR INSERT WITH CHECK (true);
CREATE POLICY "module_tools_update" ON public.module_tools FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "module_tools_delete" ON public.module_tools FOR DELETE USING (true);
