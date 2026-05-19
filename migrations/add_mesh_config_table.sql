-- Migration: create mesh_config table
-- Stores per-mesh display name and visibility settings for module 3D assets.

CREATE TABLE IF NOT EXISTS public.mesh_config (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id    uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  mesh_original_name text NOT NULL,
  mesh_display_name  text,
  is_visible   boolean NOT NULL DEFAULT true,
  UNIQUE (module_id, mesh_original_name)
);

ALTER TABLE public.mesh_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable All for Backend" ON public.mesh_config USING (true) WITH CHECK (true);

GRANT ALL ON TABLE public.mesh_config TO anon;
GRANT ALL ON TABLE public.mesh_config TO authenticated;
GRANT ALL ON TABLE public.mesh_config TO service_role;
