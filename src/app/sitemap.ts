import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = "https://gleggmire.net";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const { data: terms } = await supabase
    .from("glossary_terms")
    .select("slug, updated_at")
    .eq("status", "approved")
    .eq("is_secret", false)
    .order("term", { ascending: true });

  const termEntries: MetadataRoute.Sitemap = (terms ?? []).map((term) => ({
    url: `${BASE_URL}/glossar/${term.slug}`,
    lastModified: term.updated_at,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/glossar`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/aenderungen`,
      changeFrequency: "daily",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/impressum`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/datenschutz`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  return [...staticPages, ...termEntries];
}
