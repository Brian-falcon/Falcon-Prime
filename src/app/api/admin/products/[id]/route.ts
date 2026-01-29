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
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { generateId } from "@/lib/utils";

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  categoryId: z.string().min(1).optional(),
  color: z.string().optional(),
  isActive: z.boolean().optional(),
  images: z.array(z.object({ url: z.string().url(), alt: z.string().optional() })).optional(),
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
  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      category: true,
      images: true,
      sizes: true,
    },
  });
  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
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
  const existing = await db.query.products.findFirst({
    where: eq(products.id, id),
    columns: { id: true },
  });
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
    if (data.description !== undefined) updateValues.description = data.description;
    if (data.price !== undefined) updateValues.price = String(data.price);
    if (data.categoryId !== undefined) updateValues.categoryId = data.categoryId;
    if (data.color !== undefined) updateValues.color = data.color;
    if (data.isActive !== undefined) updateValues.isActive = data.isActive;
    updateValues.updatedAt = new Date();
    if (Object.keys(updateValues).length > 0) {
      await db.update(products).set(updateValues as typeof products.$inferInsert).where(eq(products.id, id));
    }
    if (data.images !== undefined) {
      await db.delete(productImages).where(eq(productImages.productId, id));
      for (let i = 0; i < data.images.length; i++) {
        const img = data.images[i];
        await db.insert(productImages).values({
          id: generateId(),
          productId: id,
          url: img.url,
          alt: img.alt ?? null,
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
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: { category: true, images: true, sizes: true },
    });
    return NextResponse.json(product);
  } catch (e) {
    console.error("Update product error:", e);
    return NextResponse.json(
      { error: "Error al actualizar el producto" },
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
  const existing = await db.query.products.findFirst({
    where: eq(products.id, id),
    columns: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
  await db.delete(products).where(eq(products.id, id));
  return NextResponse.json({ ok: true });
}
