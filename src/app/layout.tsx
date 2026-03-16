import type { Metadata } from "next";
import { Space_Grotesk, Lilita_One } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { KonamiCode } from "@/components/troll/konami-code";
import { TimeEvents } from "@/components/troll/time-events";
import { CookieConsentBanner } from "@/components/ui/cookie-consent";
import { SuggestionModal } from "@/components/ui/suggestion-modal";
import { TermSubmitModal } from "@/components/glossary/term-submit-modal";

import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { DiscordServerCheck } from "@/components/ui/discord-server-check";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const lilitaOne = Lilita_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "gleggmire.net — Das Gleggmire-Glossar",
  description:
    "Inoffizielles Fan-Projekt: Das umfassende Community-Lexikon rund um den YouTuber Gleggmire. Von der Community, fuer die Community.",
  icons: {
    icon: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${spaceGrotesk.variable} ${lilitaOne.variable}`} suppressHydrationWarning>
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
        className="flex min-h-screen flex-col"
        style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
      >
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-8">
          {children}
        </main>
        <Footer />
        <KonamiCode />
        <TimeEvents />
        <CookieConsentBanner />
        <SuggestionModal />
        <TermSubmitModal />

        <DiscordServerCheck />
        <ScrollToTop />
      </body>
    </html>
  );
}
