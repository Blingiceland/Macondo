import { NextRequest, NextResponse } from "next/server";
import {
    getReservationsForDate,
    cancelReservation,
    blockSlot,
    unblockSlot,
    getBlockedSlotsForDate,
    getTables,
    updateTable,
    initializeTables,
    getUpcomingReservations,
} from "@/lib/booking";

// Simple admin auth check
function isAuthorized(request: NextRequest): boolean {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) return false;
    const password = authHeader.replace("Bearer ", "");
    return password === (process.env.ADMIN_PASSWORD || "macondo2026");
}

/** GET — fetch reservations + blocked slots for a date */
export async function GET(request: NextRequest) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: "Óheimilt" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get("date");
        const action = searchParams.get("action");

        // Get tables config
        if (action === "tables") {
            const tables = await getTables();
            return NextResponse.json({ tables });
        }

        // Initialize tables
        if (action === "init") {
            await initializeTables();
            const tables = await getTables();
            return NextResponse.json({ tables, initialized: true });
        }

        if (!date) {
            return NextResponse.json({ error: "Date required" }, { status: 400 });
        }

        let reservations;
        let blockedSlots;

        if (date === "all") {
            reservations = await getUpcomingReservations();
            blockedSlots = []; // Optionally fetch all future blocked slots here too
        } else {
            [reservations, blockedSlots] = await Promise.all([
                getReservationsForDate(date),
                getBlockedSlotsForDate(date),
            ]);
        }

        return NextResponse.json({ date, reservations, blockedSlots });
    } catch (error) {
        console.error("Admin fetch failed:", error);
        return NextResponse.json({ error: "Villa kom upp" }, { status: 500 });
    }
}

/** POST — admin actions: cancel reservation, block/unblock slot, update table */
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

            case "block": {
                const { date, timeSlot, tableNumber, reason } = body;
                const id = await blockSlot({ date, timeSlot: timeSlot || "all", tableNumber: tableNumber || 0, reason: reason || "" });
                return NextResponse.json({ success: true, id, message: "Tímabil lokað" });
            }

            case "unblock": {
                const { blockId } = body;
                await unblockSlot(blockId);
                return NextResponse.json({ success: true, message: "Tímabil opnað" });
            }

            case "updateTable": {
                const { tableId, seats, active, label } = body;
                await updateTable(tableId, { seats, active, label });
                return NextResponse.json({ success: true, message: "Borð uppfært" });
            }

            default:
                return NextResponse.json({ error: "Unknown action" }, { status: 400 });
        }
    } catch (error) {
        console.error("Admin action failed:", error);
        return NextResponse.json({ error: "Villa kom upp" }, { status: 500 });
    }
}
