/**
 * GET /api/categories - Lista categorías (para filtros de la tienda).
 */
import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const list = await db.select().from(categories).orderBy(asc(categories.name));
    return NextResponse.json(list, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("Error en GET /api/categories:", error);
    return NextResponse.json(
      { error: "Error al cargar categorías. Revisá DATABASE_URL." },
      { status: 500 }
    );
  }
}
