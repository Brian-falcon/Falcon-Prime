/**
 * Conexión a la base de datos Neon (PostgreSQL)
 * Usa drizzle-orm/neon-http para entornos serverless (Vercel).
 * @see https://orm.drizzle.team/docs/connect-neon
 */
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL no está definida en las variables de entorno.");
}

export const db = drizzle(connectionString, { schema });
