import Link from "next/link";

/**
 * Barra de anuncio arriba del header (envío gratis, promos, etc.).
 */
export default function AnnouncementBar() {
  return (
    <div className="bg-fp-black text-white text-center py-2.5 px-4 text-sm">
      <p>
        Envío gratis en compras superiores a $5.000 —
        <Link href="/tienda" className="underline ml-1 hover:no-underline">
          Ver tienda
        </Link>
      </p>
    </div>
  );
}
