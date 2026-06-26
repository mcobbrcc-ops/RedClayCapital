import type { MetadataRoute } from "next";
import { cityPages, servicePages, site } from "@/content/site";

const routes = [
  "",
  ...servicePages.map((page) => `/${page.slug}`),
  ...cityPages.map((page) => `/areas-we-serve/${page.slug}`)
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7
  }));
}
