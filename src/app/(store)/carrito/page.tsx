"use client";

/**
 * Página del carrito: listar ítems, modificar cantidad, eliminar, ver total.
 */
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import StoreFooter from "@/components/store/StoreFooter";

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, totalItems, totalAmount } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="container-fp flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-semibold tracking-tight text-fp-black">
            FALCON PRIME
          </Link>
          <nav className="hidden md:flex gap-8 text-sm text-fp-gray hover:[&>a]:text-fp-black">
            <Link href="/tienda">Tienda</Link>
            <Link href="/carrito" className="text-fp-black font-medium">
              Carrito {totalItems > 0 ? `(${totalItems})` : ""}
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container-fp py-8">
        <h1 className="text-2xl font-light text-fp-black mb-6">Carrito</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-fp-gray mb-4">Tu carrito está vacío.</p>
            <Link
              href="/tienda"
              className="inline-block border border-fp-black px-6 py-2 text-sm font-medium hover:bg-fp-black hover:text-white transition-colors"
            >
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <div className="max-w-3xl">
            <ul className="space-y-4 border-b border-gray-200 pb-6">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.size}`}
                  className="flex gap-4 py-4 border-b border-gray-100 last:border-0"
                >
                  <div className="w-20 h-24 bg-fp-light shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-fp-gray text-xs">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/tienda/${item.slug}`}
                      className="font-medium text-fp-black hover:underline block"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-sm text-fp-gray">Talle: {item.size}</p>
                    <p className="text-sm text-fp-black mt-1">
                      {formatPrice(item.price * item.quantity, { currency: "ARS" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.productId, item.size, item.quantity - 1)
                      }
                      className="w-8 h-8 border border-gray-300 text-fp-black hover:border-fp-black"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.productId, item.size, item.quantity + 1)
                      }
                      className="w-8 h-8 border border-gray-300 text-fp-black hover:border-fp-black"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId, item.size)}
                    className="text-sm text-red-600 hover:underline shrink-0"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-between items-center">
              <p className="text-lg font-medium text-fp-black">
                Total: {formatPrice(totalAmount, { currency: "ARS" })}
              </p>
              <div className="flex gap-3">
                <Link
                  href="/tienda"
                  className="border border-gray-300 px-4 py-2 text-sm text-fp-black hover:border-fp-black"
                >
                  Seguir comprando
                </Link>
                <Link
                  href="/checkout"
                  className="bg-fp-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800"
                >
                  Finalizar compra
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <StoreFooter />
    </div>
  );
}
