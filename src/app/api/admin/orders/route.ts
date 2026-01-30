/**
 * GET /api/admin/orders - Lista pedidos (solo admin).
 */
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { desc, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const adminId = await getAdminSession();
    if (!adminId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const orderRows = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(100);
    if (orderRows.length === 0) {
      return NextResponse.json([], {
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    }
    const orderIds = orderRows.map((o) => o.id);
    const allItems = await db
      .select()
      .from(orderItems)
      .where(inArray(orderItems.orderId, orderIds));
    const itemsByOrder: Record<string, typeof allItems> = {};
    for (const row of allItems) {
      if (!itemsByOrder[row.orderId]) itemsByOrder[row.orderId] = [];
      itemsByOrder[row.orderId].push(row);
    }
    const result = orderRows.map((o) => ({
      id: o.id,
      customerEmail: o.customerEmail,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      shippingAddress: o.shippingAddress,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
      itemsCount: (itemsByOrder[o.id] ?? []).length,
    }));
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (e) {
    console.error("Admin orders list error:", e);
    return NextResponse.json(
      { error: "Error al cargar pedidos" },
      { status: 500 }
    );
  }
}
