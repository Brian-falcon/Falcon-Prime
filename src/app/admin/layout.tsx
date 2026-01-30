/**
 * Layout del panel de administración.
 * Redirige a /admin/login si no hay sesión.
 */
import { getAdminSession } from "@/lib/auth";
import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let adminId: string | null = null;
  try {
    adminId = await getAdminSession();
  } catch {
    // Si falla la DB o la sesión, mostramos children (p. ej. login) para que el formulario siempre aparezca
  }

  // Sin sesión mostramos la página actual (login u otra); el middleware redirige rutas protegidas a /admin/login
  if (!adminId) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-fp-light">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <Link href="/admin" className="font-semibold text-fp-black">
              Falcon Prime · Admin
            </Link>
            <nav className="flex gap-6 text-sm text-fp-gray">
              <Link href="/admin" className="hover:text-fp-black">
                Inicio
              </Link>
              <Link href="/admin/productos" className="hover:text-fp-black">
                Productos
              </Link>
              <Link href="/" target="_blank" rel="noopener" className="hover:text-fp-black">
                Ver tienda
              </Link>
              <LogoutButton />
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
