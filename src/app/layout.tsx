import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "El Rinconcito — Cocina peruana",
    template: "%s · El Rinconcito",
  },
  description:
    "El Rinconcito — cocina peruana con ingredientes frescos. Explora la carta y pide en línea.",
  keywords: ["comida peruana", "restaurante", "pedidos", "delivery", "menú"],
  openGraph: {
    title: "El Rinconcito — Cocina peruana",
    description:
      "Cocina peruana con ingredientes frescos. Explora la carta y pide en línea.",
    type: "website",
    locale: "es_PE",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        {children}
      </body>
    </html>
  );
}
