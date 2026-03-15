import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const next = searchParams.get("next") ?? "/";

  const supabase = await createClient();

  const redirectUrl = new URL("/api/auth/callback", request.url);
  redirectUrl.searchParams.set("next", next);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: redirectUrl.toString(),
    },
  });

  if (error || !data.url) {
    return NextResponse.json(
      { error: "Failed to initiate Discord login" },
      { status: 500 }
    );
  }

  return NextResponse.redirect(data.url);
}
