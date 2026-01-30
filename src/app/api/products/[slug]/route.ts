/**
 * GET /api/products/[slug] - Obtiene un producto por slug (tienda pública).
 * Join con product_images y categories.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, productImages, productSizes, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const [p] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);
  if (!p) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
  const [cat] = await db
    .select({ id: categories.id, name: categories.name, slug: categories.slug })
    .from(categories)
    .where(eq(categories.id, p.categoryId))
    .limit(1);
  const imgs = await db
    .select({ id: productImages.id, url: productImages.url, alt: productImages.alt, sortOrder: productImages.sortOrder })
    .from(productImages)
    .where(eq(productImages.productId, p.id));
  const szs = await db
    .select({ id: productSizes.id, size: productSizes.size, stock: productSizes.stock })
    .from(productSizes)
    .where(eq(productSizes.productId, p.id));
  const sortedImages = [...imgs].sort((a, b) => a.sortOrder - b.sortOrder);
  const product = {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: String(p.price ?? ""),
    color: p.color,
    isActive: p.isActive,
    category: cat ?? { id: p.categoryId, name: "", slug: "" },
    images: sortedImages,
    sizes: szs,
  };
  return NextResponse.json(product, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
