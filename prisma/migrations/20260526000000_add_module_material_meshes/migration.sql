-- AlterTable: Hapus primary key lama (composite) pada module_materials
ALTER TABLE "module_materials" DROP CONSTRAINT "module_materials_pkey";

-- AlterTable: Tambahkan kolom id dengan tipe UUID dan default value
ALTER TABLE "module_materials" ADD COLUMN "id" UUID NOT NULL DEFAULT gen_random_uuid();

-- AlterTable: Atur kolom id sebagai primary key baru
ALTER TABLE "module_materials" ADD CONSTRAINT "module_materials_pkey" PRIMARY KEY ("id");

-- CreateIndex: Tambahkan unique constraint untuk module_id + material_id
CREATE UNIQUE INDEX "module_materials_module_id_material_id_key" ON "module_materials"("module_id", "material_id");

-- CreateTable
CREATE TABLE "module_material_meshes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "module_material_id" UUID NOT NULL,
    "mesh_name" TEXT NOT NULL,

    CONSTRAINT "module_material_meshes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "module_material_meshes" ADD CONSTRAINT "module_material_meshes_module_material_id_fkey" FOREIGN KEY ("module_material_id") REFERENCES "module_materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- MigrateData: move existing mesh_name values into the new table
INSERT INTO "module_material_meshes" ("module_material_id", "mesh_name")
SELECT "id", "mesh_name"
FROM "module_materials"
WHERE "mesh_name" IS NOT NULL AND "mesh_name" != '';

-- DropColumn
ALTER TABLE "module_materials" DROP COLUMN IF EXISTS "mesh_name";
