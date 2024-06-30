import type { Metadata } from "next";
import { Archivo, Libre_Franklin } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "./providers";

import { Toaster } from "@/components/ui/toaster";
import { initAction } from "./_initAction";

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});

const libre_franklin = Libre_Franklin({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-libre_franklin",
});

export const metadata: Metadata = {
  title: "Next JS Dashboard Template",
  description: "Build with Next JS Drizzle Mysql",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await initAction();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          archivo.variable + " " + libre_franklin.variable
        )}
      >
        <Providers>
          <div className="w-full mx-auto container py-12">{children}</div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
