"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

/**
 * Header de la tienda: menú hamburguesa en móvil con Carrito siempre visible.
 */
export default function StoreHeader() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

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

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm text-fp-gray">
          {navLinks.map(({ href, label, highlight }) => (
            <Link
              key={href + label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={highlight ? "text-fp-black font-medium hover:underline" : "hover:text-fp-black"}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile: botón Carrito siempre visible + menú hamburguesa */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/carrito"
            className="flex items-center justify-center min-w-[44px] min-h-[44px] -m-2 text-fp-black font-medium"
            aria-label={`Carrito${totalItems > 0 ? `, ${totalItems} productos` : ""}`}
          >
            Carrito {totalItems > 0 ? `(${totalItems})` : ""}
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] -m-2 p-2 text-fp-black"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            <span className="sr-only">{menuOpen ? "Cerrar" : "Menú"}</span>
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Overlay y menú móvil */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
          <nav
            className="fixed top-14 sm:top-16 right-0 bottom-0 left-0 bg-white z-50 md:hidden overflow-y-auto"
            aria-label="Menú principal"
          >
            <ul className="container-fp py-6 space-y-1">
              {navLinks.map(({ href, label, highlight }) => (
                <li key={href + label}>
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`block py-3 px-4 text-base rounded-lg active:bg-gray-100 ${highlight ? "text-fp-black font-semibold bg-fp-light" : "text-fp-gray hover:bg-gray-50 hover:text-fp-black"}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </header>
  );
}
