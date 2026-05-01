import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

const publicRoutes = [
  "/",
  "/about",
  "/student/login",
  "/student/register",
  "/verify",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
