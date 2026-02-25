import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    Timestamp,
    orderBy,
    deleteDoc,
    setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

/** Get Firestore instance, throwing if not configured */
function getDb() {
    if (!db) throw new Error("Firebase not configured. Set environment variables in .env.local");
    return db;
}

/* ================================================================
   TYPES
   ================================================================ */

export interface Table {
    id: string;
    number: number;
    seats: number;
    active: boolean;
    label?: string;
}

export interface Reservation {
    id?: string;
    tableNumber: number;
    date: string;          // "YYYY-MM-DD"
    timeSlot: string;      // "HH:MM"
    duration: number;       // minutes (default 120)
    name: string;
    email: string;
    guests: number;
    status: "confirmed" | "cancelled";
    createdAt?: Date;
    notes?: string;
}

export interface BlockedSlot {
    id?: string;
    date: string;          // "YYYY-MM-DD"
    timeSlot: string;      // "all" = whole day, or "HH:MM"
    tableNumber: number;   // 0 = all tables
    reason?: string;
}

/* ================================================================
   CONSTANTS
   ================================================================ */

export const DEFAULT_TABLES = 10;
export const DEFAULT_SEATS = 4;
export const DEFAULT_DURATION = 120; // minutes
export const SLOT_INCREMENT = 30;    // minutes

// Opening hours by day of week (0 = Sunday)
export const OPENING_HOURS: Record<number, { open: number; close: number }> = {
    0: { open: 16, close: 25 },  // Sunday: 16-01 (25 = 01:00 next day)
    1: { open: 16, close: 25 },  // Monday
    2: { open: 16, close: 25 },  // Tuesday
    3: { open: 16, close: 25 },  // Wednesday
    4: { open: 16, close: 25 },  // Thursday
    5: { open: 16, close: 27 },  // Friday: 16-03
    6: { open: 16, close: 27 },  // Saturday: 16-03
};

/* ================================================================
   TIME SLOT HELPERS
   ================================================================ */

/** Generate all time slots for a given day of week */
export function getTimeSlotsForDay(dayOfWeek: number): string[] {
    const hours = OPENING_HOURS[dayOfWeek];
    if (!hours) return [];

    const slots: string[] = [];
    for (let minutes = hours.open * 60; minutes < hours.close * 60; minutes += SLOT_INCREMENT) {
        const h = Math.floor(minutes / 60) % 24;
        const m = minutes % 60;
        slots.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    }
    return slots;
}

/** Check if two time ranges overlap */
function timeRangesOverlap(
    start1: string, duration1: number,
    start2: string, duration2: number
): boolean {
    const toMin = (t: string) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
    };
    const s1 = toMin(start1);
    const e1 = s1 + duration1;
    const s2 = toMin(start2);
    const e2 = s2 + duration2;
    return s1 < e2 && s2 < e1;
}

/* ================================================================
   TABLES
   ================================================================ */

/** Initialize default tables if none exist */
export async function initializeTables(): Promise<void> {
    const tablesRef = collection(getDb(), "tables");
    const snapshot = await getDocs(tablesRef);
    if (snapshot.empty) {
        for (let i = 1; i <= DEFAULT_TABLES; i++) {
            await setDoc(doc(getDb(), "tables", `table-${i}`), {
                number: i,
                seats: DEFAULT_SEATS,
                active: true,
                label: `Borð ${i}`,
            });
        }
    }
}

/** Get all active tables */
export async function getTables(): Promise<Table[]> {
    const tablesRef = collection(getDb(), "tables");
    const snapshot = await getDocs(tablesRef);
    if (snapshot.empty) {
        // Return defaults if Firestore not yet initialized
        return Array.from({ length: DEFAULT_TABLES }, (_, i) => ({
            id: `table-${i + 1}`,
            number: i + 1,
            seats: DEFAULT_SEATS,
            active: true,
            label: `Borð ${i + 1}`,
        }));
    }
    return snapshot.docs
        .map(d => ({ id: d.id, ...d.data() } as Table))
        .filter(t => t.active)
        .sort((a, b) => a.number - b.number);
}

/** Update a table's config */
export async function updateTable(tableId: string, data: Partial<Table>): Promise<void> {
    await updateDoc(doc(getDb(), "tables", tableId), data);
}

/* ================================================================
   RESERVATIONS
   ================================================================ */

/** Get all reservations for a specific date */
export async function getReservationsForDate(date: string): Promise<Reservation[]> {
    const q = query(
        collection(getDb(), "reservations"),
        where("date", "==", date)
    );
    const snapshot = await getDocs(q);

    // Filter and sort in JS to avoid requiring a Firestore composite index
    const all = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Reservation));

    return all
        .filter(r => r.status === "confirmed")
        .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
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
        .sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.timeSlot.localeCompare(b.timeSlot);
        });
}

/** Get blocked slots for a specific date */
export async function getBlockedSlotsForDate(date: string): Promise<BlockedSlot[]> {
    const q = query(
        collection(getDb(), "blockedSlots"),
        where("date", "==", date)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as BlockedSlot));
}

/** Check available tables for a given date, time, guest count */
export async function getAvailableTables(
    date: string,
    timeSlot: string,
    guests: number,
    duration: number = DEFAULT_DURATION
): Promise<Table[]> {
    const [tables, reservations, blockedSlots] = await Promise.all([
        getTables(),
        getReservationsForDate(date),
        getBlockedSlotsForDate(date),
    ]);

    // Filter tables that can seat the party
    const suitableTables = tables.filter(t => t.seats >= guests);

    // Check each table for conflicts
    return suitableTables.filter(table => {
        // Check if blocked
        const isBlocked = blockedSlots.some(b =>
            (b.tableNumber === 0 || b.tableNumber === table.number) &&
            (b.timeSlot === "all" || timeRangesOverlap(timeSlot, duration, b.timeSlot, SLOT_INCREMENT))
        );
        if (isBlocked) return false;

        // Check if already reserved
        const hasConflict = reservations.some(r =>
            r.tableNumber === table.number &&
            timeRangesOverlap(timeSlot, duration, r.timeSlot, r.duration)
        );
        return !hasConflict;
    });
}

/** Create a new reservation */
export async function createReservation(data: Omit<Reservation, "id" | "createdAt" | "status">): Promise<string> {
    // Double-check availability
    const available = await getAvailableTables(data.date, data.timeSlot, data.guests, data.duration);
    const assignedTable = available.find(t => t.number === data.tableNumber) || available[0];

    if (!assignedTable) {
        throw new Error("Ekkert borð laust á þessum tíma");
    }

    const docRef = await addDoc(collection(getDb(), "reservations"), {
        ...data,
        tableNumber: assignedTable.number,
        status: "confirmed",
        createdAt: Timestamp.now(),
    });

    return docRef.id;
}

/** Cancel a reservation */
export async function cancelReservation(id: string): Promise<void> {
    await updateDoc(doc(getDb(), "reservations", id), { status: "cancelled" });
}

/* ================================================================
   BLOCKED SLOTS
   ================================================================ */

/** Block a slot */
export async function blockSlot(data: Omit<BlockedSlot, "id">): Promise<string> {
    const docRef = await addDoc(collection(getDb(), "blockedSlots"), data);
    return docRef.id;
}

/** Unblock a slot */
export async function unblockSlot(id: string): Promise<void> {
    await deleteDoc(doc(getDb(), "blockedSlots", id));
}

/** Get all blocked slots (for admin) */
export async function getAllBlockedSlots(): Promise<BlockedSlot[]> {
    const snapshot = await getDocs(collection(getDb(), "blockedSlots"));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as BlockedSlot));
}
