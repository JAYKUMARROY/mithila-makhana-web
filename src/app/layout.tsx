import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/components/cart-context";
import { ToastProvider } from "@/components/toast";
import { BackToTop } from "@/components/back-to-top";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mithila Makhana | Premium Superfood from Bihar",
  description: "Direct from the farms of Bihar to your home.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outfit.variable} ${inter.variable} antialiased bg-cream-bg font-body-md text-charcoal-text`}
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-forest-deep focus:text-white focus:rounded-lg">
          Skip to content
        </a>
        <ToastProvider>
          <CartProvider>
            <Navbar />
            <main id="main-content">{children}</main>
            <Footer />
            <BackToTop />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
