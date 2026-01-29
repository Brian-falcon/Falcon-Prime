"use client";

/**
 * Checkout: datos del cliente, resumen del pedido, envío a /api/orders.
 * Preparado para integrar pagos más adelante.
 */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customerEmail: "",
    customerName: "",
    customerPhone: "",
    shippingAddress: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (items.length === 0) {
      setError("El carrito está vacío.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: form.customerEmail.trim(),
          customerName: form.customerName.trim(),
          customerPhone: form.customerPhone.trim() || undefined,
          shippingAddress: form.shippingAddress.trim(),
          items: items.map((i) => ({
            productId: i.productId,
            productName: i.productName,
            size: i.size,
            quantity: i.quantity,
            unitPrice: i.price,
          })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Error al crear el pedido");
        setLoading(false);
        return;
      }
      clearCart();
      router.push(`/checkout/gracias?orderId=${data.orderId ?? ""}`);
    } catch {
      setError("Error de conexión");
      setLoading(false);
    }
  }

  if (items.length === 0 && !loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-gray-200">
          <div className="container-fp flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-semibold tracking-tight text-fp-black">
              FALCON PRIME
            </Link>
          </div>
        </header>
        <main className="flex-1 container-fp py-16 text-center">
          <h1 className="text-2xl font-light text-fp-black mb-4">Checkout</h1>
          <p className="text-fp-gray mb-6">Tu carrito está vacío.</p>
          <Link
            href="/tienda"
            className="inline-block border border-fp-black px-6 py-2 text-sm font-medium hover:bg-fp-black hover:text-white transition-colors"
          >
            Ir a la tienda
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="container-fp flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-semibold tracking-tight text-fp-black">
            FALCON PRIME
          </Link>
          <Link href="/carrito" className="text-sm text-fp-gray hover:text-fp-black">
            Carrito
          </Link>
        </div>
      </header>

      <main className="flex-1 container-fp py-8">
        <h1 className="text-2xl font-light text-fp-black mb-6">Finalizar compra</h1>

        <form onSubmit={handleSubmit} className="max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-fp-black">Datos de contacto</h2>
            <div>
              <label className="block text-sm font-medium text-fp-black mb-1">
                Email *
              </label>
              <input
                type="email"
                value={form.customerEmail}
                onChange={(e) => setForm((f) => ({ ...f, customerEmail: e.target.value }))}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-fp-black"
                required
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-fp-black mb-1">
                Nombre completo *
              </label>
              <input
                type="text"
                value={form.customerName}
                onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-fp-black"
                required
                placeholder="Nombre y apellido"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-fp-black mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={form.customerPhone}
                onChange={(e) => setForm((f) => ({ ...f, customerPhone: e.target.value }))}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-fp-black"
                placeholder="Opcional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-fp-black mb-1">
                Dirección de envío *
              </label>
              <textarea
                value={form.shippingAddress}
                onChange={(e) => setForm((f) => ({ ...f, shippingAddress: e.target.value }))}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-fp-black min-h-[80px]"
                required
                placeholder="Calle, número, ciudad, código postal"
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-fp-black mb-4">Resumen del pedido</h2>
            <ul className="space-y-2 border-b border-gray-200 pb-4 mb-4">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.size}`}
                  className="flex justify-between text-sm"
                >
                  <span className="text-fp-black">
                    {item.productName} · Talle {item.size} × {item.quantity}
                  </span>
                  <span className="text-fp-gray">
                    {formatPrice(item.price * item.quantity, { currency: "ARS" })}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-lg font-medium text-fp-black flex justify-between">
              Total
              <span>{formatPrice(totalAmount, { currency: "ARS" })}</span>
            </p>
            {error && (
              <p className="text-sm text-red-600 mt-4" role="alert">
                {error}
              </p>
            )}
            <p className="text-xs text-fp-gray mt-4">
              Al confirmar se descontará el stock. La integración de pagos se agregará más adelante.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-fp-black text-white py-3 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Procesando…" : "Confirmar pedido"}
            </button>
          </div>
        </form>
      </main>

      <footer className="border-t border-gray-200 py-8 mt-auto">
        <div className="container-fp text-center text-sm text-fp-gray">
          <p>© {new Date().getFullYear()} Falcon Prime.</p>
        </div>
      </footer>
    </div>
  );
}
