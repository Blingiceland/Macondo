/* ================================================================
   MACONDO — SAMEIGINLEG FYRIRTÆKJAGÖGN

   Eina uppspretta sannleikans fyrir nafn, heimilisfang, tengla og
   opnunartíma. Bæði tungumál, JSON-LD og bókunarkerfið lesa héðan.

   OPNUNARTÍMAR: staðfestir af eiganda 2026-09-20
   (mið–fim 16–23, fös–lau 16–01, lokað sun–þri). Breyta aðeins hér.
   ================================================================ */

export const SITE_URL = "https://macondo.is";

export const BUSINESS = {
    name: "Macondo Tequila Bar",
    shortName: "Macondo",
    /** Netfang sem birtist opinberlega (fótur, JSON-LD). */
    publicEmail: "pablo@discobar.is",
    address: {
        street: "Veltusund 1",
        postalCode: "101",
        city: "Reykjavík",
        countryCode: "IS",
    },
    geo: { latitude: 64.1466, longitude: -21.9426 },
    mapsUrl: "https://maps.google.com/?q=Veltusund+1+Reykjavik",
    social: {
        instagram: "https://www.instagram.com/macondo.rvk",
        facebook: "https://www.facebook.com/macondo.rvk",
    },
    sister: { name: "Pablo Discobar", url: "https://pablodiscobar.is" },
} as const;

/* ---------- Opnunartímar ---------- */

/** 0 = sunnudagur … 6 = laugardagur (sama og Date.getDay()). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DayHours {
    /** "HH:MM" 24h. */
    opens: string;
    /** "HH:MM" 24h. Má vera eftir miðnætti (t.d. "01:00"). */
    closes: string;
}

/** null = lokað þann dag. */
export const OPENING_HOURS: Record<Weekday, DayHours | null> = {
    0: null,                                   // Sunnudagur
    1: null,                                   // Mánudagur
    2: null,                                   // Þriðjudagur
    3: { opens: "16:00", closes: "23:00" },    // Miðvikudagur
    4: { opens: "16:00", closes: "23:00" },    // Fimmtudagur
    5: { opens: "16:00", closes: "01:00" },    // Föstudagur
    6: { opens: "16:00", closes: "01:00" },    // Laugardagur
};

/** Dagar sem staðurinn er lokaður (fyrir bókunarkerfið). */
export const CLOSED_DAYS: Weekday[] = (Object.keys(OPENING_HOURS) as unknown as Weekday[])
    .map(d => Number(d) as Weekday)
    .filter(d => OPENING_HOURS[d] === null);

/** Dagar sem staðurinn er opinn, í röð frá þriðjudegi (bókunardagatalið byrjar vikuna þar). */
export const OPEN_DAYS: Weekday[] = ([2, 3, 4, 5, 6, 0, 1] as Weekday[])
    .filter(d => OPENING_HOURS[d] !== null);

const SCHEMA_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** schema.org OpeningHoursSpecification, dagar með sama tíma sameinaðir. */
export function openingHoursSpecification() {
    const groups = new Map<string, string[]>();
    for (let d = 0 as Weekday; d <= 6; d = (d + 1) as Weekday) {
        const h = OPENING_HOURS[d];
        if (!h) continue;
        const key = `${h.opens}-${h.closes}`;
        groups.set(key, [...(groups.get(key) ?? []), SCHEMA_DAYS[d]]);
    }
    return [...groups.entries()].map(([key, days]) => {
        const [opens, closes] = key.split("-");
        return { "@type": "OpeningHoursSpecification", dayOfWeek: days, opens, closes };
    });
}

/* ---------- Birting í fæti ---------- */

/** Stuttheiti daga, 0 = sunnudagur. */
export const DAY_ABBR = {
    is: ["Sun", "Mán", "Þri", "Mið", "Fim", "Fös", "Lau"],
    en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
} as const;

export interface HoursRow {
    /** t.d. "Þri — Fim" */
    days: string;
    /** t.d. "15 — 23" eða null ef lokað */
    hours: string | null;
}

/**
 * Raðir fyrir fótinn: samliggjandi dagar með sama tíma sameinaðir.
 * Vikan byrjar á sunnudegi svo lokaðir dagar (sun–þri) lenda saman.
 */
export function hoursRows(lang: "is" | "en"): HoursRow[] {
    const abbr = DAY_ABBR[lang];
    const rows: { from: number; to: number; key: string | null }[] = [];
    for (let d = 0; d <= 6; d++) {
        const h = OPENING_HOURS[d as Weekday];
        const key = h ? `${h.opens}-${h.closes}` : null;
        const last = rows[rows.length - 1];
        if (last && last.key === key) last.to = d;
        else rows.push({ from: d, to: d, key });
    }
    const short = (t: string) => t.replace(/:00$/, "");
    return rows.map(r => ({
        days: r.from === r.to ? abbr[r.from] : `${abbr[r.from]} — ${abbr[r.to]}`,
        hours: r.key ? r.key.split("-").map(short).join(" — ") : null,
    }));
}

/* ---------- Lokað-dagar sem texti ---------- */

const DAY_NAME_DATIVE_IS = ["sunnudögum", "mánudögum", "þriðjudögum", "miðvikudögum", "fimmtudögum", "föstudögum", "laugardögum"];

/** t.d. "sunnudögum og mánudögum" */
export function closedDaysTextIs(): string {
    const names = CLOSED_DAYS.map(d => DAY_NAME_DATIVE_IS[d]);
    if (names.length === 0) return "";
    if (names.length === 1) return names[0];
    return `${names.slice(0, -1).join(", ")} og ${names[names.length - 1]}`;
}
