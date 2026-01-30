"use client";

/**
 * Listado de pedidos en el panel de administración.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

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

  useEffect(() => {
    async function load() {
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
    }
    load();
  }, []);

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
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-sm text-fp-black font-medium">
                    {formatPrice(parseFloat(o.total), { currency: "ARS" })}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      o.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-gray-100 text-fp-gray"
                    }`}
                  >
                    {o.status === "pending" ? "Pendiente" : o.status}
                  </span>
                  <span className="text-xs text-fp-gray">{o.itemsCount} ítem{o.itemsCount !== 1 ? "s" : ""}</span>
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
