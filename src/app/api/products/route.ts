/**
 * GET /api/products - Lista productos públicos (tienda).
 * Query: categoria (slug), talle, color, minPrice, maxPrice.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, productImages, productSizes, categories } from "@/db/schema";
import { eq, and, gte, lte, desc, inArray, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoriaSlugRaw = searchParams.get("categoria") ?? undefined;
    const categoriaSlug = categoriaSlugRaw?.trim().toLowerCase() || undefined;
    const talle = searchParams.get("talle") ?? undefined;
    const color = searchParams.get("color") ?? undefined;
    const minPrice = searchParams.get("minPrice") ?? undefined;
    const maxPrice = searchParams.get("maxPrice") ?? undefined;

    // No filtrar por is_active: mostrar todos los productos (evita que Neon devuelva vacío si el booleano difiere)
    const conditions: (ReturnType<typeof eq> | ReturnType<typeof gte> | ReturnType<typeof lte>)[] = [];

    if (categoriaSlug) {
      const catRows = await db
        .select({ id: categories.id })
        .from(categories)
        .where(sql`lower(${categories.slug}) = ${categoriaSlug}`)
        .limit(1);
      if (catRows[0]) conditions.push(eq(products.categoryId, catRows[0].id));
    }
    if (color) conditions.push(eq(products.color, color));
    if (minPrice !== undefined && minPrice !== "") {
      const n = parseFloat(minPrice);
      if (!Number.isNaN(n)) conditions.push(gte(products.price, String(n)));
    }
    if (maxPrice !== undefined && maxPrice !== "") {
      const n = parseFloat(maxPrice);
      if (!Number.isNaN(n)) conditions.push(lte(products.price, String(n)));
    }

    const productRows = await db
      .select()
      .from(products)
      .where(conditions.length > 0 ? and(...conditions) : sql`1 = 1`)
      .orderBy(desc(products.createdAt));

    if (productRows.length === 0) {
      return NextResponse.json([], {
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    }

    const productIds = productRows.map((p) => p.id);
    const categoryIds = Array.from(new Set(productRows.map((p) => p.categoryId)));

    const [categoryRows, imageRows, sizeRows] = await Promise.all([
      db.select({ id: categories.id, name: categories.name, slug: categories.slug }).from(categories).where(inArray(categories.id, categoryIds)),
      db.select().from(productImages).where(inArray(productImages.productId, productIds)),
      db.select().from(productSizes).where(inArray(productSizes.productId, productIds)),
    ]);

    const catMap = Object.fromEntries(categoryRows.map((c) => [c.id, c]));
    const imagesByProduct = productIds.reduce<Record<string, typeof imageRows>>((acc, id) => {
      acc[id] = [];
      return acc;
    }, {});
    for (const img of imageRows) {
      if (imagesByProduct[img.productId]) imagesByProduct[img.productId].push(img);
    }
    const sizesByProduct = productIds.reduce<Record<string, typeof sizeRows>>((acc, id) => {
      acc[id] = [];
      return acc;
    }, {});
    for (const s of sizeRows) {
      if (sizesByProduct[s.productId]) sizesByProduct[s.productId].push(s);
    }

    let list = productRows.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: String(p.price ?? ""),
      color: p.color ?? null,
      category: catMap[p.categoryId] ?? { id: p.categoryId, name: "", slug: "" },
      images: (imagesByProduct[p.id] ?? [])
        .map((img) => ({
          id: img.id,
          url: img.url,
          alt: img.alt,
          sortOrder: img.sortOrder,
        }))
        .sort((a, b) => a.sortOrder - b.sortOrder),
      sizes: (sizesByProduct[p.id] ?? []).map((s) => ({ id: s.id, size: s.size, stock: s.stock })),
    }));

    if (talle) {
      list = list.filter((p) =>
        p.sizes.some((s) => s.size.toLowerCase() === talle.toLowerCase() && s.stock > 0)
      );
    }

    return NextResponse.json(list, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("Error en GET /api/products:", error);
    const message = error instanceof Error ? error.message : "Error al cargar productos";
    return NextResponse.json(
      { error: message.includes("DATABASE_URL") ? message : "Error al cargar productos. Revisá DATABASE_URL en Vercel o .env.local." },
      { status: 500 }
    );
  }
}
