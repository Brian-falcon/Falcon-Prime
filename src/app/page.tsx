/**
 * Falcon Prime - Página principal (Home)
 * Diseño tipo tienda premium: anuncio, hero, beneficios, categorías, newsletter, footer.
 */
import Link from "next/link";
import AnnouncementBar from "@/components/store/AnnouncementBar";
import StoreBenefits from "@/components/store/StoreBenefits";
import StoreFooter from "@/components/store/StoreFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />

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
        {/* Hero */}
        <section className="relative py-20 md:py-28 lg:py-32 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[#f8f8f8]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/80" />
          <div className="container-fp relative">
            <p className="text-xs uppercase tracking-[0.2em] text-fp-gray mb-4">
              Nueva temporada
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-fp-black mb-5 max-w-2xl mx-auto">
              Moda que se adapta a vos
            </h1>
            <p className="text-fp-gray text-lg max-w-xl mx-auto mb-10">
              Descubrí nuestra colección de ropa, calzado y accesorios. Diseño limpio, calidad premium.
            </p>
            <Link
              href="/tienda"
              className="inline-block bg-fp-black text-white px-8 py-3.5 text-sm font-medium hover:bg-[#333] transition-colors"
            >
              Ver colección
            </Link>
          </div>
        </section>

        <StoreBenefits />

        {/* Categorías */}
        <section className="py-16 md:py-20">
          <div className="container-fp">
            <h2 className="text-2xl md:text-3xl font-light text-fp-black mb-10 text-center">
              Explorar por categoría
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
              {[
                { href: "/tienda?categoria=ropa", label: "Ropa", desc: "Prendas esenciales para tu día a día" },
                { href: "/tienda?categoria=calzado", label: "Calzado", desc: "Zapatos y sneakers" },
                { href: "/tienda?categoria=accesorios", label: "Accesorios", desc: "Complements para completar tu look" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group block border border-gray-200 bg-white p-8 md:p-10 hover:border-fp-black hover:shadow-md transition-all duration-200"
                >
                  <span className="text-xl md:text-2xl font-light text-fp-black block mb-2 group-hover:underline">
                    {item.label}
                  </span>
                  <span className="text-sm text-fp-gray">{item.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Por qué comprar */}
        <section className="py-16 md:py-20 bg-[#fafafa]">
          <div className="container-fp">
            <h2 className="text-2xl font-light text-fp-black mb-12 text-center">
              Por qué Falcon Prime
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center max-w-4xl mx-auto">
              <div>
                <p className="text-3xl font-light text-fp-black mb-2">Calidad</p>
                <p className="text-sm text-fp-gray">
                  Materiales seleccionados y acabados que duran.
                </p>
              </div>
              <div>
                <p className="text-3xl font-light text-fp-black mb-2">Diseño</p>
                <p className="text-sm text-fp-gray">
                  Piezas atemporales que se adaptan a tu estilo.
                </p>
              </div>
              <div>
                <p className="text-3xl font-light text-fp-black mb-2">Experiencia</p>
                <p className="text-sm text-fp-gray">
                  Compra simple, envío rápido y atención al cliente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-20 md:py-24 border-t border-gray-100">
          <div className="container-fp text-center">
            <h2 className="text-2xl md:text-3xl font-light text-fp-black mb-4">
              ¿Listo para descubrir?
            </h2>
            <p className="text-fp-gray mb-8 max-w-md mx-auto">
              Entrá a la tienda y encontrá tu próxima prenda favorita.
            </p>
            <Link
              href="/tienda"
              className="inline-block border-2 border-fp-black px-8 py-3.5 text-sm font-medium text-fp-black hover:bg-fp-black hover:text-white transition-colors"
            >
              Ir a la tienda
            </Link>
          </div>
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}
