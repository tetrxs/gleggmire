import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/profil", "/meine-eintraege", "/api/"],
      },
    ],
    sitemap: "https://gleggmire.net/sitemap.xml",
  };
}
