import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'FishWale | Premium Fresh Fish Delivered in Tripura',
    template: '%s | FishWale'
  },
  description: 'Order premium river and sea fish, hygienically cleaned and delivered fresh to your doorstep across Agartala and Tripura.',
  keywords: ['fish delivery agartala', 'fresh fish tripura', 'buy fish online agartala', 'seafood delivery tripura', 'premium fish'],
  authors: [{ name: 'FishWale' }],
  openGraph: {
    title: 'FishWale | Premium Fresh Fish Delivered in Tripura',
    description: 'Order premium river and sea fish, hygienically cleaned and delivered fresh to your doorstep across Agartala and Tripura.',
    url: 'https://fishwale.com',
    siteName: 'FishWale',
    images: [
      {
        url: '/images/hero.png',
        width: 1200,
        height: 630,
        alt: 'FishWale Premium Seafood',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FishWale | Premium Fresh Fish Delivered in Tripura',
    description: 'Order premium river and sea fish, hygienically cleaned and delivered fresh to your doorstep across Agartala and Tripura.',
    images: ['/images/hero.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="antialiased min-h-screen flex flex-col font-sans bg-background text-foreground">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
