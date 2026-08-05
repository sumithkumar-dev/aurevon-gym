import type { MetadataRoute } from "next";

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
    sitemap: "https://www.aurevon.example/sitemap.xml",
  };
}
