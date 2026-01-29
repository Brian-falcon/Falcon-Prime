"use client";

/**
 * Listado de productos en el panel de administración.
 */
import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: string;
  isActive: boolean;
  category: { id: string; name: string; slug: string };
  images: { id: string; url: string; alt: string | null }[];
  sizes: { id: string; size: string; stock: number }[];
};

export default function AdminProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/admin/products", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data?.error ?? "Error al cargar productos");
          setProducts([]);
          return;
        }
        setProducts(Array.isArray(data) ? data : []);
      } catch {
        setError("Error de conexión. Revisá que DATABASE_URL esté en Vercel.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar el producto "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        alert("Error al eliminar");
        return;
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Error de conexión");
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-light text-fp-black mb-6">Productos</h1>
        <p className="text-fp-gray">Cargando…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-light text-fp-black mb-6">Productos</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-light text-fp-black">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="bg-fp-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800"
        >
          Nuevo producto
        </Link>
      </div>
      {products.length === 0 ? (
        <p className="text-fp-gray">No hay productos. Crea el primero desde Nuevo producto.</p>
      ) : (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-fp-light">
              <tr>
                <th className="p-3 font-medium text-fp-black">Producto</th>
                <th className="p-3 font-medium text-fp-black">Categoría</th>
                <th className="p-3 font-medium text-fp-black">Precio</th>
                <th className="p-3 font-medium text-fp-black">Stock</th>
                <th className="p-3 font-medium text-fp-black">Estado</th>
                <th className="p-3 font-medium text-fp-black w-40">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const totalStock = p.sizes.reduce((acc, s) => acc + s.stock, 0);
                return (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {p.images[0] ? (
                          <img
                            src={p.images[0].url}
                            alt={p.images[0].alt ?? p.name}
                            className="w-12 h-12 object-cover bg-gray-100"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-fp-gray text-xs">
                            Sin imagen
                          </div>
                        )}
                        <span className="font-medium text-fp-black">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-fp-gray">{p.category.name}</td>
                    <td className="p-3 text-fp-black">${p.price}</td>
                    <td className="p-3 text-fp-gray">{totalStock} u.</td>
                    <td className="p-3">
                      <span
                        className={
                          p.isActive
                            ? "text-green-600"
                            : "text-fp-gray"
                        }
                      >
                        {p.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <Link
                        href={`/admin/productos/${p.id}/editar`}
                        className="text-fp-black hover:underline"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id, p.name)}
                        className="text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
