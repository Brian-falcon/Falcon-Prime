/**
 * GET /api/db-check - Verificación de conexión a Neon (public.products y public.categories).
 * Abrí en el navegador: https://tu-app.vercel.app/api/db-check
 * Si productCount es 0 o hay error → DATABASE_URL en Vercel no apunta a la misma base que Neon Studio.
 */
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function normalizeConnectionString(value: string): string {
  let url = value.trim();
  if (url.toLowerCase().startsWith("psql ")) url = url.slice(5).trim();
  if ((url.startsWith("'") && url.endsWith("'")) || (url.startsWith('"') && url.endsWith('"'))) {
    url = url.slice(1, -1);
  }
  return url;
}

function getHostHint(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname || "(oculto)";
  } catch {
    return "(URL inválida)";
  }
}

export async function GET() {
  try {
    const raw = process.env.DATABASE_URL;
    if (!raw) {
      return NextResponse.json(
        {
          ok: false,
          error: "DATABASE_URL no está definida",
          hint: "En Vercel: Settings → Environment Variables → agregá DATABASE_URL (connection string de Neon, branch production).",
        },
        { status: 500 }
      );
    }

    const connectionString = normalizeConnectionString(raw);
    const sql = neon(connectionString);

    const [productsResult, categoriesResult] = await Promise.all([
      sql`SELECT COUNT(*)::int AS count FROM public.products`,
      sql`SELECT COUNT(*)::int AS count FROM public.categories`,
    ]);

    const productCount = Array.isArray(productsResult) && productsResult[0] ? Number((productsResult[0] as { count: number }).count) : 0;
    const categoryCount = Array.isArray(categoriesResult) && categoriesResult[0] ? Number((categoriesResult[0] as { count: number }).count) : 0;

    const ok = true;
    return NextResponse.json({
      ok,
      productCount,
      categoryCount,
      schema: "public",
      hostHint: getHostHint(connectionString),
      message:
        productCount === 0
          ? "Conexión OK pero public.products está vacía. Si en Neon Studio ves productos, esta URL no es la misma base (revisá branch y proyecto en Neon)."
          : `Conexión OK. ${productCount} productos, ${categoryCount} categorías en public.`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        ok: false,
        error: message,
        hint: "Revisá que DATABASE_URL en Vercel sea la connection string de Neon (branch production). Sin espacios ni comillas de más.",
      },
      { status: 500 }
    );
  }
}
