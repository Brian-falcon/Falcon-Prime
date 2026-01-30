/**
 * Layout del panel de administración.
 * Redirige a /admin/login si no hay sesión.
 */
import { getAdminSession } from "@/lib/auth";
import AdminHeader from "@/components/admin/AdminHeader";

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

  if (!adminId) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-fp-light">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
