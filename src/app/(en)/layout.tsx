import type { Metadata } from "next";
import RootShell from "@/components/RootShell";
import LocalBusinessJsonLd from "@/components/LocalBusinessJsonLd";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    lang: "en",
    title: "Macondo — Tequila & Cocktail Bar in Reykjavík",
    description:
        "Tequila and cocktail bar in the heart of Reykjavík. Hand-picked tequila cocktails, a magical atmosphere and table bookings. Veltusund 1, 101 Reykjavík.",
    path: "/en",
    alternate: { is: "/", en: "/en" },
});

export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <RootShell lang="en">
            <LocalBusinessJsonLd lang="en" />
            {children}
        </RootShell>
    );
}
