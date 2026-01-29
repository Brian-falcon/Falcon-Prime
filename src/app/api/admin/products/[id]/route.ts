/**
 * GET    /api/admin/products/[id] - Obtiene un producto (admin).
 * PUT    /api/admin/products/[id] - Actualiza un producto (admin).
 * DELETE /api/admin/products/[id] - Elimina un producto (admin).
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
import { generateId } from "@/lib/utils";

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  price: z.number().positive().optional(),
  categoryId: z.string().min(1).optional(),
  color: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  images: z.array(z.object({ url: z.string().min(1), alt: z.string().optional() })).optional(),
  sizes: z.array(z.object({ size: z.string().min(1), stock: z.number().int().min(0) })).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminSession();
  if (!adminId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await params;
  const [p] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!p) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
  const [cat] = await db.select().from(categories).where(eq(categories.id, p.categoryId)).limit(1);
  const imgs = await db.select().from(productImages).where(eq(productImages.productId, id));
  const szs = await db.select().from(productSizes).where(eq(productSizes.productId, id));
  const product = {
    ...p,
    category: cat ?? { id: p.categoryId, name: "", slug: "" },
    images: imgs,
    sizes: szs,
  };
  return NextResponse.json(product);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminSession();
  if (!adminId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await params;
  const [existing] = await db.select({ id: products.id }).from(products).where(eq(products.id, id)).limit(1);
  if (!existing) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
  try {
    const body = await request.json();
    const parsed = updateProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;
    const updateValues: Record<string, unknown> = {};
    if (data.name !== undefined) updateValues.name = data.name;
    if (data.description !== undefined) updateValues.description = data.description ?? null;
    if (data.price !== undefined) updateValues.price = String(data.price);
    if (data.categoryId !== undefined) updateValues.categoryId = data.categoryId;
    if (data.color !== undefined) updateValues.color = data.color ?? null;
    if (data.isActive !== undefined) updateValues.isActive = data.isActive;
    updateValues.updatedAt = new Date();
    if (Object.keys(updateValues).length > 0) {
      await db.update(products).set(updateValues as Record<string, unknown>).where(eq(products.id, id));
    }
    if (data.images !== undefined) {
      await db.delete(productImages).where(eq(productImages.productId, id));
      const validImages = data.images.filter((i) => i.url && i.url.trim());
      for (let i = 0; i < validImages.length; i++) {
        const img = validImages[i];
        await db.insert(productImages).values({
          id: generateId(),
          productId: id,
          url: img.url.trim(),
          alt: img.alt?.trim() ?? null,
          sortOrder: i,
        });
      }
    }
    if (data.sizes !== undefined) {
      await db.delete(productSizes).where(eq(productSizes.productId, id));
      for (const s of data.sizes) {
        await db.insert(productSizes).values({
          id: generateId(),
          productId: id,
          size: s.size,
          stock: s.stock,
        });
      }
    }
    try {
      const [p] = await db.select().from(products).where(eq(products.id, id)).limit(1);
      if (!p) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
      const [cat] = await db.select().from(categories).where(eq(categories.id, p.categoryId)).limit(1);
      const imgs = await db.select().from(productImages).where(eq(productImages.productId, id));
      const szs = await db.select().from(productSizes).where(eq(productSizes.productId, id));
      const product = {
        ...p,
        category: cat ?? { id: p.categoryId, name: "", slug: "" },
        images: imgs,
        sizes: szs,
      };
      return NextResponse.json(product);
    } catch (_fetchErr) {
      return NextResponse.json({ ok: true, productUpdated: true });
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("Update product error:", e);
    return NextResponse.json(
      { error: "Error al actualizar el producto", details: message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminSession();
  if (!adminId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await params;
  const [existing] = await db.select({ id: products.id }).from(products).where(eq(products.id, id)).limit(1);
  if (!existing) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
  await db.delete(products).where(eq(products.id, id));
  return NextResponse.json({ ok: true });
}
