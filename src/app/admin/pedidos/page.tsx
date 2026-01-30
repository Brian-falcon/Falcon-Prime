"use client";

/**
 * Listado de pedidos en el panel de administración.
 * Permite cambiar el estado (Pendiente → En preparación → Enviado → Entregado).
 * Al marcar como "Enviado" se envía un email al cliente.
 */
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { getOrderStatusLabel, ORDER_STATUSES, type OrderStatus } from "@/lib/order-status";

type Order = {
  id: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string | null;
  shippingAddress: string;
  total: string;
  status: string;
  createdAt: string;
  itemsCount: number;
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "error" | "warning"; text: string } | null>(null);

  const loadOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Error al cargar pedidos");
        setOrders([]);
        return;
      }
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setError("Error de conexión");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    setUpdatingId(orderId);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "error", text: data?.error ?? "Error al actualizar" });
        return;
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (data.message) {
        const isWarning = data.message.includes("No se pudo enviar el email");
        setMessage({
          type: isWarning ? "warning" : "ok",
          text: data.message,
        });
        setTimeout(() => setMessage(null), isWarning ? 8000 : 4000);
      }
    } catch {
      setMessage({ type: "error", text: "Error de conexión" });
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-fp-black mb-6">Pedidos</h1>
        <p className="text-fp-gray">Cargando…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-fp-black mb-6">Pedidos</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-fp-black">Pedidos</h1>
          <p className="text-sm text-fp-gray mt-1">
            {orders.length} pedido{orders.length !== 1 ? "s" : ""}
            {pendingCount > 0 && (
              <span className="ml-2 text-amber-600">
                · {pendingCount} pendiente{pendingCount !== 1 ? "s" : ""}
              </span>
            )}
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            message.type === "ok"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : message.type === "warning"
                ? "bg-amber-50 text-amber-800 border border-amber-200"
                : "bg-red-50 text-red-800 border border-red-200"
          }`}
          role="alert"
        >
          {message.text}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-fp-gray">Aún no hay pedidos.</p>
          <Link href="/" target="_blank" rel="noopener" className="inline-block mt-4 text-sm text-fp-black hover:underline">
            Ver tienda
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-fp-black truncate">{o.customerName}</p>
                  <p className="text-sm text-fp-gray truncate">{o.customerEmail}</p>
                  <p className="text-xs text-fp-gray mt-1">{formatDate(o.createdAt)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <span className="text-sm text-fp-black font-medium">
                    {formatPrice(parseFloat(o.total), { currency: "ARS" })}
                  </span>
                  <span className="text-xs text-fp-gray">{o.itemsCount} ítem{o.itemsCount !== 1 ? "s" : ""}</span>
                  <label className="flex items-center gap-2 text-sm">
                    <span className="text-fp-gray whitespace-nowrap">Estado:</span>
                    <select
                      value={ORDER_STATUSES.includes(o.status as OrderStatus) ? o.status : "pending"}
                      onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                      disabled={updatingId === o.id}
                      className="border border-gray-200 rounded px-3 py-1.5 text-fp-black bg-white min-w-[140px] disabled:opacity-60"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {getOrderStatusLabel(s)}
                        </option>
                      ))}
                    </select>
                    {updatingId === o.id && (
                      <span className="text-xs text-fp-gray">Actualizando…</span>
                    )}
                  </label>
                </div>
              </div>
              <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-gray-100">
                <p className="text-xs text-fp-gray mt-3 line-clamp-2">
                  <span className="font-medium text-fp-black">Envío:</span> {o.shippingAddress}
                </p>
                {o.customerPhone && (
                  <p className="text-xs text-fp-gray mt-1">Tel: {o.customerPhone}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
