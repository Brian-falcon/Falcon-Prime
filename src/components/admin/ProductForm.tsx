"use client";

/**
 * Formulario compartido para crear y editar productos (admin).
 * Imágenes por URL; talles con stock.
 */
import { useState, useEffect } from "react";

type Category = { id: string; name: string; slug: string };

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  color: string;
  isActive: boolean;
  images: { url: string; alt: string }[];
  sizes: { size: string; stock: string }[];
};

const defaultForm: ProductFormData = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  color: "",
  isActive: true,
  images: [{ url: "", alt: "" }],
  sizes: [{ size: "", stock: "0" }],
};

type ProductFormProps = {
  productId?: string;
  onSuccess: () => void;
};

export default function ProductForm({ productId, onSuccess }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductFormData>(defaultForm);
  const [loading, setLoading] = useState(!!productId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        if (!productId && data[0]) setForm((f) => ({ ...f, categoryId: data[0].id }));
      }
    }
    loadCategories();
  }, [productId]);

  useEffect(() => {
    if (!productId) return;
    async function loadProduct() {
      const res = await fetch(`/api/admin/products/${productId}`);
      if (!res.ok) {
        setError("Producto no encontrado");
        setLoading(false);
        return;
      }
      const p = await res.json();
      setForm({
        name: p.name ?? "",
        description: p.description ?? "",
        price: p.price ?? "",
        categoryId: p.categoryId ?? "",
        color: p.color ?? "",
        isActive: p.isActive ?? true,
        images:
          p.images?.length > 0
            ? p.images.map((i: { url: string; alt: string | null }) => ({
                url: i.url,
                alt: i.alt ?? "",
              }))
            : [{ url: "", alt: "" }],
        sizes:
          p.sizes?.length > 0
            ? p.sizes.map((s: { size: string; stock: number }) => ({
                size: s.size,
                stock: String(s.stock),
              }))
            : [{ size: "", stock: "0" }],
      });
      setLoading(false);
    }
    loadProduct();
  }, [productId]);

  function addImage() {
    setForm((f) => ({ ...f, images: [...f.images, { url: "", alt: "" }] }));
  }
  function removeImage(i: number) {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, idx) => idx !== i),
    }));
  }
  function updateImage(i: number, field: "url" | "alt", value: string) {
    setForm((f) => ({
      ...f,
      images: f.images.map((img, idx) =>
        idx === i ? { ...img, [field]: value } : img
      ),
    }));
  }

  function addSize() {
    setForm((f) => ({ ...f, sizes: [...f.sizes, { size: "", stock: "0" }] }));
  }
  function removeSize(i: number) {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.filter((_, idx) => idx !== i),
    }));
  }
  function updateSize(i: number, field: "size" | "stock", value: string) {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.map((s, idx) =>
        idx === i ? { ...s, [field]: value } : s
      ),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price: parseFloat(form.price) || 0,
        categoryId: form.categoryId || undefined,
        color: form.color.trim() || undefined,
        isActive: form.isActive,
        images: form.images
          .filter((i) => i.url.trim())
          .map((i) => ({ url: i.url.trim(), alt: i.alt.trim() || undefined })),
        sizes: form.sizes
          .filter((s) => s.size.trim())
          .map((s) => ({
            size: s.size.trim(),
            stock: parseInt(s.stock, 10) || 0,
          })),
      };
      const url = productId
        ? `/api/admin/products/${productId}`
        : "/api/admin/products";
      const method = productId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Error al guardar");
        setSaving(false);
        return;
      }
      onSuccess();
    } catch {
      setError("Error de conexión");
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-fp-gray">Cargando…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <div>
        <label className="block text-sm font-medium text-fp-black mb-1">
          Nombre *
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-fp-black"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-fp-black mb-1">
          Descripción
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-fp-black min-h-[100px]"
          rows={4}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-fp-black mb-1">
            Precio *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-fp-black"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-fp-black mb-1">
            Categoría *
          </label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
            className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-fp-black"
            required
          >
            <option value="">Seleccionar</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-fp-black mb-1">
          Color
        </label>
        <input
          type="text"
          value={form.color}
          onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
          className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-fp-black"
          placeholder="Ej: Negro, Blanco"
        />
      </div>
      {productId && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={form.isActive}
            onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
            className="rounded border-gray-300"
          />
          <label htmlFor="isActive" className="text-sm text-fp-black">
            Producto activo (visible en tienda)
          </label>
        </div>
      )}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-fp-black">
            Imágenes (URL)
          </label>
          <button
            type="button"
            onClick={addImage}
            className="text-sm text-fp-black hover:underline"
          >
            + Añadir imagen
          </button>
        </div>
        {form.images.map((img, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="url"
              value={img.url}
              onChange={(e) => updateImage(i, "url", e.target.value)}
              placeholder="https://..."
              className="flex-1 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-fp-black"
            />
            <input
              type="text"
              value={img.alt}
              onChange={(e) => updateImage(i, "alt", e.target.value)}
              placeholder="Alt"
              className="w-24 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-fp-black"
            />
            {form.images.length > 1 && (
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="text-red-600 text-sm hover:underline"
              >
                Quitar
              </button>
            )}
          </div>
        ))}
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-fp-black">
            Talles y stock
          </label>
          <button
            type="button"
            onClick={addSize}
            className="text-sm text-fp-black hover:underline"
          >
            + Añadir talle
          </button>
        </div>
        {form.sizes.map((s, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              value={s.size}
              onChange={(e) => updateSize(i, "size", e.target.value)}
              placeholder="S, M, L, 42..."
              className="w-24 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-fp-black"
            />
            <input
              type="number"
              min="0"
              value={s.stock}
              onChange={(e) => updateSize(i, "stock", e.target.value)}
              placeholder="Stock"
              className="w-20 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-fp-black"
            />
            {form.sizes.length > 1 && (
              <button
                type="button"
                onClick={() => removeSize(i)}
                className="text-red-600 text-sm hover:underline"
              >
                Quitar
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-fp-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Guardando…" : productId ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </form>
  );
}
