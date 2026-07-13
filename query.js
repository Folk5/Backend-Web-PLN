const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:postgres@localhost:5432/pln_db?schema=public' });
async function main() {
  await client.connect();
  const res = await client.query("SELECT * FROM \"ModuleMaterial\" WHERE \"moduleId\" = 'f3ed4576-c0a0-4601-9f52-db483eb87cc0'");
  console.log('Result length:', res.rows.length);
  res.rows.forEach(r => console.log('Material ID:', r.materialId, 'meshes:', r.meshes));
}
main().catch(console.error).finally(() => client.end());
