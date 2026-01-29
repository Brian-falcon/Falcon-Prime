/**
 * Dashboard del panel de administración.
 */
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-light text-fp-black mb-2">Panel de administración</h1>
      <p className="text-fp-gray mb-8">
        Gestiona productos, categorías y stock desde aquí.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/productos"
          className="block p-6 bg-white border border-gray-200 hover:border-fp-black transition-colors"
        >
          <span className="text-lg font-medium text-fp-black">Productos</span>
          <p className="text-sm text-fp-gray mt-1">
            Agregar, editar y eliminar productos. Subir imágenes y gestionar talles y stock.
          </p>
        </Link>
        <Link
          href="/admin/productos/nuevo"
          className="block p-6 bg-white border border-gray-200 hover:border-fp-black transition-colors"
        >
          <span className="text-lg font-medium text-fp-black">Nuevo producto</span>
          <p className="text-sm text-fp-gray mt-1">
            Crear un producto nuevo con categoría, precio, descripción e imágenes.
          </p>
        </Link>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-6 bg-white border border-gray-200 hover:border-fp-black transition-colors"
        >
          <span className="text-lg font-medium text-fp-black">Ver tienda</span>
          <p className="text-sm text-fp-gray mt-1">
            Abrir la tienda pública en una nueva pestaña.
          </p>
        </a>
      </div>
    </div>
  );
}
