import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ZufallPage() {
  const supabase = await createClient();

  const { data: terms } = await supabase
    .from("glossary_terms")
    .select("slug")
    .eq("status", "approved")
    .eq("is_secret", false)
    .limit(100);

  if (!terms || terms.length === 0) {
    redirect("/glossar");
  }

  const randomTerm = terms[Math.floor(Math.random() * terms.length)];
  redirect(`/glossar/${randomTerm.slug}`);
}
