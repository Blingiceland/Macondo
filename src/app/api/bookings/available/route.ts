import { NextRequest, NextResponse } from "next/server";
import { getAvailableSeats, TOTAL_CAPACITY } from "@/lib/booking";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get("date");

        if (!date) {
            return NextResponse.json({ error: "Date required" }, { status: 400 });
        }

        const available = await getAvailableSeats(date);
        const booked = TOTAL_CAPACITY - available;

        return NextResponse.json({
            date,
            available,
            booked,
            total: TOTAL_CAPACITY,
            isFull: available === 0,
        });
    } catch (error) {
        console.error("Availability check failed:", error);
        return NextResponse.json({ error: "Villa kom upp" }, { status: 500 });
    }
}
