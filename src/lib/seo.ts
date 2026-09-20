import type { Metadata } from "next";
import { SITE_URL } from "@/lib/business";

export const OG_IMAGE = {
    url: "/og/macondo-og.jpg",
    width: 1200,
    height: 630,
} as const;

interface PageMeta {
    lang: "is" | "en";
    title: string;
    description: string;
    /** Slóð án léns, t.d. "/" eða "/en" eða "/karaoke". */
    path: string;
    /**
     * Slóð samsvarandi síðu á hinu tungumálinu. Aðeins gefið upp þegar
     * hún er raunverulega til; annars koma engin hreflang-tengsl.
     */
    alternate?: { is: string; en: string };
}

/**
 * Byggir fullt metadata fyrir eina síðu. Notað í rótarskipulögum og
 * þeim undirsíðum sem þurfa eigin canonical, því Next skiptir út
 * `alternates` og `openGraph` í heilu lagi í stað þess að sameina.
 */
export function pageMetadata({ lang, title, description, path, alternate }: PageMeta): Metadata {
    const imageAlt =
        lang === "is"
            ? "Innandyra á Macondo Tequila Bar, Reykjavík"
            : "Inside Macondo Tequila Bar, Reykjavík";

    return {
        title,
        description,
        metadataBase: new URL(SITE_URL),
        icons: {
            icon: "/macondo-logo-gold.png",
            apple: "/macondo-logo-gold.png",
        },
        alternates: {
            canonical: path,
            ...(alternate
                ? { languages: { is: alternate.is, en: alternate.en, "x-default": alternate.is } }
                : {}),
        },
        openGraph: {
            title,
            description,
            url: path,
            siteName: "Macondo Tequila Bar",
            locale: lang === "is" ? "is_IS" : "en_US",
            alternateLocale: lang === "is" ? "en_US" : "is_IS",
            type: "website",
            images: [{ ...OG_IMAGE, alt: imageAlt }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [OG_IMAGE.url],
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}
