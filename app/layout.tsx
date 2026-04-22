import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "@/components/pwa-register";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Job Application Tracker",
  description: "Production-ready mini ATS with Supabase",
  manifest: "/manifest.webmanifest",
  applicationName: "Job Application Tracker",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Job Tracker",
  },
  icons: {
    icon: [
      { url: "/icon-192x192.svg", type: "image/svg+xml", sizes: "192x192" },
      { url: "/icon-512x512.svg", type: "image/svg+xml", sizes: "512x512" },
    ],
    apple: [{ url: "/icon-192x192.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
