"use client";

/**
 * Alta de nuevo producto en el panel de administración.
 */
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

export default function AdminProductosNuevoPage() {
  const router = useRouter();

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/productos"
          className="text-sm text-fp-gray hover:text-fp-black"
        >
          ← Volver a productos
        </Link>
        <h1 className="text-2xl font-light text-fp-black mt-2">Nuevo producto</h1>
      </div>
      <ProductForm
        onSuccess={() => {
          router.push("/admin/productos");
          router.refresh();
        }}
      />
    </div>
  );
}
