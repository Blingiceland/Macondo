import { BUSINESS, SITE_URL, openingHoursSpecification } from "@/lib/business";

/**
 * Eitt BarOrPub JSON-LD fyrir síðuna. Sett í <body> (ekki <head>) svo
 * Next tvítaki það ekki við streymingu á <head>.
 */
export default function LocalBusinessJsonLd({ lang }: { lang: "is" | "en" }) {
    const description =
        lang === "is"
            ? "Kokteilbar í hjarta Reykjavíkur með handvöldum tequila kokteilum og magískt andrúmsloft."
            : "Tequila and cocktail bar in the heart of Reykjavík with hand-picked tequila cocktails and a magical atmosphere.";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BarOrPub",
        "@id": `${SITE_URL}/#business`,
        name: BUSINESS.name,
        description,
        url: lang === "is" ? `${SITE_URL}/` : `${SITE_URL}/en`,
        email: BUSINESS.publicEmail,
        image: `${SITE_URL}/og/macondo-og.jpg`,
        address: {
            "@type": "PostalAddress",
            streetAddress: BUSINESS.address.street,
            addressLocality: BUSINESS.address.city,
            postalCode: BUSINESS.address.postalCode,
            addressCountry: BUSINESS.address.countryCode,
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: BUSINESS.geo.latitude,
            longitude: BUSINESS.geo.longitude,
        },
        openingHoursSpecification: openingHoursSpecification(),
        sameAs: [BUSINESS.social.instagram, BUSINESS.social.facebook],
        servesCuisine: "Cocktails",
        priceRange: "$$",
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
    );
}
