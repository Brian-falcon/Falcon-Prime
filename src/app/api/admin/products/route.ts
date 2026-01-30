/**
 * GET  /api/admin/products - Lista todos los productos (admin).
 * POST /api/admin/products - Crea un producto (admin).
 */
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/db";
import {
  products,
  productImages,
  productSizes,
  categories,
} from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { z } from "zod";
import { slugify, generateId } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  categoryId: z.string().min(1),
  color: z.string().optional(),
  images: z.array(z.object({ url: z.string().min(1), alt: z.string().optional() })).default([]),
  sizes: z.array(z.object({ size: z.string().min(1), stock: z.number().int().min(0) })).default([]),
});

export async function GET() {
  try {
    const adminId = await getAdminSession();
    if (!adminId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const productRows = await db
      .select()
      .from(products)
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
    const list = productRows.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: String(p.price ?? ""),
      isActive: p.isActive,
      category: catMap[p.categoryId] ?? { id: p.categoryId, name: "", slug: "" },
      images: (imagesByProduct[p.id] ?? [])
        .map((img) => ({ id: img.id, url: img.url, alt: img.alt, sortOrder: img.sortOrder }))
        .sort((a, b) => a.sortOrder - b.sortOrder),
      sizes: (sizesByProduct[p.id] ?? []).map((s) => ({ id: s.id, size: s.size, stock: s.stock })),
    }));
    return NextResponse.json(list, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (err) {
    console.error("GET /api/admin/products error:", err);
    return NextResponse.json(
      { error: "Error al conectar con la base de datos. Revisá DATABASE_URL en Vercel (Production y Preview)." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const adminId = await getAdminSession();
  if (!adminId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;
    const slugBase = slugify(data.name);
    let slug = slugBase;
    let counter = 0;
    const existing = await db.query.products.findFirst({
      where: eq(products.slug, slug),
      columns: { id: true },
    });
    if (existing) {
      counter++;
      slug = `${slugBase}-${counter}`;
      while (await db.query.products.findFirst({ where: eq(products.slug, slug), columns: { id: true } })) {
        counter++;
        slug = `${slugBase}-${counter}`;
      }
    }
    const productId = generateId();
    await db.insert(products).values({
      id: productId,
      categoryId: data.categoryId,
      name: data.name,
      slug,
      description: data.description ?? null,
      price: String(data.price),
      color: data.color ?? null,
      isActive: true,
    });
    for (let i = 0; i < data.images.length; i++) {
      const img = data.images[i];
      await db.insert(productImages).values({
        id: generateId(),
        productId,
        url: img.url,
        alt: img.alt ?? null,
        sortOrder: i,
      });
    }
    for (const s of data.sizes) {
      await db.insert(productSizes).values({
        id: generateId(),
        productId,
        size: s.size,
        stock: s.stock,
      });
    }
    // Obtener el producto creado con JOIN explícito
    const [p] = await db.select().from(products).where(eq(products.id, productId)).limit(1);
    if (!p) {
      return NextResponse.json({ error: "Producto creado pero no se pudo recuperar" }, { status: 500 });
    }
    const [cat] = await db.select().from(categories).where(eq(categories.id, p.categoryId)).limit(1);
    const imgs = await db.select().from(productImages).where(eq(productImages.productId, productId));
    const szs = await db.select().from(productSizes).where(eq(productSizes.productId, productId));
    const sortedImages = [...imgs].sort((a, b) => a.sortOrder - b.sortOrder);
    const product = {
      ...p,
      price: String(p.price ?? ""),
      category: cat ?? { id: p.categoryId, name: "", slug: "" },
      images: sortedImages,
      sizes: szs,
    };
    return NextResponse.json(product);
  } catch (e) {
    console.error("Create product error:", e);
    return NextResponse.json(
      { error: "Error al crear el producto" },
      { status: 500 }
    );
  }
}
