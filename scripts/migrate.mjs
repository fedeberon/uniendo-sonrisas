import "dotenv/config";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Pool } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.log("[migrate] DATABASE_URL no está configurada; se omiten las migraciones.");
  process.exit(0);
}

const pool = new Pool({ connectionString: databaseUrl });
const migrationsDir = join(process.cwd(), "db", "migrations");

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const appliedResult = await client.query("SELECT version FROM schema_migrations");
    const applied = new Set(appliedResult.rows.map((row) => row.version));
    const files = readdirSync(migrationsDir).filter((file) => file.endsWith(".sql")).sort();

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`[migrate] ${file} ya estaba aplicada.`);
        continue;
      }

      const sql = readFileSync(join(migrationsDir, file), "utf8");
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO schema_migrations (version) VALUES ($1)", [file]);
        await client.query("COMMIT");
        console.log(`[migrate] ${file} aplicada correctamente.`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((error) => {
  console.error("[migrate] Error ejecutando migraciones:", error);
  process.exit(1);
});
