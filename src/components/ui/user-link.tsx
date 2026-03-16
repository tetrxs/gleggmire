import Link from "next/link";

interface UserLinkProps {
  userId: string;
  username: string;
  avatarUrl?: string | null;
  discordId?: string;
  size?: "sm" | "md";
  showDiscordId?: boolean;
  hideAvatar?: boolean;
}

function getInitials(name: string): string {
  const parts = name.split(/[\s-]+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function usernameColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 45%)`;
}

export function UserLink({
  userId,
  username,
  avatarUrl,
  discordId,
  size = "sm",
  showDiscordId = false,
  hideAvatar = false,
}: UserLinkProps) {
  const avatarSize = size === "sm" ? "h-4 w-4" : "h-6 w-6";
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const initialsText = size === "sm" ? "text-[6px]" : "text-[9px]";

  return (
    <Link
      href={`/profil/${userId}`}
      className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-[var(--color-accent)]"
      style={{ color: "var(--color-text)" }}
    >
      {!hideAvatar && (
        avatarUrl ? (
          <img
            src={avatarUrl}
            alt={username}
            className={`${avatarSize} shrink-0 rounded-full object-cover`}
          />
        ) : (
          <span
            className={`${avatarSize} ${initialsText} shrink-0 rounded-full flex items-center justify-center font-bold text-white`}
            style={{ backgroundColor: usernameColor(username) }}
          >
            {getInitials(username)}
          </span>
        )
      )}
      <span className={textSize}>
        {username}
        {showDiscordId && discordId && (
          <span className="ml-1 font-normal" style={{ color: "var(--color-text-muted)" }}>
            ({discordId})
          </span>
        )}
      </span>
    </Link>
  );
}
