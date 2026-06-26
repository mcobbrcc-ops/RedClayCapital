import type { MetadataRoute } from "next";
import { cityPages, localSeoPages, servicePages, site } from "@/content/site";

const routes = [
  "",
  "/reviews",
  ...servicePages.map((page) => `/${page.slug}`),
  ...localSeoPages.map((page) => `/${page.slug}`),
  ...cityPages.filter((page) => !page.href).map((page) => `/areas-we-serve/${page.slug}`)
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7
  }));
}
