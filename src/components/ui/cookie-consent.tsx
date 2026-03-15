"use client";

import { useState, useEffect, useCallback } from "react";
import { Modal } from "@/components/ui/modal";

interface CookiePreferences {
  necessary: true;
  embeds: boolean;
}

const STORAGE_KEY = "gleggmire-cookie-consent";

function getStoredPrefs(): CookiePreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookiePreferences;
  } catch {
    return null;
  }
}

function storePrefs(prefs: CookiePreferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

export function useCookieConsent() {
  const [prefs, setPrefs] = useState<CookiePreferences | null>(null);

  useEffect(() => {
    setPrefs(getStoredPrefs());
  }, []);

  const accept = useCallback((p: CookiePreferences) => {
    storePrefs(p);
    setPrefs(p);
  }, []);

  return { prefs, accept };
}

export function CookieConsentBanner() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"banner" | "settings">("banner");
  const [hasConsent, setHasConsent] = useState(false);
  const [embedsEnabled, setEmbedsEnabled] = useState(false);

  useEffect(() => {
    const stored = getStoredPrefs();
    if (!stored) {
      setOpen(true);
    } else {
      setHasConsent(true);
    }

    const handler = () => {
      const stored = getStoredPrefs();
      if (stored) {
        setEmbedsEnabled(stored.embeds);
        setHasConsent(true);
      }
      setView("settings");
      setOpen(true);
    };
    window.addEventListener("open-cookie-settings", handler);
    return () => window.removeEventListener("open-cookie-settings", handler);
  }, []);

  const handleClose = () => {
    if (hasConsent) {
      setOpen(false);
      setView("banner");
    }
    // No-op if consent not yet given
  };

  const acceptAll = () => {
    storePrefs({ necessary: true, embeds: true });
    setHasConsent(true);
    setOpen(false);
  };

  const acceptNecessary = () => {
    storePrefs({ necessary: true, embeds: false });
    setHasConsent(true);
    setOpen(false);
  };

  const saveSettings = () => {
    storePrefs({ necessary: true, embeds: embedsEnabled });
    setHasConsent(true);
    setOpen(false);
    setView("banner");
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={view === "settings" ? "Cookie-Einstellungen" : "Cookies & Datenschutz"}
      hideClose={!hasConsent}
    >
      {view === "settings" ? (
        <>
          <div
            className="mb-3 flex items-center justify-between rounded-lg p-3"
            style={{ border: "1px solid var(--color-border)" }}
          >
            <div>
              <span className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                Technisch notwendig
              </span>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Auth-Session, Theme, Entwuerfe
              </p>
            </div>
            <span
              className="rounded-full px-2 py-0.5 text-xs font-bold uppercase"
              style={{ backgroundColor: "var(--color-success, #22c55e)", color: "#fff" }}
            >
              Immer an
            </span>
          </div>

          <div
            className="mb-4 flex items-center justify-between rounded-lg p-3"
            style={{ border: "1px solid var(--color-border)" }}
          >
            <div>
              <span className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                YouTube &amp; Twitch Embeds
              </span>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Videoinhalte von YouTube und Twitch laden
              </p>
            </div>
            <button
              onClick={() => setEmbedsEnabled(!embedsEnabled)}
              className="relative h-6 w-11 shrink-0 rounded-full transition-colors"
              style={{
                backgroundColor: embedsEnabled ? "var(--color-accent)" : "var(--color-border)",
              }}
              aria-label={embedsEnabled ? "Embeds deaktivieren" : "Embeds aktivieren"}
            >
              <span
                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                style={{ left: embedsEnabled ? "calc(100% - 1.375rem)" : "0.125rem" }}
              />
            </button>
          </div>

          <div className="flex gap-3">
            <button onClick={saveSettings} className="btn-filled flex-1 text-xs">
              SPEICHERN
            </button>
            {hasConsent && (
              <button onClick={handleClose} className="btn-outlined flex-1 text-xs">
                ABBRECHEN
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="mb-4 text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            Wir nutzen technisch notwendige Cookies fuer den Betrieb der Seite. Fuer YouTube- und
            Twitch-Embeds benoetigen wir deine Einwilligung, da dabei Daten an Dritte uebermittelt
            werden. Mehr dazu in unserer{" "}
            <a
              href="/datenschutz"
              className="font-medium no-underline"
              style={{ color: "var(--color-accent)" }}
            >
              Datenschutzerklaerung
            </a>
            .
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <button onClick={acceptAll} className="btn-filled flex-1 text-xs">
              ALLE AKZEPTIEREN
            </button>
            <button onClick={acceptNecessary} className="btn-outlined flex-1 text-xs">
              NUR NOTWENDIGE
            </button>
            <button
              onClick={() => setView("settings")}
              className="text-xs font-medium uppercase transition-colors"
              style={{ color: "var(--color-text-muted)", letterSpacing: "0.05em" }}
            >
              EINSTELLUNGEN
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
