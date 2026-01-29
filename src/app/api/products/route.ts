/**
 * GET /api/products - Lista productos públicos (tienda).
 * Query: categoria (slug), talle, color, minPrice, maxPrice.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, productImages, productSizes, categories } from "@/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categoriaSlug = searchParams.get("categoria") ?? undefined;
  const talle = searchParams.get("talle") ?? undefined;
  const color = searchParams.get("color") ?? undefined;
  const minPrice = searchParams.get("minPrice") ?? undefined;
  const maxPrice = searchParams.get("maxPrice") ?? undefined;

  const conditions = [eq(products.isActive, true)];

  if (categoriaSlug) {
    const cat = await db.query.categories.findFirst({
      where: eq(categories.slug, categoriaSlug),
      columns: { id: true },
    });
    if (cat) conditions.push(eq(products.categoryId, cat.id));
  }
  if (color) {
    conditions.push(eq(products.color, color));
  }
  if (minPrice !== undefined && minPrice !== "") {
    const n = parseFloat(minPrice);
    if (!Number.isNaN(n)) conditions.push(gte(products.price, String(n)));
  }
  if (maxPrice !== undefined && maxPrice !== "") {
    const n = parseFloat(maxPrice);
    if (!Number.isNaN(n)) conditions.push(lte(products.price, String(n)));
  }

  const list = await db.query.products.findMany({
    where: and(...conditions),
    orderBy: (p, { desc: d }) => [d(p.createdAt)],
    with: {
      category: { columns: { id: true, name: true, slug: true } },
      images: { columns: { id: true, url: true, alt: true, sortOrder: true } },
      sizes: { columns: { id: true, size: true, stock: true } },
    },
  });

  let filtered = list;
  if (talle) {
    filtered = list.filter((p) =>
      p.sizes.some((s) => s.size.toLowerCase() === talle.toLowerCase() && s.stock > 0)
    );
  }

  return NextResponse.json(filtered);
}
