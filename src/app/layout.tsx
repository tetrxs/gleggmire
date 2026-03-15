import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileNav from "@/components/layout/mobile-nav";
import { KonamiCode } from "@/components/troll/konami-code";
import { TimeEvents } from "@/components/troll/time-events";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "gleggmire.net — Das Gleggmire-Glossar",
  description:
    "Inoffizielles Fan-Projekt: Das umfassende Glossar und Clip-Archiv rund um den YouTuber Gleggmire. Von der Community, fuer die Community.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className="flex min-h-screen flex-col pb-[68px] md:pb-0"
        style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
      >
        <Header />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
          {children}
        </main>
        <Footer />
        <MobileNav />
        <KonamiCode />
        <TimeEvents />
      </body>
    </html>
  );
}
