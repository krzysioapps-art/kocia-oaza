import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://kocia-oaza.pl";

  // 🔥 pobierz koty z Supabase
  const { data: cats } = await supabase
    .from("cats")
    .select("slug, updated_at");

  const catUrls =
    cats?.map((cat) => ({
      url: `${baseUrl}/koty/${cat.slug}`,
      lastModified: cat.updated_at
        ? new Date(cat.updated_at)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) || [];

  const adoptionUrls =
    cats?.map((cat) => ({
      url: `${baseUrl}/adopcja/${cat.slug}`,
      lastModified: cat.updated_at
        ? new Date(cat.updated_at)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) || [];

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/koty`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/jak-adoptowac`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/jak-pomagamy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/o-nas`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/porady`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/polityka-prywatnosci`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },

    // 🔥 dynamiczne strony
    ...catUrls,
    ...adoptionUrls,
  ];
}