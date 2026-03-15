import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/constants/admin";

async function checkAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const discordId = user.user_metadata?.provider_id ?? user.user_metadata?.sub;
  return discordId ? isAdmin(discordId) : false;
}

export async function GET(request: NextRequest) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });
  }

  const status = request.nextUrl.searchParams.get("status") || "pending";
  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from("feature_suggestions")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ suggestions: data });
}

export async function PATCH(request: NextRequest) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, status, admin_notes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID und Status erforderlich" }, { status: 400 });
    }

    const validStatuses = ["pending", "approved", "rejected", "done"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Ungueltiger Status" }, { status: 400 });
    }

    const supabase = await createServiceClient();

    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (admin_notes !== undefined) {
      updateData.admin_notes = admin_notes;
    }

    const { error } = await supabase
      .from("feature_suggestions")
      .update(updateData)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ungueltige Anfrage" }, { status: 400 });
  }
}
