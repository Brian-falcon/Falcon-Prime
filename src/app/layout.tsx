import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import PwaInstallBanner from "@/components/PwaInstallBanner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Falcon Prime | Moda moderna",
  description: "Tienda online de ropa, calzado y accesorios. Diseño premium y minimalista.",
  icons: {
    icon: "/pwa-icon.png",
    apple: "/pwa-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "FALCON PRIME",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans antialiased">
        <CartProvider>{children}</CartProvider>
        <PwaInstallBanner />
      </body>
    </html>
  );
}
