-- ============================================================
-- FIX: RLS Policies lengkap untuk material_assets & module_assets
-- Tambahkan INSERT, UPDATE, DELETE policy
-- Jalankan di Supabase Dashboard → SQL Editor → RUN
-- ============================================================

-- ---- material_assets ----
-- Drop policy lama jika ada (aman jika tidak ada)
DROP POLICY IF EXISTS "Enable Read for public on material_assets" ON public.material_assets;
DROP POLICY IF EXISTS "Enable Insert for authenticated" ON public.material_assets;
DROP POLICY IF EXISTS "Enable Update for authenticated" ON public.material_assets;
DROP POLICY IF EXISTS "Enable Delete for authenticated" ON public.material_assets;

-- Buat ulang semua policy (USING true = tidak butuh auth untuk operasi CRUD)
CREATE POLICY "material_assets_select" ON public.material_assets FOR SELECT USING (true);
CREATE POLICY "material_assets_insert" ON public.material_assets FOR INSERT WITH CHECK (true);
CREATE POLICY "material_assets_update" ON public.material_assets FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "material_assets_delete" ON public.material_assets FOR DELETE USING (true);

-- ---- module_assets (fix jika juga belum punya policy penuh) ----
DROP POLICY IF EXISTS "Enable Read for public" ON public.module_assets;
DROP POLICY IF EXISTS "Enable Insert for authenticated" ON public.module_assets;
DROP POLICY IF EXISTS "Enable Update for authenticated" ON public.module_assets;
DROP POLICY IF EXISTS "Enable Delete for authenticated" ON public.module_assets;

CREATE POLICY "module_assets_select" ON public.module_assets FOR SELECT USING (true);
CREATE POLICY "module_assets_insert" ON public.module_assets FOR INSERT WITH CHECK (true);
CREATE POLICY "module_assets_update" ON public.module_assets FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "module_assets_delete" ON public.module_assets FOR DELETE USING (true);

-- ---- materials (pastikan juga punya policy penuh) ----
DROP POLICY IF EXISTS "Enable Read for public" ON public.materials;

CREATE POLICY "materials_select" ON public.materials FOR SELECT USING (true);
CREATE POLICY "materials_insert" ON public.materials FOR INSERT WITH CHECK (true);
CREATE POLICY "materials_update" ON public.materials FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "materials_delete" ON public.materials FOR DELETE USING (true);

-- ---- modules (pastikan juga punya policy penuh) ----
DROP POLICY IF EXISTS "Enable Read for public" ON public.modules;

CREATE POLICY "modules_select" ON public.modules FOR SELECT USING (true);
CREATE POLICY "modules_insert" ON public.modules FOR INSERT WITH CHECK (true);
CREATE POLICY "modules_update" ON public.modules FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "modules_delete" ON public.modules FOR DELETE USING (true);

-- ---- tools (pastikan juga punya policy penuh) ----
DROP POLICY IF EXISTS "Enable Read for public" ON public.tools;

CREATE POLICY "tools_select" ON public.tools FOR SELECT USING (true);
CREATE POLICY "tools_insert" ON public.tools FOR INSERT WITH CHECK (true);
CREATE POLICY "tools_update" ON public.tools FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "tools_delete" ON public.tools FOR DELETE USING (true);
