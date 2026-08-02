import type { MetadataRoute } from "next";

const baseUrl = "https://www.aurevon.example";

const routes = [
  "",
  "/about",
  "/membership",
  "/trainers",
  "/facilities",
  "/gallery",
  "/contact",
  "/faq",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
