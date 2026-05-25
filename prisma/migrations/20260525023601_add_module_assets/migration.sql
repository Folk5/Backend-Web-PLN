-- CreateTable
CREATE TABLE "module_assets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "module_id" UUID NOT NULL,
    "name" TEXT,
    "file" TEXT,

    CONSTRAINT "module_assets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "module_assets" ADD CONSTRAINT "module_assets_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
