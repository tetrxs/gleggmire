"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

function DiscordIcon() {
  return (
    <svg
      width="16"
      height="12"
      viewBox="0 0 71 55"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5765 44.3433C53.9319 44.6363 54.3041 44.9293 54.6791 45.2082C54.8078 45.304 54.7994 45.5041 54.6595 45.5858C52.8907 46.6168 51.052 47.4931 49.1182 48.2228C48.9923 48.2707 48.9363 48.4172 48.9979 48.5383C50.0585 50.6034 51.2759 52.5699 52.6168 54.435C52.6756 54.5139 52.7749 54.5477 52.8645 54.5195C58.6989 52.7249 64.5815 50.0174 70.6544 45.5576C70.7076 45.5182 70.7412 45.459 70.7468 45.3942C72.2317 30.0791 68.2549 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" />
    </svg>
  );
}

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user ?? null);
      if (user) {
        setAvatarUrl(user.user_metadata?.avatar_url ?? null);
        setUsername(
          user.user_metadata?.custom_claims?.global_name ??
            user.user_metadata?.full_name ??
            user.user_metadata?.name ??
            "User"
        );
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        setAvatarUrl(currentUser.user_metadata?.avatar_url ?? null);
        setUsername(
          currentUser.user_metadata?.custom_claims?.global_name ??
            currentUser.user_metadata?.full_name ??
            currentUser.user_metadata?.name ??
            "User"
        );
      } else {
        setAvatarUrl(null);
        setUsername("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [dropdownOpen]);

  if (loading) {
    return (
      <div className="xp-button text-[11px] opacity-60" aria-busy="true">
        &#128100; ...
      </div>
    );
  }

  if (!user) {
    return (
      <a
        href="/api/auth/login"
        className="xp-button flex items-center gap-1.5 text-[11px] no-underline"
      >
        <DiscordIcon />
        <span>Login mit Discord</span>
      </a>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="xp-button flex items-center gap-1.5 text-[11px]"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            width={16}
            height={16}
            className="rounded-full"
          />
        ) : (
          <span>&#128100;</span>
        )}
        <span className="max-w-[100px] truncate">{username}</span>
        <span className="text-[9px]">{dropdownOpen ? "\u25B2" : "\u25BC"}</span>
      </button>

      {dropdownOpen && (
        <div
          className="absolute right-0 top-full z-50 mt-1 min-w-[160px] border border-[#808080] bg-[#ECE9D8] shadow-md"
          style={{
            borderRight: "1px solid #404040",
            borderBottom: "1px solid #404040",
          }}
        >
          <a
            href="/profil"
            className="block px-3 py-1.5 text-[11px] text-black no-underline hover:bg-[#316AC5] hover:text-white"
            onClick={() => setDropdownOpen(false)}
          >
            Profil
          </a>
          <a
            href="/meine-eintraege"
            className="block px-3 py-1.5 text-[11px] text-black no-underline hover:bg-[#316AC5] hover:text-white"
            onClick={() => setDropdownOpen(false)}
          >
            Meine Eintr&auml;ge
          </a>
          <div className="mx-2 border-t border-[#808080]" />
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full px-3 py-1.5 text-left text-[11px] text-black hover:bg-[#316AC5] hover:text-white"
              onClick={() => setDropdownOpen(false)}
            >
              Logout
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
