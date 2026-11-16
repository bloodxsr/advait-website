import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk, Outfit } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { AmbientBackground } from "@/components/AmbientBackground";
import { PageLoader } from "@/components/PageLoader";
import "lenis/dist/lenis.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const jetBrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-brand",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://advait.collective"),
  title: {
    default: "ADVAIT® — Association of Developers and Visionaries in AI & Tech",
    template: "%s | ADVAIT®",
  },
  description:
    "An independent collective of developers and visionaries building open architectures, autonomous systems, and enduring research.",
  keywords: [
    "Advait",
    "AI",
    "Distributed Systems",
    "Research",
    "Open Source",
    "Engineering Collective",
    "Developers",
    "Visionaries",
  ],
  icons: {
    icon: "/brand/advait-logo.png",
    apple: "/brand/advait-logo.png",
  },
  openGraph: {
    title: "ADVAIT® — Association of Developers and Visionaries in AI & Tech",
    description:
      "An independent collective building open architectures, autonomous systems, and enduring research.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/brand/advait-logo.png",
        width: 1200,
        height: 630,
        alt: "ADVAIT Collective",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tiny5&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrains.variable} ${outfit.variable}`}
      >
        <PageLoader />
        <SmoothScroll />
        <AmbientBackground />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
