import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/business";

/**
 * Aðeins opinberar síður. /admin, /api og /menu (ótengd prófunarsíða
 * með Pablo-seðli) eru viljandi ekki hér.
 */
export default function sitemap(): MetadataRoute.Sitemap {
    // Uppfæra þegar efni breytist í raun; sífellt hreyfanleg dagsetning
    // kennir leitarvélum að hunsa hana.
    const updated = new Date("2026-09-20");

    return [
        {
            url: `${SITE_URL}/`,
            lastModified: updated,
            changeFrequency: "weekly",
            priority: 1,
            alternates: {
                languages: { is: `${SITE_URL}/`, en: `${SITE_URL}/en` },
            },
        },
        {
            url: `${SITE_URL}/en`,
            lastModified: updated,
            changeFrequency: "weekly",
            priority: 0.9,
            alternates: {
                languages: { is: `${SITE_URL}/`, en: `${SITE_URL}/en` },
            },
        },
        {
            url: `${SITE_URL}/karaoke`,
            lastModified: updated,
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];
}
