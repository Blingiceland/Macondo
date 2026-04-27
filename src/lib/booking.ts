import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

function getDb() {
    if (!db) throw new Error("Firebase not configured. Set environment variables in .env.local");
    return db;
}

/* ================================================================
   TYPES
   ================================================================ */

export interface Reservation {
    id?: string;
    date: string;          // "YYYY-MM-DD"
    name: string;
    email: string;
    phone: string;
    guests: number;
    status: "confirmed" | "cancelled";
    createdAt?: Date;
    notes?: string;
}

/* ================================================================
   CONSTANTS
   ================================================================ */

export const TOTAL_CAPACITY = 60;          // Heildarfjöldi sæta
export const SITTING_TIME = "17:00";       // Eitt sitting kl. 17
export const SITTING_LABEL = "kl. 17:00 – 20:00";
export const LARGE_GROUP_THRESHOLD = 8;    // Sérstakur póstur ef 8+

/* ================================================================
   RESERVATIONS
   ================================================================ */

/** Get all confirmed reservations for a specific date */
export async function getReservationsForDate(date: string): Promise<Reservation[]> {
    const q = query(
        collection(getDb(), "reservations"),
        where("date", "==", date)
    );
    const snapshot = await getDocs(q);
    const all = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Reservation));
    return all.filter(r => r.status === "confirmed");
}

/** Count booked seats for a date */
export async function getBookedSeats(date: string): Promise<number> {
    const reservations = await getReservationsForDate(date);
    return reservations.reduce((sum, r) => sum + r.guests, 0);
}

/** Get available seats for a date */
export async function getAvailableSeats(date: string): Promise<number> {
    const booked = await getBookedSeats(date);
    return Math.max(0, TOTAL_CAPACITY - booked);
}

/** Get all upcoming reservations from today onwards */
export async function getUpcomingReservations(): Promise<Reservation[]> {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const q = query(
        collection(getDb(), "reservations"),
        where("date", ">=", todayStr)
    );
    const snapshot = await getDocs(q);
    const all = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Reservation));
    return all
        .filter(r => r.status === "confirmed")
        .sort((a, b) => a.date.localeCompare(b.date));
}

/** Create a new reservation after checking capacity */
export async function createReservation(
    data: Omit<Reservation, "id" | "createdAt" | "status">
): Promise<string> {
    const available = await getAvailableSeats(data.date);
    if (data.guests > available) {
        throw new Error(
            available === 0
                ? "Fullbókað þennan dag"
                : `Aðeins ${available} sæti laus — ekki hægt að panta ${data.guests} sæti`
        );
    }

    const docRef = await addDoc(collection(getDb(), "reservations"), {
        ...data,
        status: "confirmed",
        createdAt: Timestamp.now(),
    });

    return docRef.id;
}

/** Cancel a reservation */
export async function cancelReservation(id: string): Promise<void> {
    await updateDoc(doc(getDb(), "reservations", id), { status: "cancelled" });
}
