/**
 * PATCH /api/admin/orders/[id] - Actualizar estado del pedido.
 * En "preparing", "shipped" y "delivered" se envía un email al cliente (al correo que usó en la compra, ej. Gmail).
 */
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/order-status";
import {
  sendOrderPreparingEmail,
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
} from "@/lib/email";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  status: z.enum(ORDER_STATUSES as unknown as [string, ...string[]]),
});

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminId = await getAdminSession();
    if (!adminId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID de pedido requerido" }, { status: 400 });
    }

    const body = await _request.json().catch(() => ({}));
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Estado inválido", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (!order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    const newStatus = parsed.data.status as OrderStatus;
    await db.update(orders).set({ status: newStatus }).where(eq(orders.id, id));

    const emailParams = {
      to: order.customerEmail,
      customerName: order.customerName,
      orderId: order.id,
    };
    let emailSent = false;
    if (newStatus === "preparing") {
      try {
        await sendOrderPreparingEmail(emailParams);
        emailSent = true;
      } catch (emailErr) {
        console.error("Error al enviar email en preparación:", emailErr);
      }
    } else if (newStatus === "shipped") {
      try {
        await sendOrderShippedEmail(emailParams);
        emailSent = true;
      } catch (emailErr) {
        console.error("Error al enviar email de despacho:", emailErr);
      }
    } else if (newStatus === "delivered") {
      try {
        await sendOrderDeliveredEmail(emailParams);
        emailSent = true;
      } catch (emailErr) {
        console.error("Error al enviar email entregado:", emailErr);
      }
    }

    return NextResponse.json({
      ok: true,
      status: newStatus,
      message:
        emailSent
          ? "Estado actualizado y email enviado al cliente."
          : "Estado actualizado.",
    });
  } catch (e) {
    console.error("Admin order PATCH error:", e);
    return NextResponse.json(
      { error: "Error al actualizar el pedido" },
      { status: 500 }
    );
  }
}
