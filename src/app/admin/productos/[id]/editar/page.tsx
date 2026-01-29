"use client";

/**
 * Edición de producto en el panel de administración.
 */
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

export default function AdminProductosEditarPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/productos"
          className="text-sm text-fp-gray hover:text-fp-black"
        >
          ← Volver a productos
        </Link>
        <h1 className="text-2xl font-light text-fp-black mt-2">Editar producto</h1>
      </div>
      <ProductForm
        productId={id}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </div>
  );
}
