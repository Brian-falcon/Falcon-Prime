"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

/**
 * Header de la tienda. En desktop: navegación completa. En móvil: solo Tienda y Carrito (sin hamburguesa).
 */
export default function StoreHeader() {
  const { totalItems } = useCart();

  const navLinks = [
    { href: "/tienda", label: "Tienda" },
    { href: "/tienda?categoria=ropa", label: "Ropa" },
    { href: "/tienda?categoria=calzado", label: "Calzado" },
    { href: "/tienda?categoria=accesorios", label: "Accesorios" },
    { href: "/carrito", label: `Carrito${totalItems > 0 ? ` (${totalItems})` : ""}`, highlight: true },
  ];

  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-50">
      <div className="container-fp flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
        <Link href="/" className="text-lg sm:text-xl font-semibold tracking-tight text-fp-black shrink-0">
          FALCON PRIME
        </Link>

        {/* Desktop: navegación completa */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm text-fp-gray">
          {navLinks.map(({ href, label, highlight }) => (
            <Link
              key={href + label}
              href={href}
              className={highlight ? "text-fp-black font-medium hover:underline" : "hover:text-fp-black"}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Móvil: solo Tienda y Carrito, sin hamburguesa */}
        <nav className="flex md:hidden items-center gap-4 text-sm shrink-0">
          <Link href="/tienda" className="text-fp-gray hover:text-fp-black font-medium py-2">
            Tienda
          </Link>
          <Link
            href="/carrito"
            className="text-fp-black font-medium py-2 touch-manipulation"
            style={{ touchAction: "manipulation" }}
            aria-label={totalItems > 0 ? `Carrito, ${totalItems} productos` : "Carrito"}
          >
            Carrito{totalItems > 0 ? ` (${totalItems})` : ""}
          </Link>
        </nav>
      </div>
    </header>
  );
}
