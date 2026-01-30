"use client";

/**
 * Página individual de producto: imágenes, nombre, precio, descripción, talle, agregar al carrito.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import StoreFooter from "@/components/store/StoreFooter";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  color: string | null;
  category: { id: string; name: string; slug: string };
  images: { id: string; url: string; alt: string | null; sortOrder: number }[];
  sizes: { id: string; size: string; stock: number }[];
};

export default function ProductoPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const { addItem } = useCart();

  useEffect(() => {
    setImageIndex(0);
    async function load() {
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          const firstWithStock = data.sizes?.find((s: { stock: number }) => s.stock > 0);
          if (firstWithStock) setSelectedSize(firstWithStock.size);
        } else {
          setProduct(null);
        }
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  function handleAddToCart() {
    if (!product || !selectedSize) {
      alert("Selecciona un talle.");
      return;
    }
    const sizeRow = product.sizes.find((s) => s.size === selectedSize);
    if (!sizeRow || sizeRow.stock < 1) {
      alert("No hay stock para ese talle.");
      return;
    }
    addItem({
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      price: parseFloat(product.price),
      size: selectedSize,
      quantity: 1,
      imageUrl: sortedImages[0]?.url ?? null,
    });
    alert("Agregado al carrito.");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-fp-gray">Cargando…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-fp-gray">Producto no encontrado.</p>
        <Link href="/tienda" className="text-fp-black underline">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const availableSizes = product.sizes.filter((s) => s.stock > 0);
  const totalStock = product.sizes.reduce((acc, s) => acc + s.stock, 0);
  const sortedImages = [...(product.images || [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );
  const mainImage = sortedImages[imageIndex] ?? sortedImages[0];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="container-fp flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-semibold tracking-tight text-fp-black">
            FALCON PRIME
          </Link>
          <nav className="hidden md:flex gap-8 text-sm text-fp-gray hover:[&>a]:text-fp-black">
            <Link href="/tienda">Tienda</Link>
            <Link href="/carrito">Carrito</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container-fp py-8">
        <div className="mb-4 text-sm text-fp-gray">
          <Link href="/tienda" className="hover:text-fp-black">Tienda</Link>
          <span className="mx-2">/</span>
          <Link href={`/tienda?categoria=${product.category.slug}`} className="hover:text-fp-black">
            {product.category.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-fp-black">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl">
          <div className="space-y-3">
            <div className="aspect-[3/4] bg-fp-light overflow-hidden rounded-sm">
              {mainImage ? (
                <img
                  src={mainImage.url}
                  alt={mainImage.alt ?? product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-fp-gray text-sm">
                  Sin imagen
                </div>
              )}
            </div>
            {sortedImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {sortedImages.map((img, i) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setImageIndex(i)}
                    className={`shrink-0 w-16 h-20 rounded overflow-hidden border-2 transition-colors ${
                      i === imageIndex
                        ? "border-fp-black ring-1 ring-fp-black"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt ?? ""}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-light text-fp-black mb-2">{product.name}</h1>
            <p className="text-xl text-fp-black mb-4">
              {formatPrice(parseFloat(product.price), { currency: "ARS" })}
            </p>
            {product.description && (
              <p className="text-fp-gray text-sm mb-6 whitespace-pre-wrap">
                {product.description}
              </p>
            )}
            {product.color && (
              <p className="text-sm text-fp-gray mb-2">
                Color: <span className="text-fp-black">{product.color}</span>
              </p>
            )}

            <div className="mb-6">
              <p className="text-sm font-medium text-fp-black mb-2">Talle</p>
              <div className="flex flex-wrap gap-2">
                {availableSizes.length === 0 ? (
                  <p className="text-fp-gray text-sm">Sin stock</p>
                ) : (
                  availableSizes.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSize(s.size)}
                      className={`px-4 py-2 border text-sm ${
                        selectedSize === s.size
                          ? "border-fp-black bg-fp-black text-white"
                          : "border-gray-300 text-fp-black hover:border-fp-black"
                      }`}
                    >
                      {s.size}
                    </button>
                  ))
                )}
              </div>
            </div>

            {totalStock > 0 ? (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className="w-full border border-fp-black py-3 text-sm font-medium text-fp-black hover:bg-fp-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Agregar al carrito
              </button>
            ) : (
              <p className="text-fp-gray text-sm">No hay stock disponible.</p>
            )}

            <Link
              href="/tienda"
              className="inline-block mt-4 text-sm text-fp-gray hover:text-fp-black"
            >
              ← Seguir comprando
            </Link>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
