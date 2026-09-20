import { NextRequest, NextResponse } from "next/server";
import { createReservation, LARGE_GROUP_THRESHOLD, SITTING_LABEL } from "@/lib/booking";
import nodemailer from "nodemailer";
import { CLOSED_DAYS, closedDaysTextIs } from "@/lib/business";

const ADMIN_EMAIL = "discobar@discobar.is";

/** Escape-ar notendatexta áður en hann fer inn í HTML-póst. */
function esc(value: unknown): string {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/** Fjarlægir línuskil svo notendatexti geti ekki bætt við póst-hausum. */
function oneLine(value: unknown): string {
    return String(value ?? "").replace(/[\r\n]+/g, " ").trim();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createTransporter() {
    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr + "T12:00:00");
    const dayNames = ["Sunnudagur", "Mánudagur", "Þriðjudagur", "Miðvikudagur", "Fimmtudagur", "Föstudagur", "Laugardagur"];
    const monthNames = ["janúar", "febrúar", "mars", "apríl", "maí", "júní", "júlí", "ágúst", "september", "október", "nóvember", "desember"];
    return `${dayNames[d.getDay()]}, ${d.getDate()}. ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { date, guests, name, email, phone, notes } = body;

        if (!date || !guests || !name || !email || !phone) {
            return NextResponse.json(
                { error: "Vantar upplýsingar: dagsetning, fjöldi, nafn, netfang og símanúmer" },
                { status: 400 }
            );
        }

        if (typeof name !== "string" || typeof email !== "string" || typeof phone !== "string") {
            return NextResponse.json({ error: "Ógild gögn" }, { status: 400 });
        }
        if (!EMAIL_RE.test(email) || /[\r\n]/.test(email)) {
            return NextResponse.json({ error: "Ógilt netfang" }, { status: 400 });
        }
        if (name.length > 200 || phone.length > 40 || (typeof notes === "string" && notes.length > 2000)) {
            return NextResponse.json({ error: "Texti of langur" }, { status: 400 });
        }

        const guestCount = parseInt(guests);
        if (!Number.isFinite(guestCount) || guestCount < 1 || guestCount > 60) {
            return NextResponse.json(
                { error: "Fjöldi gesta verður að vera á milli 1 og 60" },
                { status: 400 }
            );
        }

        // Lokaðir dagar koma úr sameiginlegu stillingunni í lib/business.ts
        const dayOfWeek = new Date(date + "T12:00:00").getDay() as (typeof CLOSED_DAYS)[number];
        if (CLOSED_DAYS.includes(dayOfWeek)) {
            return NextResponse.json(
                { error: `Macondo er lokað á ${closedDaysTextIs()}` },
                { status: 400 }
            );
        }

        const reservationId = await createReservation({
            date,
            name,
            email,
            phone,
            guests: guestCount,
            notes: notes || "",
        });

        // ── Send emails ──
        try {
            const transporter = createTransporter();
            const formattedDate = formatDate(date);
            const isLargeGroup = guestCount >= LARGE_GROUP_THRESHOLD;
            // Öll notendagögn escape-uð fyrir HTML og hreinsuð fyrir hausa
            const safeName = esc(oneLine(name));
            const safeEmail = esc(oneLine(email));
            const safePhone = esc(oneLine(phone));
            const safeNotes = notes ? esc(String(notes)) : "";
            const subjectName = oneLine(name);

            // 1) Confirmation to guest
            await transporter.sendMail({
                from: `"Macondo Tequila Lounge" <${process.env.EMAIL_USER}>`,
                to: email,
                replyTo: ADMIN_EMAIL,
                subject: "Borðabókun Macondo — Staðfesting",
                html: `
                    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; background: #1A0A08; color: #F5E8D0; padding: 40px 32px; border-radius: 8px;">
                        <h1 style="color: #F5A800; font-size: 22px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 4px;">Macondo</h1>
                        <p style="color: #C8891A; font-size: 12px; letter-spacing: 2px; margin-top: 0; margin-bottom: 32px; text-transform: uppercase;">Tequila Lounge · Reykjavík</p>
                        
                        <h2 style="color: #F5E8D0; font-size: 18px; margin-bottom: 24px;">Bókun staðfest</h2>
                        
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="color: #F5E8D0; opacity: 0.5; font-size: 12px; padding: 10px 0; border-bottom: 1px solid rgba(245,232,208,0.1); text-transform: uppercase; letter-spacing: 1px;">Nafn</td>
                                <td style="color: #F5E8D0; font-size: 14px; padding: 10px 0; border-bottom: 1px solid rgba(245,232,208,0.1); text-align: right;">${safeName}</td>
                            </tr>
                            <tr>
                                <td style="color: #F5E8D0; opacity: 0.5; font-size: 12px; padding: 10px 0; border-bottom: 1px solid rgba(245,232,208,0.1); text-transform: uppercase; letter-spacing: 1px;">Dagsetning</td>
                                <td style="color: #F5E8D0; font-size: 14px; padding: 10px 0; border-bottom: 1px solid rgba(245,232,208,0.1); text-align: right;">${formattedDate}</td>
                            </tr>
                            <tr>
                                <td style="color: #F5E8D0; opacity: 0.5; font-size: 12px; padding: 10px 0; border-bottom: 1px solid rgba(245,232,208,0.1); text-transform: uppercase; letter-spacing: 1px;">Tími</td>
                                <td style="color: #F5A800; font-size: 14px; padding: 10px 0; border-bottom: 1px solid rgba(245,232,208,0.1); text-align: right;">${SITTING_LABEL}</td>
                            </tr>
                            <tr>
                                <td style="color: #F5E8D0; opacity: 0.5; font-size: 12px; padding: 10px 0; text-transform: uppercase; letter-spacing: 1px;">Gestir</td>
                                <td style="color: #F5E8D0; font-size: 14px; padding: 10px 0; text-align: right;">${guestCount}</td>
                            </tr>
                        </table>
                        
                        <div style="margin-top: 32px; padding: 16px; background: rgba(245,168,0,0.08); border-left: 2px solid #F5A800; border-radius: 4px;">
                            <p style="margin: 0; font-size: 13px; color: #F5E8D0; opacity: 0.8; line-height: 1.6;">
                                Vinsamlegast mættu á réttum tíma til að halda borðinu þínu. Við hlökkum til að sjá þig!
                            </p>
                        </div>

                        <p style="margin-top: 40px; color: #F5E8D0; opacity: 0.3; font-size: 11px;">
                            Macondo · Veltusund 1 · 101 Reykjavík · discobar@discobar.is
                        </p>
                    </div>
                `,
            });

            // 2) Notification to admin
            await transporter.sendMail({
                from: `"Macondo Bókunarkerfi" <${process.env.EMAIL_USER}>`,
                to: ADMIN_EMAIL,
                subject: isLargeGroup
                    ? `🚨 Stór hópur (${guestCount} gestir) — ${formattedDate}`
                    : `Ný bókun — ${subjectName} · ${guestCount} gestir · ${formattedDate}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
                        ${isLargeGroup ? `
                        <div style="background: #e74c3c; color: white; padding: 16px 24px; border-radius: 6px 6px 0 0;">
                            <h2 style="margin: 0; font-size: 18px;">🚨 Stór hópur — hugmyndaflug gæti þurft!</h2>
                        </div>` : `
                        <div style="background: #1A0A08; color: #F5A800; padding: 16px 24px; border-radius: 6px 6px 0 0;">
                            <h2 style="margin: 0; font-size: 18px;">Ný borðabókun — Macondo</h2>
                        </div>`}
                        <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 6px 6px;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Nafn</td><td style="padding: 8px 0; font-weight: bold;">${safeName}</td></tr>
                                <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Netfang</td><td style="padding: 8px 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
                                <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Símanúmer</td><td style="padding: 8px 0; font-size: 16px; font-weight: bold;"><a href="tel:${safePhone}">${safePhone}</a></td></tr>
                                <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Dagsetning</td><td style="padding: 8px 0;">${formattedDate}</td></tr>
                                <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Gestir</td><td style="padding: 8px 0; font-size: 20px; font-weight: bold; color: ${isLargeGroup ? "#e74c3c" : "#1A0A08"};">${guestCount}</td></tr>
                                ${safeNotes ? `<tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Athugasemd</td><td style="padding: 8px 0; font-style: italic;">${safeNotes}</td></tr>` : ""}
                                <tr><td style="padding: 8px 0; color: #999; font-size: 12px;">Bókunarnr.</td><td style="padding: 8px 0; font-family: monospace; color: #999; font-size: 12px;">${reservationId.slice(0, 8)}</td></tr>
                            </table>
                        </div>
                    </div>
                `,
            });
        } catch (emailError) {
            // Don't fail the booking if email fails
            console.error("Email send failed:", emailError);
        }

        return NextResponse.json({
            success: true,
            id: reservationId,
            message: "Borðapöntun staðfest!",
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Villa kom upp";
        console.error("Booking creation failed:", error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
