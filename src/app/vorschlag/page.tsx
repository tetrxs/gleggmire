"use client";

import { useState } from "react";
import Image from "next/image";

export default function VorschlagPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discord, setDiscord] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/v1/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          discord_username: discord || undefined,
          contact_info: contact || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Ein Fehler ist aufgetreten.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setTitle("");
      setDescription("");
      setDiscord("");
      setContact("");
    } catch {
      setErrorMsg("Netzwerkfehler. Bitte versuche es spaeter erneut.");
      setStatus("error");
    }
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <Image
          src="/images/gleggmire_coin.png"
          alt=""
          width={80}
          height={80}
          className="h-auto w-[60px] animate-float"
        />
        <h1
          className="text-2xl font-bold uppercase tracking-tight sm:text-3xl"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-text)",
          }}
        >
          Funktion vorschlagen
        </h1>
        <p className="max-w-md text-sm" style={{ color: "var(--color-text-muted)" }}>
          Du hast eine Idee fuer gleggmire.net? Wir sind fuer alles offen!
          Egal ob neues Feature, Verbesserung oder komplett verrueckte Idee.
        </p>
      </div>

      {status === "success" ? (
        <div
          className="animate-scale-in rounded-2xl p-8 text-center"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "2px solid var(--color-success)",
          }}
        >
          <div className="mb-3 text-4xl">&#10084;&#65039;</div>
          <h2
            className="mb-2 text-lg font-bold uppercase"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
          >
            Danke fuer deinen Vorschlag!
          </h2>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Wir schauen uns das an und melden uns bei Bedarf.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="btn-outlined mt-6 text-xs no-underline"
          >
            NOCH EINEN VORSCHLAG
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-1 block text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--color-text-muted)" }}
            >
              Titel *
            </label>
            <input
              id="title"
              type="text"
              required
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z.B. Leaderboard fuer Clip-Einreichungen"
              className="w-full rounded-lg px-4 py-3 text-sm outline-none"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "2px solid var(--color-border)",
                color: "var(--color-text)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--color-text-muted)" }}
            >
              Beschreibung *
            </label>
            <textarea
              id="description"
              required
              maxLength={2000}
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beschreibe deine Idee so detailliert wie moeglich..."
              className="w-full resize-y rounded-lg px-4 py-3 text-sm outline-none"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "2px solid var(--color-border)",
                color: "var(--color-text)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
            />
            <span className="mt-1 block text-right text-xs" style={{ color: "var(--color-text-muted)" }}>
              {description.length}/2000
            </span>
          </div>

          {/* Optional fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="discord"
                className="mb-1 block text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--color-text-muted)" }}
              >
                Discord (optional)
              </label>
              <input
                id="discord"
                type="text"
                value={discord}
                onChange={(e) => setDiscord(e.target.value)}
                placeholder="dein_username"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "2px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
              />
            </div>
            <div>
              <label
                htmlFor="contact"
                className="mb-1 block text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--color-text-muted)" }}
              >
                E-Mail (optional)
              </label>
              <input
                id="contact"
                type="email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="deine@email.de"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "2px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
              />
            </div>
          </div>

          {/* Error message */}
          {status === "error" && (
            <div
              className="rounded-lg px-4 py-3 text-sm"
              style={{
                backgroundColor: "color-mix(in srgb, var(--color-error) 10%, transparent)",
                border: "1px solid var(--color-error)",
                color: "var(--color-error)",
              }}
            >
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-filled w-full text-sm no-underline disabled:opacity-50"
          >
            {status === "loading" ? "WIRD GESENDET..." : "VORSCHLAG EINREICHEN"}
          </button>
        </form>
      )}
    </main>
  );
}
