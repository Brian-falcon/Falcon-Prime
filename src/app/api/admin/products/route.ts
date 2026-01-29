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
import { eq } from "drizzle-orm";
import { z } from "zod";
import { slugify, generateId } from "@/lib/utils";

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  categoryId: z.string().min(1),
  color: z.string().optional(),
  images: z.array(z.object({ url: z.string().url(), alt: z.string().optional() })).default([]),
  sizes: z.array(z.object({ size: z.string().min(1), stock: z.number().int().min(0) })).default([]),
});

export async function GET() {
  const adminId = await getAdminSession();
  if (!adminId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const list = await db.query.products.findMany({
    orderBy: (p, { desc }) => [desc(p.createdAt)],
    with: {
      category: { columns: { id: true, name: true, slug: true } },
      images: { columns: { id: true, url: true, alt: true, sortOrder: true } },
      sizes: { columns: { id: true, size: true, stock: true } },
    },
  });
  return NextResponse.json(list);
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
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
      with: {
        category: { columns: { id: true, name: true, slug: true } },
        images: true,
        sizes: true,
      },
    });
    return NextResponse.json(product);
  } catch (e) {
    console.error("Create product error:", e);
    return NextResponse.json(
      { error: "Error al crear el producto" },
      { status: 500 }
    );
  }
}
