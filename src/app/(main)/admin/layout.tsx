import type { Metadata } from "next";

/** Stjórnborð: aldrei í leitarvélum. */
export const metadata: Metadata = {
    title: "Macondo — Stjórnborð",
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: { index: false, follow: false },
    },
    alternates: { canonical: null },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return children;
}
