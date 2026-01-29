/**
 * GET /api/admin/categories - Lista categorías (para formularios admin).
 */
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const adminId = await getAdminSession();
  if (!adminId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const list = await db.select().from(categories).orderBy(asc(categories.name));
  return NextResponse.json(list);
}
