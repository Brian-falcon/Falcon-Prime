/**
 * Conexión a la base de datos Neon (PostgreSQL)
 * Usa drizzle-orm/neon-http para entornos serverless (Vercel).
 * @see https://orm.drizzle.team/docs/connect-neon
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function normalizeConnectionString(value: string): string {
  let url = value.trim();
  // Quitar prefijo "psql " o "psql '" si se copió desde la consola de Neon
  if (url.toLowerCase().startsWith("psql ")) {
    url = url.slice(5).trim();
  }
  // Quitar comillas simples o dobles al inicio y final
  if ((url.startsWith("'") && url.endsWith("'")) || (url.startsWith('"') && url.endsWith('"'))) {
    url = url.slice(1, -1);
  }
  return url;
}

const raw = process.env.DATABASE_URL;
if (!raw) {
  throw new Error("DATABASE_URL no está definida en las variables de entorno.");
}

const connectionString = normalizeConnectionString(raw);
const sql = neon(connectionString);
// Assertión de tipo: incompatibilidad de genéricos entre @neondatabase/serverless y drizzle-orm; en runtime son compatibles
export const db = drizzle(sql as any, { schema });
