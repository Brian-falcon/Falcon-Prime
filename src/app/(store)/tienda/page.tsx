"use client";

/**
 * Catálogo de la tienda con filtros (categoría, talle, color, precio).
 */
import { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import AnnouncementBar from "@/components/store/AnnouncementBar";
import StoreBenefits from "@/components/store/StoreBenefits";
import StoreFooter from "@/components/store/StoreFooter";
import StoreHeader from "@/components/store/StoreHeader";

type Category = { id: string; name: string; slug: string };
type Product = {
  id: string;
  name: string;
  slug: string;
  price: string;
  color: string | null;
  category: Category;
  images: { id: string; url: string; alt: string | null; sortOrder: number }[];
  sizes: { id: string; size: string; stock: number }[];
};

function TiendaContent() {
  const searchParams = useSearchParams();
  const initialCategoria = useMemo(
    () => searchParams.get("categoria") ?? "",
    [searchParams]
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    categoria: initialCategoria,
    talle: "",
    color: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    setFilters((f) => ({ ...f, categoria: initialCategoria }));
  }, [initialCategoria]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    const params = new URLSearchParams();
    if (filters.categoria) params.set("categoria", filters.categoria);
    if (filters.talle) params.set("talle", filters.talle);
    if (filters.color) params.set("color", filters.color);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    try {
      const res = await fetch(`/api/products?${params.toString()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const data = await res.json().catch(() => []);
      if (res.ok) {
        setProducts(Array.isArray(data) ? data : []);
      } else {
        setProducts([]);
        setApiError(data?.error ?? "Error al cargar productos");
      }
    } catch {
      setProducts([]);
      setApiError("No se pudo conectar. Revisá que DATABASE_URL esté en Vercel.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    async function loadCategories() {
      const res = await fetch("/api/categories", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    }
    loadCategories();
  }, []);

  const colors = Array.from(
    new Set(products.map((p) => p.color).filter(Boolean)) as Set<string>
  ).sort();

  const uniqueSizes = Array.from(
    new Set(products.flatMap((p) => p.sizes.map((s) => s.size)))
  ).filter(Boolean).sort();

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <StoreHeader />
      <StoreBenefits />

      <main className="flex-1 container-fp py-8 md:py-10">
        <div className="mb-6 md:mb-8">
          <nav className="text-sm text-fp-gray mb-2">
            <Link href="/" className="hover:text-fp-black">Inicio</Link>
            <span className="mx-2">/</span>
            <span className="text-fp-black">Tienda</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-light text-fp-black">
            Tienda
          </h1>
          {!loading && !apiError && (
            <p className="text-fp-gray text-sm mt-1">
              {products.length === 0
                ? "No hay productos con esos filtros."
                : `${products.length} ${products.length === 1 ? "producto" : "productos"}`}
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-56 shrink-0">
            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-fp-black mb-1">Categoría</label>
                <select
                  value={filters.categoria}
                  onChange={(e) => setFilters((f) => ({ ...f, categoria: e.target.value }))}
                  className="w-full border border-gray-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fp-black"
                >
                  <option value="">Todas</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium text-fp-black mb-1">Talle</label>
                <select
                  value={filters.talle}
                  onChange={(e) => setFilters((f) => ({ ...f, talle: e.target.value }))}
                  className="w-full border border-gray-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fp-black"
                >
                  <option value="">Todos</option>
                  {uniqueSizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              {colors.length > 0 && (
                <div>
                  <label className="block font-medium text-fp-black mb-1">Color</label>
                  <select
                    value={filters.color}
                    onChange={(e) => setFilters((f) => ({ ...f, color: e.target.value }))}
                    className="w-full border border-gray-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fp-black"
                  >
                    <option value="">Todos</option>
                    {colors.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-fp-black mb-1">Precio mín</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={filters.minPrice}
                    onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
                    placeholder="0"
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-fp-black"
                  />
                </div>
                <div>
                  <label className="block font-medium text-fp-black mb-1">Precio máx</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
                    placeholder="—"
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-fp-black"
                  />
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {apiError ? (
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                <p className="font-medium">Error al cargar la tienda</p>
                <p className="mt-1">{apiError}</p>
                <p className="mt-2 text-xs">Si estás en Vercel: Settings → Environment Variables → agregá DATABASE_URL (tu connection string de Neon).</p>
              </div>
            ) : loading ? (
              <p className="text-fp-gray">Cargando…</p>
            ) : products.length === 0 ? (
              <p className="text-fp-gray">No hay productos con esos filtros.</p>
            ) : (
              <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/tienda/${p.slug}`}
                      className="block group"
                    >
                      <div className="aspect-[3/4] bg-fp-light overflow-hidden relative mb-3">
                        {p.images[0] ? (
                          <img
                            src={p.images[0].url}
                            alt={p.images[0].alt ?? p.name}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-fp-gray text-sm">
                            Sin imagen
                          </div>
                        )}
                      </div>
                      <p className="font-medium text-fp-black text-sm group-hover:underline line-clamp-2">
                        {p.name}
                      </p>
                      <p className="text-fp-black text-sm mt-1 font-medium">
                        {formatPrice(parseFloat(p.price), { currency: "ARS" })}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}

export default function TiendaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-fp-gray">Cargando…</p>
      </div>
    }>
      <TiendaContent />
    </Suspense>
  );
}
