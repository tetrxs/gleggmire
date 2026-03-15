import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileNav from "@/components/layout/mobile-nav";
import { KonamiCode } from "@/components/troll/konami-code";
import { TimeEvents } from "@/components/troll/time-events";

export const metadata: Metadata = {
  title: "gleggmire.net \u2014 Das Gleggmire-Glossar",
  description:
    "Inoffizielles Fan-Projekt: Das umfassende Glossar und Clip-Archiv rund um den YouTuber Gleggmire. Von der Community, fuer die Community.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="flex min-h-screen flex-col pb-[60px] md:pb-0">
        <Header />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
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
