import React from "react"
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AccessibilityProvider } from "@/components/accessibility-provider";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Participa DF – Ouvidoria Cidadã",
  description:
    "Registre sua manifestação na Ouvidoria do Governo do Distrito Federal de forma rápida, simples e acessível.",
  generator: "Governo do Distrito Federal",
  manifest: "/manifest.json",
  keywords: [
    "ouvidoria",
    "GDF",
    "Distrito Federal",
    "manifestação",
    "cidadão",
    "governo",
  ],
  authors: [{ name: "Governo do Distrito Federal" }],
  icons: {
    icon: [
      { url: "/icon-192x192.jpg", sizes: "192x192", type: "image/jpeg" },
      { url: "/icon-512x512.jpg", sizes: "512x512", type: "image/jpeg" },
    ],
    apple: "/apple-touch-icon.jpg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Participa DF",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e3a5f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="font-sans antialiased">
        <AccessibilityProvider>
          <a href="#main-content" className="skip-link">
            Pular para o conteúdo principal
          </a>
          {children}
          <ServiceWorkerRegister />
        </AccessibilityProvider>
        <Analytics />
      </body>
    </html>
  );
}
