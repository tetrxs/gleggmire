import { NextRequest, NextResponse } from "next/server";
import { getExistingTermsForMatching } from "@/lib/data/glossary";
import { apiRateLimit, checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await checkRateLimit(apiRateLimit, ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const terms = await getExistingTermsForMatching();
    return NextResponse.json(terms);
  } catch (err) {
    console.error("Error fetching terms for matching:", err);
    return NextResponse.json(
      { error: "Failed to fetch terms" },
      { status: 500 }
    );
  }
}
