import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authRateLimit, checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await checkRateLimit(authRateLimit, ip);
  if (!success) {
    return NextResponse.json({ error: "Too many login attempts" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const next = searchParams.get("next") ?? "/";

  try {
    const supabase = await createClient();

    // Build redirect URL – prefer NEXT_PUBLIC_SITE_URL for production, fall back to request.url
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.url;
    const redirectUrl = new URL("/api/auth/callback", baseUrl);
    redirectUrl.searchParams.set("next", next);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: redirectUrl.toString(),
      },
    });

    if (error) {
      console.error("Discord OAuth error:", error.message);
      return NextResponse.json(
        { error: "Discord Login fehlgeschlagen. Bitte versuche es spaeter erneut." },
        { status: 500 }
      );
    }

    if (!data.url) {
      console.error("Discord OAuth: no redirect URL returned");
      return NextResponse.json(
        { error: "Discord Login fehlgeschlagen." },
        { status: 500 }
      );
    }

    return NextResponse.redirect(data.url);
  } catch (err) {
    console.error("Login route error:", err);
    return NextResponse.json(
      { error: "Interner Fehler beim Login." },
      { status: 500 }
    );
  }
}
