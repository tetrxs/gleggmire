import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { authRateLimit, checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await checkRateLimit(authRateLimit, ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const cookieStore = await cookies();

    // Collect cookies that signOut wants to clear
    const cookiesToUpdate: { name: string; value: string; options: Record<string, unknown> }[] = [];

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToUpdate.push(...cookiesToSet);
          },
        },
      }
    );

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error.message);
      return NextResponse.json(
        { error: "Failed to sign out" },
        { status: 500 }
      );
    }

    // Build redirect with 303 (See Other) so the browser follows with GET
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.url;
    const response = NextResponse.redirect(new URL("/", baseUrl), 303);

    // Apply cleared cookies to the redirect response
    for (const { name, value, options } of cookiesToUpdate) {
      response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2]);
    }

    return response;
  } catch (err) {
    console.error("Logout route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
