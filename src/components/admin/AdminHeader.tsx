"use client";

/**
 * Header del panel admin: menú hamburguesa en móvil para poder acceder a Productos y acciones.
 */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function LogoutButton() {
  const router = useRouter();
  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
      router.refresh();
    }
  }
  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-sm text-fp-gray hover:text-fp-black min-h-[44px] min-w-[44px] flex items-center justify-center md:min-w-0 md:min-h-0 md:py-0 md:px-0"
    >
      Cerrar sesión
    </button>
  );
}

export default function AdminHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/admin", label: "Inicio" },
    { href: "/admin/productos", label: "Productos" },
    { href: "/admin/pedidos", label: "Pedidos" },
    { href: "/", label: "Ver tienda", external: true },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 min-h-[56px]">
          <Link href="/admin" className="font-semibold text-fp-black shrink-0">
            Falcon Prime · Admin
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-fp-gray">
            {links.map(({ href, label, external }) => (
              <Link
                key={href}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener" : undefined}
                className="hover:text-fp-black"
              >
                {label}
              </Link>
            ))}
            <LogoutButton />
          </nav>

          {/* Mobile: menú hamburguesa */}
          <div className="flex md:hidden items-center gap-1">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center justify-center min-w-[44px] min-h-[44px] -m-2 text-fp-black"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
          <nav className="fixed top-14 right-0 bottom-0 left-0 bg-white z-50 md:hidden overflow-y-auto">
            <ul className="max-w-7xl mx-auto px-4 py-6 space-y-1">
              {links.map(({ href, label, external }) => (
                <li key={href}>
                  <Link
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 px-4 text-base rounded-lg text-fp-gray hover:bg-gray-50 hover:text-fp-black active:bg-gray-100"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li className="[&_button]:w-full [&_button]:justify-start [&_button]:px-4 [&_button]:rounded-lg [&_button]:text-left">
                <LogoutButton />
              </li>
            </ul>
          </nav>
        </>
      )}
    </header>
  );
}
