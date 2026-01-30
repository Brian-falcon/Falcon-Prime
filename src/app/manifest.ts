import type { MetadataRoute } from "next";

/**
 * Manifest PWA: permite instalar Falcon Prime como app (icono en escritorio / pantalla de inicio).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FALCON PRIME",
    short_name: "Falcon Prime",
    description: "Tienda online de ropa, calzado y accesorios. Moda moderna.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/pwa-icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
