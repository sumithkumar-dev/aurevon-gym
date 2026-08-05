import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/member",
        "/member/",
        "/profile",
        "/settings",
        "/payments",
        "/login",
        "/join",
        "/forgot-password",
        "/reset-password",
        "/api/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
