/**
 * GET /api/categories - Lista categorías (para filtros de la tienda).
 */
import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const list = await db.select().from(categories).orderBy(asc(categories.name));
  return NextResponse.json(list);
}
