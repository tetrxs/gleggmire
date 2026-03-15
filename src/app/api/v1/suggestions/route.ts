import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { checkRateLimit, submitRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

  // Rate limit: 5 per minute
  const { success } = await checkRateLimit(submitRateLimit, ip);
  if (!success) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte warte kurz." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { title, description, discord_username, contact_info } = body;

    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return NextResponse.json(
        { error: "Titel muss mindestens 3 Zeichen lang sein." },
        { status: 400 }
      );
    }

    if (!description || typeof description !== "string" || description.trim().length < 10) {
      return NextResponse.json(
        { error: "Beschreibung muss mindestens 10 Zeichen lang sein." },
        { status: 400 }
      );
    }

    if (title.trim().length > 100) {
      return NextResponse.json(
        { error: "Titel darf maximal 100 Zeichen lang sein." },
        { status: 400 }
      );
    }

    if (description.trim().length > 2000) {
      return NextResponse.json(
        { error: "Beschreibung darf maximal 2000 Zeichen lang sein." },
        { status: 400 }
      );
    }

    const supabase = await createServiceClient();

    const { error } = await supabase.from("feature_suggestions").insert({
      title: title.trim(),
      description: description.trim(),
      discord_username: discord_username?.trim() || null,
      contact_info: contact_info?.trim() || null,
      ip_address: ip,
    });

    if (error) {
      console.error("Suggestion insert error:", error);
      return NextResponse.json(
        { error: "Fehler beim Speichern. Bitte spaeter erneut versuchen." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Ungueltige Anfrage." },
      { status: 400 }
    );
  }
}
