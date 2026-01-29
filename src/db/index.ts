/**
 * Conexión a la base de datos Neon (PostgreSQL)
 * Usa drizzle-orm/neon-http para entornos serverless (Vercel).
 * Inicialización perezosa: no falla en build si falta DATABASE_URL; falla al primer uso si falta.
 * @see https://orm.drizzle.team/docs/connect-neon
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function normalizeConnectionString(value: string): string {
  let url = value.trim();
  if (url.toLowerCase().startsWith("psql ")) {
    url = url.slice(5).trim();
  }
  if ((url.startsWith("'") && url.endsWith("'")) || (url.startsWith('"') && url.endsWith('"'))) {
    url = url.slice(1, -1);
  }
  return url;
}

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDb() {
  if (dbInstance) return dbInstance;
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL no está definida. Configurala en Vercel (Settings → Environment Variables) o en .env.local.");
  }
  const connectionString = normalizeConnectionString(raw);
  const sql = neon(connectionString);
  dbInstance = drizzle(sql as any, { schema }) as ReturnType<typeof drizzle<typeof schema>>;
  return dbInstance;
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_, prop) {
    return (getDb() as unknown as Record<string, unknown>)[prop as string];
  },
});
