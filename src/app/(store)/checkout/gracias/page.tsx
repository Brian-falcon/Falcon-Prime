"use client";

/**
 * Página de confirmación después del checkout.
 */
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckoutGraciasPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200">
        <div className="container-fp flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-semibold tracking-tight text-fp-black">
            FALCON PRIME
          </Link>
        </div>
      </header>
      <main className="flex-1 container-fp py-24 text-center max-w-lg mx-auto">
        <h1 className="text-3xl font-light text-fp-black mb-4">Gracias por tu compra</h1>
        <p className="text-fp-gray mb-6">
          Tu pedido ha sido registrado correctamente.
          {orderId && (
            <span className="block mt-2 text-sm">
              Nº de pedido: <strong className="text-fp-black">{orderId}</strong>
            </span>
          )}
        </p>
        <p className="text-sm text-fp-gray mb-8">
          Te contactaremos por email para coordinar el envío. La integración de pagos estará disponible próximamente.
        </p>
        <Link
          href="/tienda"
          className="inline-block border border-fp-black px-8 py-3 text-sm font-medium hover:bg-fp-black hover:text-white transition-colors"
        >
          Seguir comprando
        </Link>
      </main>
      <footer className="border-t border-gray-200 py-8 mt-auto">
        <div className="container-fp text-center text-sm text-fp-gray">
          <p>© {new Date().getFullYear()} Falcon Prime.</p>
        </div>
      </footer>
    </div>
  );
}
