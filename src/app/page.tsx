/**
 * Falcon Prime - Página principal (Home)
 * Diseño minimalista inspirado en tiendas de moda premium.
 */
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header simple - se reemplazará por componente completo */}
      <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="container-fp flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-semibold tracking-tight text-fp-black">
            FALCON PRIME
          </Link>
          <nav className="hidden md:flex gap-8 text-sm text-fp-gray hover:[&>a]:text-fp-black">
            <Link href="/tienda">Tienda</Link>
            <Link href="/tienda?categoria=ropa">Ropa</Link>
            <Link href="/tienda?categoria=calzado">Calzado</Link>
            <Link href="/tienda?categoria=accesorios">Accesorios</Link>
            <Link href="/carrito">Carrito</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero minimalista */}
        <section className="py-24 md:py-32 text-center">
          <div className="container-fp">
            <h1 className="text-4xl md:text-6xl font-light tracking-tight text-fp-black mb-4">
              Falcon Prime
            </h1>
            <p className="text-fp-gray text-lg max-w-xl mx-auto mb-10">
              Moda moderna, diseño limpio. Descubre nuestra colección de ropa, calzado y accesorios.
            </p>
            <Link
              href="/tienda"
              className="inline-block border border-fp-black px-8 py-3 text-sm font-medium hover:bg-fp-black hover:text-white transition-colors"
            >
              Ver tienda
            </Link>
          </div>
        </section>

        {/* Enlaces rápidos a categorías */}
        <section className="border-t border-gray-100 py-16">
          <div className="container-fp grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { href: "/tienda?categoria=ropa", label: "Ropa", desc: "Prendas esenciales" },
              { href: "/tienda?categoria=calzado", label: "Calzado", desc: "Zapatos y sneakers" },
              { href: "/tienda?categoria=accesorios", label: "Accesorios", desc: "Complements" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group block text-center py-8 border border-transparent hover:border-fp-black transition-colors"
              >
                <span className="text-2xl font-light block mb-2 group-hover:underline">{item.label}</span>
                <span className="text-sm text-fp-gray">{item.desc}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 py-8 mt-auto">
        <div className="container-fp text-center text-sm text-fp-gray">
          <p>© {new Date().getFullYear()} Falcon Prime. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
