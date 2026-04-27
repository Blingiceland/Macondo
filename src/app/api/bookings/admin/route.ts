import { NextRequest, NextResponse } from "next/server";
import {
    getReservationsForDate,
    cancelReservation,
    getUpcomingReservations,
    getBookedSeats,
    TOTAL_CAPACITY,
} from "@/lib/booking";

function isAuthorized(request: NextRequest): boolean {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) return false;
    const password = authHeader.replace("Bearer ", "");
    return password === (process.env.ADMIN_PASSWORD || "macondo2026");
}

/** GET — fetch reservations for a date (or all upcoming) */
export async function GET(request: NextRequest) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: "Óheimilt" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get("date");

        if (!date) {
            return NextResponse.json({ error: "Date required" }, { status: 400 });
        }

        if (date === "all") {
            const reservations = await getUpcomingReservations();
            return NextResponse.json({ reservations });
        }

        const [reservations, booked] = await Promise.all([
            getReservationsForDate(date),
            getBookedSeats(date),
        ]);

        return NextResponse.json({
            date,
            reservations,
            booked,
            available: TOTAL_CAPACITY - booked,
            total: TOTAL_CAPACITY,
        });
    } catch (error) {
        console.error("Admin fetch failed:", error);
        return NextResponse.json({ error: "Villa kom upp" }, { status: 500 });
    }
}

/** POST — admin actions */
export async function POST(request: NextRequest) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: "Óheimilt" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { action } = body;

        switch (action) {
            case "cancel": {
                const { reservationId } = body;
                await cancelReservation(reservationId);
                return NextResponse.json({ success: true, message: "Bókun aflýst" });
            }
            default:
                return NextResponse.json({ error: "Unknown action" }, { status: 400 });
        }
    } catch (error) {
        console.error("Admin action failed:", error);
        return NextResponse.json({ error: "Villa kom upp" }, { status: 500 });
    }
}
