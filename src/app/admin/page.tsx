/**
 * Dashboard del panel de administración: estadísticas, accesos rápidos y pedidos recientes.
 */
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { products, orders } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/utils";

async function getStats() {
  const [productsRes, ordersRes, recentOrders] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(products),
    db.select({ count: sql<number>`count(*)::int` }).from(orders),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5),
  ]);
  const productsCount = productsRes[0]?.count ?? 0;
  const ordersCount = ordersRes[0]?.count ?? 0;
  const pendingOrders = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(orders)
    .where(eq(orders.status, "pending"));
  const pendingCount = pendingOrders[0]?.count ?? 0;
  return { productsCount, ordersCount, pendingCount, recentOrders };
}

function formatDate(iso: Date | string) {
  try {
    return new Date(iso).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(iso);
  }
}

export default async function AdminDashboardPage() {
  const adminId = await getAdminSession();
  if (!adminId) redirect("/admin/login");

  const { productsCount, ordersCount, pendingCount, recentOrders } = await getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-fp-black">
          Panel de administración
        </h1>
        <p className="text-fp-gray mt-1">
          Resumen de tu tienda Falcon Prime. Gestioná productos, pedidos y stock desde aquí.
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-fp-black/5 flex items-center justify-center">
              <svg className="w-5 h-5 text-fp-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold text-fp-black">{productsCount}</p>
              <p className="text-sm text-fp-gray">Productos</p>
            </div>
          </div>
          <Link
            href="/admin/productos"
            className="mt-4 inline-block text-sm font-medium text-fp-black hover:underline"
          >
            Ver listado →
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold text-fp-black">{ordersCount}</p>
              <p className="text-sm text-fp-gray">Pedidos totales</p>
            </div>
          </div>
          <Link
            href="/admin/pedidos"
            className="mt-4 inline-block text-sm font-medium text-fp-black hover:underline"
          >
            Ver pedidos →
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold text-fp-black">{pendingCount}</p>
              <p className="text-sm text-fp-gray">Pendientes</p>
            </div>
          </div>
          <Link
            href="/admin/pedidos"
            className="mt-4 inline-block text-sm font-medium text-fp-black hover:underline"
          >
            Gestionar →
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-fp-black">Ver tienda</p>
              <p className="text-xs text-fp-gray">Abrir en nueva pestaña</p>
            </div>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-medium text-fp-black hover:underline"
          >
            Abrir tienda →
          </a>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-fp-black mb-4">Acciones rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/productos/nuevo"
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-fp-black hover:bg-gray-50/50 transition-colors"
          >
            <span className="w-10 h-10 rounded-lg bg-fp-black text-white flex items-center justify-center text-lg font-medium">
              +
            </span>
            <div>
              <p className="font-medium text-fp-black">Nuevo producto</p>
              <p className="text-sm text-fp-gray">Crear producto con imágenes y talles</p>
            </div>
          </Link>
          <Link
            href="/admin/productos"
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-fp-black hover:bg-gray-50/50 transition-colors"
          >
            <span className="w-10 h-10 rounded-lg bg-fp-light flex items-center justify-center">
              <svg className="w-5 h-5 text-fp-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </span>
            <div>
              <p className="font-medium text-fp-black">Lista de productos</p>
              <p className="text-sm text-fp-gray">Editar, eliminar o activar/desactivar</p>
            </div>
          </Link>
          <Link
            href="/admin/pedidos"
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-fp-black hover:bg-gray-50/50 transition-colors"
          >
            <span className="w-10 h-10 rounded-lg bg-fp-light flex items-center justify-center">
              <svg className="w-5 h-5 text-fp-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
            <div>
              <p className="font-medium text-fp-black">Pedidos</p>
              <p className="text-sm text-fp-gray">Ver y gestionar pedidos recientes</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Pedidos recientes */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-fp-black">Pedidos recientes</h2>
          <Link href="/admin/pedidos" className="text-sm font-medium text-fp-black hover:underline">
            Ver todos
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentOrders.length === 0 ? (
            <div className="px-6 py-8 text-center text-fp-gray text-sm">
              Aún no hay pedidos.
            </div>
          ) : (
            recentOrders.map((o) => (
              <Link
                key={o.id}
                href="/admin/pedidos"
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-6 py-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-medium text-fp-black truncate">{o.customerName}</p>
                  <p className="text-sm text-fp-gray truncate">{o.customerEmail}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-medium text-fp-black">
                    {formatPrice(parseFloat(o.total), { currency: "ARS" })}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      o.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-fp-gray"
                    }`}
                  >
                    {o.status === "pending" ? "Pendiente" : o.status}
                  </span>
                  <span className="text-xs text-fp-gray">{formatDate(o.createdAt)}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
