import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk, Outfit } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { AmbientBackground } from "@/components/AmbientBackground";
import "lenis/dist/lenis.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const jetBrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-brand", weight: ["300", "400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Advait — Developers & Visionaries",
  description: "An independent collective for developers and visionaries building thoughtful technology.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrains.variable} ${outfit.variable}`}>
        <SmoothScroll />
        <AmbientBackground />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
