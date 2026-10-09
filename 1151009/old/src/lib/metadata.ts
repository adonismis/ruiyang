import type { Metadata } from "next";
import { company } from "@/content/site";

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    title: `${title}｜${company.name}`,
    description,
    ...(siteUrl ? { alternates: { canonical: path } } : {}),
    openGraph: {
      title: `${title}｜${company.name}`,
      description,
      type: "website",
      locale: "zh_TW",
      siteName: company.name,
      ...(siteUrl
        ? {
            url: new URL(path, siteUrl).toString(),
            images: [
              {
                url: new URL(
                  "/images/architecture-hero.jpg",
                  siteUrl,
                ).toString(),
                width: 2200,
                height: 1467,
                alt: "建築情境示意",
              },
            ],
          }
        : {}),
    },
  };
}
