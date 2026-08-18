import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Vercel runs many concurrent serverless function instances, each holding
  // its own pool — keep this low and point DATABASE_URL at a connection
  // pooler (e.g. Neon's "-pooler" endpoint) in production to avoid
  // exhausting Postgres's connection limit.
  max: process.env.VERCEL ? 1 : 10,
});
export const db = drizzle(pool, { schema });

export * from "./schema";
export * from "./auth";
