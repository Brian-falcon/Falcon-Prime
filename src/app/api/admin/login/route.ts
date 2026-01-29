/**
 * POST /api/admin/login
 * Inicia sesión con email y contraseña. Establece cookie de sesión.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminCredentials, setAdminSession } from "@/lib/auth";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Email y contraseña requeridos" },
        { status: 400 }
      );
    }
    const { email, password } = parsed.data;
    const admin = await verifyAdminCredentials(email, password);
    if (!admin) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }
    await setAdminSession(admin.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Login error:", e);
    return NextResponse.json(
      { error: "Error al iniciar sesión" },
      { status: 500 }
    );
  }
}
