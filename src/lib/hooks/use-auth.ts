"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

let cachedUser: User | null | undefined;
const listeners = new Set<(user: User | null) => void>();

function notify(user: User | null) {
  cachedUser = user;
  listeners.forEach((fn) => fn(user));
}

// Single global subscription so we only listen once
let subscribed = false;
function ensureSubscription() {
  if (subscribed) return;
  subscribed = true;

  const supabase = createClient();
  supabase.auth.getUser().then(({ data }) => notify(data.user ?? null));
  supabase.auth.onAuthStateChange((_event, session) => {
    notify(session?.user ?? null);
  });
}

/**
 * Returns the current Supabase user (null if not logged in, undefined while loading).
 */
export function useAuth(): { user: User | null; loading: boolean } {
  const [user, setUser] = useState<User | null | undefined>(cachedUser);

  useEffect(() => {
    ensureSubscription();

    // Sync with cache immediately if available
    if (cachedUser !== undefined && user === undefined) {
      setUser(cachedUser);
    }

    listeners.add(setUser);
    return () => { listeners.delete(setUser); };
  }, []);

  return { user: user ?? null, loading: user === undefined };
}

/**
 * Redirect to Discord OAuth login. Call this when an unauthenticated user
 * tries to perform a protected action.
 */
export function redirectToLogin() {
  const next = window.location.pathname + window.location.search;
  window.location.href = `/api/auth/login?next=${encodeURIComponent(next)}`;
}
