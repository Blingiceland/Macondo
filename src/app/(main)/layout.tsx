import type { Metadata } from "next";
import RootShell from "@/components/RootShell";
import LocalBusinessJsonLd from "@/components/LocalBusinessJsonLd";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    lang: "is",
    title: "Macondo — Tequila Bar Reykjavík",
    description:
        "Kokteilbar í hjarta Reykjavíkur. Handvaldir tequila kokteilar, magískt andrúmsloft og borðbókanir. Veltusund 1, 101 Reykjavík.",
    path: "/",
    alternate: { is: "/", en: "/en" },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <RootShell lang="is">
            <LocalBusinessJsonLd lang="is" />
            {children}
        </RootShell>
    );
}
