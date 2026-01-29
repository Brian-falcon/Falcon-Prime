/**
 * GET /api/products/[slug] - Obtiene un producto por slug (tienda pública).
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await db.query.products.findFirst({
    where: and(eq(products.slug, slug), eq(products.isActive, true)),
    with: {
      category: { columns: { id: true, name: true, slug: true } },
      images: { columns: { id: true, url: true, alt: true, sortOrder: true } },
      sizes: { columns: { id: true, size: true, stock: true } },
    },
  });
  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
  return NextResponse.json(product);
}
