import { NextRequest, NextResponse } from "next/server";
import { createReservation, DEFAULT_DURATION } from "@/lib/booking";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { date, timeSlot, guests, name, email, tableNumber } = body;

        // Validate required fields
        if (!date || !timeSlot || !guests || !name || !email) {
            return NextResponse.json(
                { error: "Vantar upplýsingar: dagsetning, tími, fjöldi, nafn og netfang" },
                { status: 400 }
            );
        }

        // Validate guest count
        if (guests < 1 || guests > 20) {
            return NextResponse.json(
                { error: "Fjöldi gesta verður að vera á milli 1 og 20" },
                { status: 400 }
            );
        }

        const reservationId = await createReservation({
            date,
            timeSlot,
            duration: DEFAULT_DURATION,
            guests: parseInt(guests),
            name,
            email,
            tableNumber: tableNumber || 0,
            notes: "",
        });

        return NextResponse.json({
            success: true,
            id: reservationId,
            message: "Borðpöntun staðfest!",
            details: { date, timeSlot, guests, name },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Villa kom upp";
        console.error("Booking creation failed:", error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
