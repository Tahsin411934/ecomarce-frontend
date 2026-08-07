$content = @'
import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

import StoreProvider from "@/lib/StoreProvider";
import NavbarServer from "@/components/layout/NavbarServer";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import ToastProvider from "@/components/ui/ToastProvider";
import ScrollToTop from "@/components/ui/ScrollToTop";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Shopio - Premium E-Commerce | Your Premium Online Shopping Destination",
    template: "%s | Shopio",
  },
  description:
    "Shopio is your premium online shopping destination. Discover top-quality products at unbeatable prices with fast, reliable delivery across Bangladesh.",
  keywords: ["ecommerce", "shop", "online shopping", "Shopio", "Bangladesh", "best deals"],
  applicationName: "Shopio",
  authors: [{ name: "Shopio" }],
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  creator: "Shopio",
  publisher: "Shopio",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shopio.com",
    siteName: "Shopio",
    title: "Shopio - Premium E-Commerce",
    description:
      "Your premium online shopping destination for top-quality products with unbeatable prices and fast delivery.",
    images: [
      {
        url: "https://shopio.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Shopio - Premium E-Commerce",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopio - Premium E-Commerce",
    description:
      "Your premium online shopping destination for top-quality products with unbeatable prices and fast delivery.",
    images: ["https://shopio.com/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
  category: "ecommerce",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#22C55E",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <StoreProvider>
          <ScrollToTop />
          <NavbarServer />
          <main className="min-h-screen w-full">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <MobileBottomNav />
          <ToastProvider />
        </StoreProvider>
      </body>
    </html>
  );
}
'@

$basePath = '\\?\E:\ecommerce-backend\main-project (2)\frontend\src\app\'
$newFile = $basePath + 'layout_new.tsx'
$targetFile = $basePath + 'layout.tsx'

try {
    # Write content to layout_new.tsx
    [System.IO.File]::WriteAllText($newFile, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Written to layout_new.tsx"

    # Try to remove the corrupted layout.tsx
    try {
        Remove-Item -LiteralPath $targetFile -Force -ErrorAction Stop
        Write-Host "Removed corrupted layout.tsx"
    } catch {
        Write-Host "Remove failed: $($_.Exception.Message)"
    }

    # Try to rename layout_new.tsx to layout.tsx
    try {
        Rename-Item -LiteralPath $newFile -NewName 'layout.tsx' -Force -ErrorAction Stop
        Write-Host "Renamed layout_new.tsx to layout.tsx"
    } catch {
        Write-Host "Rename failed: $($_.Exception.Message)"
        
        # Try Move-Item
        try {
            Move-Item -LiteralPath $newFile -Destination $targetFile -Force -ErrorAction Stop
            Write-Host "Moved layout_new.tsx to layout.tsx"
        } catch {
            Write-Host "Move failed: $($_.Exception.Message)"
        }
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}