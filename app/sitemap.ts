import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants/site-url";

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
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
