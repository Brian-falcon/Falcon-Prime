/**
 * PATCH /api/admin/orders/[id] - Actualizar estado del pedido.
 * Si el nuevo estado es "shipped", se envía un email al cliente.
 */
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/order-status";
import { sendOrderShippedEmail } from "@/lib/email";

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

    if (newStatus === "shipped") {
      try {
        await sendOrderShippedEmail({
          to: order.customerEmail,
          customerName: order.customerName,
          orderId: order.id,
        });
      } catch (emailErr) {
        console.error("Error al enviar email de despacho:", emailErr);
        return NextResponse.json({
          ok: true,
          message: "Estado actualizado. No se pudo enviar el email al cliente (revisá RESEND_API_KEY).",
        });
      }
    }

    return NextResponse.json({
      ok: true,
      status: newStatus,
      message:
        newStatus === "shipped"
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
