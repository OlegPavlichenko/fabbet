import { Pool } from "pg";

let pool: Pool | null = null;

function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL!;
    // Для Supabase обычно требуется SSL
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
