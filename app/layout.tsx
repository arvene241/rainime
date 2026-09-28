import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Archivo, Dela_Gothic_One, JetBrains_Mono, Zen_Kaku_Gothic_New } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DEFAULT_DESIGN, designs, siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
const dela = Dela_Gothic_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dela",
  display: "swap",
});
const zen = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-zen",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "rainime — watch anime free",
    template: "%s · rainime",
  },
  description: siteConfig.description,
  openGraph: {
    siteName: siteConfig.name,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1b1f27",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-design={DEFAULT_DESIGN}
      suppressHydrationWarning
      className={cn(archivo.variable, mono.variable, dela.variable, zen.variable)}
    >
      <body className="min-h-screen flex flex-col">
        <ThemeProvider
          attribute="data-design"
          defaultTheme={DEFAULT_DESIGN}
          themes={designs.map((d) => d.id)}
          enableSystem={false}
          storageKey="rainime-design"
        >
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] btn btn-primary"
          >
            Skip to content
          </a>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
