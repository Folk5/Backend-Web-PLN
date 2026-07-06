const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  await client.connect();
  console.log("Connected to DB.");

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "_CategoryToMaterial" (
          "A" UUID NOT NULL,
          "B" UUID NOT NULL
      );
    `);
    
    // Copy data
    const res = await client.query(`
      INSERT INTO "_CategoryToMaterial" ("A", "B")
      SELECT category_id, id FROM materials WHERE category_id IS NOT NULL;
    `);
    console.log(`Inserted ${res.rowCount} records into _CategoryToMaterial.`);

    // Add indexes
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "_CategoryToMaterial_AB_unique" ON "_CategoryToMaterial"("A", "B");`);
    await client.query(`CREATE INDEX IF NOT EXISTS "_CategoryToMaterial_B_index" ON "_CategoryToMaterial"("B");`);

    // Add constraints
    try {
      await client.query(`ALTER TABLE "_CategoryToMaterial" ADD CONSTRAINT "_CategoryToMaterial_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
      await client.query(`ALTER TABLE "_CategoryToMaterial" ADD CONSTRAINT "_CategoryToMaterial_B_fkey" FOREIGN KEY ("B") REFERENCES "materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
    } catch (e) {
      console.log("Constraints might already exist:", e.message);
    }
    
    console.log("Migration completed.");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await client.end();
  }
}
run();
