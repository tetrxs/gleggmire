import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { checkAdminOrMod } from "@/lib/utils/auth-check";

export async function GET(request: NextRequest) {
  const admin = await checkAdminOrMod();
  if (!admin) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });
  }

  const offset = parseInt(request.nextUrl.searchParams.get("offset") || "0", 10);
  const limit = Math.min(parseInt(request.nextUrl.searchParams.get("limit") || "10", 10), 50);

  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from("feature_suggestions")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    if (error.code === "42P01" || error.message?.includes("does not exist")) {
      return NextResponse.json({ suggestions: [] });
    }
    console.error("Suggestions fetch error:", error);
    return NextResponse.json({ error: "Fehler beim Laden der Vorschlaege" }, { status: 500 });
  }

  return NextResponse.json({ suggestions: data ?? [] });
}

export async function DELETE(request: NextRequest) {
  const admin = await checkAdminOrMod();
  if (!admin) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "ID erforderlich" }, { status: 400 });
    }

    const supabase = await createServiceClient();

    const { error } = await supabase
      .from("feature_suggestions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Suggestion delete error:", error);
      return NextResponse.json({ error: "Fehler beim Loeschen des Vorschlags" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ungueltige Anfrage" }, { status: 400 });
  }
}
