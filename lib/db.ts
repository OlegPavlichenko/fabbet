import { Pool } from 'pg';
const connectionString = process.env.DATABASE_URL!;
export const pool = new Pool({ connectionString, max: 3 });
export async function query<T = any>(text: string, params?: any[]): Promise<{ rows: T[] }>{ 
  const client = await pool.connect();
  try { const res = await client.query(text, params); return { rows: res.rows }; }
  finally { client.release(); }
}
