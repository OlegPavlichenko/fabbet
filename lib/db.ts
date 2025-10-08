import { Pool } from "pg";
import type { Pool as PgPool } from "pg";

let pool: PgPool | null = null;

function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL!;
    // Для Supabase часто нужен SSL
    pool = new Pool({
      connectionString,
      max: 3,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

export async function query<T = any>(text: string, params?: any[]) {
  const client = await getPool().connect();
  try {
    const res = await client.query(text, params);
    return { rows: res.rows as T[] };
  } finally {
    client.release();
  }
}
