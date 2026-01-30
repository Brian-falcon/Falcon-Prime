"use client";

/**
 * Página del carrito: listar ítems, modificar cantidad, eliminar, ver total.
 * Layout responsive para móvil y desktop. Usa StoreHeader para acceso al carrito desde móvil.
 */
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, totalItems, totalAmount } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />

      <main className="flex-1 container-fp py-6 sm:py-8 px-4 sm:px-6 pb-24 sm:pb-8">
        <h1 className="text-xl sm:text-2xl font-light text-fp-black mb-6">Carrito</h1>

        {items.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-fp-gray mb-4">Tu carrito está vacío.</p>
            <Link
              href="/tienda"
              className="inline-block border border-fp-black px-6 py-2.5 text-sm font-medium hover:bg-fp-black hover:text-white transition-colors"
            >
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <>
            <ul className="space-y-4 sm:space-y-6 border-b border-gray-200 pb-6 max-w-3xl">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.size}`}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-4 border-b border-gray-100 last:border-0"
                >
                  <div className="flex gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-20 h-24 sm:w-24 sm:h-28 bg-fp-light shrink-0 overflow-hidden rounded-sm">
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
                        className="font-medium text-fp-black hover:underline block text-sm sm:text-base truncate"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-sm text-fp-gray mt-0.5">Talle: {item.size}</p>
                      <p className="text-sm text-fp-black mt-1 font-medium">
                        {formatPrice(item.price * item.quantity, { currency: "ARS" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.quantity - 1)
                        }
                        className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-300 text-fp-black hover:border-fp-black text-base sm:text-sm"
                        aria-label="Menos"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium min-w-[2rem]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.quantity + 1)
                        }
                        className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-300 text-fp-black hover:border-fp-black text-base sm:text-sm"
                        aria-label="Más"
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
                  </div>
                </li>
              ))}
            </ul>

            <div className="max-w-3xl mt-6 sm:mt-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <p className="text-lg sm:text-xl font-medium text-fp-black order-2 sm:order-1">
                  Total: {formatPrice(totalAmount, { currency: "ARS" })}
                </p>
                <div className="flex flex-col-reverse sm:flex-row gap-3 order-1 sm:order-2 w-full sm:w-auto">
                  <Link
                    href="/tienda"
                    className="w-full sm:w-auto text-center border border-gray-300 px-4 py-3.5 sm:py-2 text-base sm:text-sm text-fp-black hover:border-fp-black min-h-[44px] flex items-center justify-center"
                  >
                    Seguir comprando
                  </Link>
                  <Link
                    href="/checkout"
                    className="w-full sm:w-auto text-center bg-fp-black text-white px-6 py-3.5 sm:py-2 text-base sm:text-sm font-medium hover:bg-gray-800 min-h-[48px] flex items-center justify-center"
                  >
                    Finalizar compra
                  </Link>
                </div>
              </div>
            </div>

            {/* Botón fijo en móvil para que "Finalizar compra" siempre sea accesible */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
              <Link
                href="/checkout"
                className="block w-full bg-fp-black text-white py-3.5 text-center text-base font-medium hover:bg-gray-800"
              >
                Finalizar compra
              </Link>
            </div>
          </>
        )}
      </main>

      <StoreFooter />
    </div>
  );
}
