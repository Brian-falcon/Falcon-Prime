import Link from "next/link";

/**
 * Footer de la tienda: enlaces, newsletter placeholder, legal, copyright.
 */
export default function StoreFooter() {
  return (
    <footer className="border-t border-gray-200 bg-[#fafafa] mt-auto">
      <div className="container-fp py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div>
            <p className="text-lg font-semibold tracking-tight text-fp-black mb-4">
              FALCON PRIME
            </p>
            <p className="text-sm text-fp-gray max-w-xs">
              Moda moderna, diseño limpio. Ropa, calzado y accesorios para tu día a día.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-fp-black mb-4">
              Tienda
            </p>
            <ul className="space-y-2 text-sm text-fp-gray">
              <li><Link href="/tienda" className="hover:text-fp-black transition-colors">Todos los productos</Link></li>
              <li><Link href="/tienda?categoria=ropa" className="hover:text-fp-black transition-colors">Ropa</Link></li>
              <li><Link href="/tienda?categoria=calzado" className="hover:text-fp-black transition-colors">Calzado</Link></li>
              <li><Link href="/tienda?categoria=accesorios" className="hover:text-fp-black transition-colors">Accesorios</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-fp-black mb-4">
              Ayuda
            </p>
            <ul className="space-y-2 text-sm text-fp-gray">
              <li><Link href="/tienda" className="hover:text-fp-black transition-colors">Envíos y entregas</Link></li>
              <li><Link href="/tienda" className="hover:text-fp-black transition-colors">Devoluciones</Link></li>
              <li><Link href="/tienda" className="hover:text-fp-black transition-colors">Preguntas frecuentes</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-fp-black mb-4">
              Contacto
            </p>
            <p className="text-sm text-fp-gray">
              consultas@falconprime.com
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-fp-gray">
          <p>© {new Date().getFullYear()} Falcon Prime. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="/tienda" className="hover:text-fp-black transition-colors">Términos</Link>
            <Link href="/tienda" className="hover:text-fp-black transition-colors">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
