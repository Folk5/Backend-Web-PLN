-- Migration: Drop static counts from modules table
-- Description: Removes the static materialCount and equipmentCount columns since they are now calculated dynamically.

ALTER TABLE public.modules
  DROP COLUMN IF EXISTS "materialCount",
  DROP COLUMN IF EXISTS "equipmentCount";
