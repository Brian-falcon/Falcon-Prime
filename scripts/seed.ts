/**
 * Script de seed: crea categorías iniciales y un admin.
 * Ejecutar con: npx tsx scripts/seed.ts
 * Requiere DATABASE_URL, ADMIN_EMAIL y ADMIN_PASSWORD en .env.local (o env).
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import bcrypt from "bcryptjs";
import * as schema from "../src/db/schema";
import { generateId } from "../src/lib/utils";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Falta DATABASE_URL en el entorno.");
  process.exit(1);
}

const adminEmail = process.env.ADMIN_EMAIL ?? "admin@falconprime.com";
const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";

async function seed() {
  const sql = neon(connectionString!);
  const db = drizzle(sql, { schema });

  const categoryIds = {
    ropa: generateId(),
    calzado: generateId(),
    accesorios: generateId(),
  };

  await db.insert(schema.categories).values([
    { id: categoryIds.ropa, name: "Ropa", slug: "ropa" },
    { id: categoryIds.calzado, name: "Calzado", slug: "calzado" },
    { id: categoryIds.accesorios, name: "Accesorios", slug: "accesorios" },
  ]).onConflictDoNothing({ target: schema.categories.slug });

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const adminId = generateId();
  await db.insert(schema.admins).values({
    id: adminId,
    email: adminEmail.toLowerCase(),
    passwordHash,
    name: "Admin",
  }).onConflictDoNothing({ target: schema.admins.email });

  console.log("Seed completado.");
  console.log("Categorías: Ropa, Calzado, Accesorios");
  console.log("Admin:", adminEmail, "| Contraseña:", adminPassword);
}

seed().catch((e) => {
  console.error("Error en seed:", e);
  process.exit(1);
});
