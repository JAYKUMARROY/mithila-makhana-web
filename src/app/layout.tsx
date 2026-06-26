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
  title: 'Mithila Makhana | Premium GI-Tagged Fox Nuts from Bihar',
  description: 'Mithila Makhana brings you the finest, GI-tagged organic fox nuts directly from the wetlands of Bihar. 100% vegan, gluten-free superfood for a healthy lifestyle.',
  keywords: 'makhana, fox nuts, mithila makhana, bihar makhana, healthy snacks, vegan snacks, gi tagged',
  metadataBase: new URL('https://mithilamakhana.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Mithila Makhana | Premium GI-Tagged Fox Nuts',
    description: 'The finest, GI-tagged organic fox nuts directly from the wetlands of Bihar.',
    url: 'https://mithilamakhana.com',
    siteName: 'Mithila Makhana',
    locale: 'en_IN',
    type: 'website',
  }
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
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Mithila Makhana",
                "url": "https://mithilamakhana.com",
                "logo": "https://mithilamakhana.com/logo.png",
                "description": "Premium GI-tagged organic fox nuts directly from the wetlands of Bihar."
              }) }}
            />
            <Footer />
            <BackToTop />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
