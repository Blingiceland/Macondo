import type { Metadata } from "next";
import StickyNav from "@/components/StickyNav";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    lang: "is",
    title: "Karókí — Macondo Tequila Bar Reykjavík",
    description: "Bókaðu karókíherbergi uppi á hæðinni hjá Macondo og Pablo Discobar, Veltusund 1, 101 Reykjavík.",
    path: "/karaoke",
});

export default function KaraokePage() {
    return (
        <main className="min-h-screen bg-[#140c09] flex flex-col pt-[var(--nav-h)]">
            <StickyNav />
            {/* Visually hidden h1 for SEO/accessibility */}
            <h1 className="sr-only">Karókí hjá Macondo — Veltusund 1, Reykjavík</h1>
            <div className="flex-1 w-full relative" style={{ height: "calc(100vh - var(--nav-h))" }}>
                <iframe 
                    src="https://pablodiscobar.is/karaoke" 
                    className="w-full h-full border-0"
                    title="Pablo Discobar Karaoke"
                    allowFullScreen
                />
            </div>
        </main>
    );
}
