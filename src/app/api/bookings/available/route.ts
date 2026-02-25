import { NextRequest, NextResponse } from "next/server";
import { getAvailableTables, getTimeSlotsForDay, getReservationsForDate, getBlockedSlotsForDate, DEFAULT_DURATION } from "@/lib/booking";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get("date");
        const time = searchParams.get("time");
        const guests = parseInt(searchParams.get("guests") || "2");

        if (!date) {
            return NextResponse.json({ error: "Date required" }, { status: 400 });
        }

        const dayOfWeek = new Date(date + "T12:00:00").getDay();
        const allSlots = getTimeSlotsForDay(dayOfWeek);

        // If specific time requested, return available tables for that slot
        if (time) {
            const tables = await getAvailableTables(date, time, guests);
            return NextResponse.json({ available: tables.length > 0, tables, slot: time });
        }

        // Otherwise, return availability for all slots
        const [reservations, blockedSlots] = await Promise.all([
            getReservationsForDate(date),
            getBlockedSlotsForDate(date),
        ]);

        const slotAvailability = await Promise.all(
            allSlots.map(async (slot) => {
                const tables = await getAvailableTables(date, slot, guests);
                return { slot, available: tables.length > 0, tablesLeft: tables.length };
            })
        );

        return NextResponse.json({
            date,
            guests,
            slots: slotAvailability,
            totalReservations: reservations.length,
        });
    } catch (error) {
        console.error("Availability check failed:", error);
        return NextResponse.json({ error: "Villa kom upp" }, { status: 500 });
    }
}
