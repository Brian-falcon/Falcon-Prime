/**
 * Autenticación simple para el panel de administración.
 * Usa cookies para mantener la sesión (solo acceso a /admin).
 */
import { cookies } from "next/headers";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "falcon_admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

export async function setAdminSession(adminId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, adminId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function getAdminSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  if (!value) return null;
  const admin = await db.query.admins.findFirst({
    where: eq(admins.id, value),
    columns: { id: true },
  });
  return admin?.id ?? null;
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<{ id: string } | null> {
  const admin = await db.query.admins.findFirst({
    where: eq(admins.email, email.toLowerCase().trim()),
    columns: { id: true, passwordHash: true },
  });
  if (!admin) return null;
  const ok = await bcrypt.compare(password, admin.passwordHash);
  return ok ? { id: admin.id } : null;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
