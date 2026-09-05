import type { MetadataRoute } from "next";
import { blogPosts, cityPages, localSeoPages, servicePages, site } from "@/content/site";
import { marketPages } from "@/content/markets";

const excluded = new Set(["testimonials", "recently-purchased-properties", "our-buying-process"]);
const routes = Array.from(new Set([
  "", "/get-offer", "/blog",
  ...servicePages.filter((page) => !excluded.has(page.slug)).map((page) => `/${page.slug}`),
  ...blogPosts.map((post) => `/blog/${post.slug}`),
  ...localSeoPages.map((page) => `/${page.slug}`),
  ...cityPages.filter((page) => !page.href).map((page) => `/areas-we-serve/${page.slug}`),
  ...marketPages.map((page) => `/areas-we-serve/${page.slug}`)
]));

export default function sitemap(): MetadataRoute.Sitemap {
  // This is the content revision date, not the time a crawler requested the file.
  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: "2026-09-05",
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7
  }));
}
