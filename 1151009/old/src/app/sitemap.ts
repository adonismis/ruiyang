import type { MetadataRoute } from "next";
import {
  navigation,
  news,
  projects,
  services,
  sustainability,
} from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return [];
  const paths = [
    ...navigation.map((item) => item.href),
    "/about/certificates",
    "/privacy",
    "/credits",
    ...sustainability.map((item) => `/sustainability/${item.id}`),
    ...services
      .filter((item) => item.status === "published")
      .map((item) => `/services/${item.slug}`),
    ...projects
      .filter((item) => item.status === "published")
      .map((item) => `/projects/${item.slug}`),
    ...news
      .filter((item) => item.status === "published")
      .map((item) => `/news/${item.slug}`),
  ];
  return [...new Set(paths)].map((path) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: "monthly",
    priority:
      path === "/"
        ? 1
        : navigation.some((item) => item.href === path)
          ? 0.8
          : 0.6,
  }));
}
