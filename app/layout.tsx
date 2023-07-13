import { cn } from "@/lib/utils";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rainime",
  description:
    "Free anime streaming website where you can watch English Subbed and Dubbed anime online. WATCH NOW! No Ads GUARANTEED!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background", inter.className)}>
        <div className="relative">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
