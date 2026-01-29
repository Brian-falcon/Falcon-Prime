/**
 * Conexión a la base de datos Neon (PostgreSQL)
 * Usa drizzle-orm/neon-http para entornos serverless (Vercel).
 * @see https://orm.drizzle.team/docs/connect-neon
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL no está definida en las variables de entorno.");
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
