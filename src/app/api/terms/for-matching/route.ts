import { NextResponse } from "next/server";
import { getExistingTermsForMatching } from "@/lib/data/glossary";

export async function GET() {
  const terms = await getExistingTermsForMatching();
  return NextResponse.json(terms);
}
