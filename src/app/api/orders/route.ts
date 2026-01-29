/**
 * POST /api/orders - Crea un pedido (checkout).
 * Recibe datos del cliente y ítems del carrito; descuenta stock.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  orders,
  orderItems,
  products,
  productSizes,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { generateId } from "@/lib/utils";

const createOrderSchema = z.object({
  customerEmail: z.string().email(),
  customerName: z.string().min(1),
  customerPhone: z.string().optional(),
  shippingAddress: z.string().min(1),
  items: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      size: z.string(),
      quantity: z.number().int().positive(),
      unitPrice: z.number().positive(),
    })
  ),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    // Verificar stock y reservar (descontar)
    for (const item of data.items) {
      const sizeRow = await db.query.productSizes.findFirst({
        where: and(
          eq(productSizes.productId, item.productId),
          eq(productSizes.size, item.size)
        ),
        columns: { id: true, stock: true },
      });
      if (!sizeRow) {
        return NextResponse.json(
          { error: `Producto o talle no encontrado: ${item.productName} - ${item.size}` },
          { status: 400 }
        );
      }
      if (sizeRow.stock < item.quantity) {
        return NextResponse.json(
          { error: `No hay stock suficiente para ${item.productName} talle ${item.size}. Disponible: ${sizeRow.stock}` },
          { status: 400 }
        );
      }
      await db
        .update(productSizes)
        .set({
          stock: sizeRow.stock - item.quantity,
          updatedAt: new Date(),
        })
        .where(eq(productSizes.id, sizeRow.id));
    }

    const orderId = generateId();
    const total = data.items.reduce(
      (acc, i) => acc + i.unitPrice * i.quantity,
      0
    );

    await db.insert(orders).values({
      id: orderId,
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      customerPhone: data.customerPhone ?? null,
      shippingAddress: data.shippingAddress,
      total: String(total),
      status: "pending",
    });

    for (const item of data.items) {
      await db.insert(orderItems).values({
        id: generateId(),
        orderId,
        productId: item.productId,
        productName: item.productName,
        size: item.size,
        quantity: item.quantity,
        unitPrice: String(item.unitPrice),
      });
    }

    return NextResponse.json({
      ok: true,
      orderId,
      total,
      message: "Pedido creado. El stock fue descontado.",
    });
  } catch (e) {
    console.error("Create order error:", e);
    return NextResponse.json(
      { error: "Error al crear el pedido" },
      { status: 500 }
    );
  }
}
