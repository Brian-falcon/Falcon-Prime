/**
 * Restablece la contraseña del admin a "admin123".
 * Ejecutar con: npx tsx scripts/reset-admin-password.ts
 * Requiere DATABASE_URL en .env.local (apuntando a tu base Neon).
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { generateId } from "../src/lib/utils";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Falta DATABASE_URL en .env.local");
  process.exit(1);
}

const ADMIN_EMAIL = "admin@falconprime.com";
const ADMIN_PASSWORD = "admin123";

async function reset() {
  const sql = neon(connectionString!);
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const id = generateId();

  // Insertar o actualizar contraseña si ya existe
  await sql`
    INSERT INTO admins (id, email, password_hash, name, created_at)
    VALUES (${id}, ${ADMIN_EMAIL}, ${passwordHash}, 'Admin', NOW())
    ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
  `;

  console.log("Listo. Credenciales del admin:");
  console.log("  Email:", ADMIN_EMAIL);
  console.log("  Contraseña:", ADMIN_PASSWORD);
}

reset().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
