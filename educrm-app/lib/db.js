import { Pool } from "pg";

// Reuse a single pool across hot reloads in dev.
const g = globalThis;
export const pool = g.__pgPool || new Pool({ connectionString: process.env.DATABASE_URL, max: 10 });
if (!g.__pgPool) g.__pgPool = pool;

export function q(text, params) {
  return pool.query(text, params);
}
