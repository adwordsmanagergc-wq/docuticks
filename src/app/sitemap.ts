import type { MetadataRoute } from "next";

const BASE = "https://docuticks.com";

const ROUTES = [
  "",
  "/features",
  "/how-it-works",
  "/pricing",
  "/use-cases",
  "/security",
  "/faq",
  "/contact",
  "/blog",
  "/blog/scanned-pdf-to-fillable-form",
  "/blog/are-e-signatures-legally-binding-in-australia",
  "/blog/5-paper-forms-real-estate-agents-should-digitise",
  "/blog/docuticks-vs-docusign-for-small-business",
  "/login",
  "/signup",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((path) => ({
    url: `${BASE}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
