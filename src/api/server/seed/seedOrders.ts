import { addDays, addHours, format, formatISO, startOfDay, subDays } from "date-fns";
import { NAKSHATRAS } from "../../types/Nakshatra";
import type { Offering } from "../../types/Offering";
import type { Order } from "../../types/Order";
import type { OrderLine } from "../../types/OrderLine";
import type { OrderStatus } from "../../types/OrderStatus";
import type { Temple } from "../../types/Temple";
import { orderTotal } from "../services/orderTotal";
import { orderIdFor } from "../services/orderId";

const SEED_ORDER_COUNT = 50;
const MAX_DAYS_BOOKED_AHEAD = 20;
const OPENING_HOUR = 9;
const MAX_LINES_PER_ORDER = 3;
const MAX_QUANTITY_PER_LINE = 3;
const LINE_OFFERING_STRIDE = 3;

const DEVOTEE_NAMES = [
  "Anjali Menon",
  "Arun Nair",
  "Deepa Pillai",
  "Gopika Varma",
  "Hari Krishnan",
  "Lakshmi Warrier",
  "Manoj Kurup",
  "Priya Namboothiri",
  "Sreejith Panicker",
  "Vishnu Prasad",
];

export interface SeedOrdersInput {
  today: Date;
  temples: Temple[];
  offerings: Offering[];
}

export function seedOrders({ today, temples, offerings }: SeedOrdersInput): Order[] {
  const startOfToday = startOfDay(today);
  return Array.from({ length: SEED_ORDER_COUNT }, (_, index) => {
    const temple = itemAt(temples, index);
    const templeOfferings = offerings.filter((offering) => offering.templeId === temple.id && offering.active);
    const lines = seedLines(templeOfferings, index);
    const placedAt = addHours(subDays(startOfToday, SEED_ORDER_COUNT - index), OPENING_HOUR);
    const offeringDate = addDays(placedAt, index % MAX_DAYS_BOOKED_AHEAD);
    return {
      id: orderIdFor(index),
      templeId: temple.id,
      devotee: seedDevotee(index),
      offeringDate: format(offeringDate, "yyyy-MM-dd"),
      placedAt: formatISO(placedAt),
      lines,
      total: orderTotal(lines),
      status: seedStatus(offeringDate < startOfToday, index),
    };
  });
}

function seedLines(templeOfferings: Offering[], index: number): OrderLine[] {
  const lineCount = 1 + (index % MAX_LINES_PER_ORDER);
  return Array.from({ length: lineCount }, (_, lineIndex) => {
    const offering = itemAt(templeOfferings, index + lineIndex * LINE_OFFERING_STRIDE);
    return {
      offeringId: offering.id,
      offeringName: offering.name,
      unitPrice: offering.price,
      quantity: 1 + ((index + lineIndex) % MAX_QUANTITY_PER_LINE),
    };
  });
}

function seedDevotee(index: number) {
  return {
    name: itemAt(DEVOTEE_NAMES, index),
    phone: `98470${10000 + index * 137}`,
    nakshatra: itemAt(NAKSHATRAS, index),
  };
}

function seedStatus(isPast: boolean, index: number): OrderStatus {
  if (isPast) {
    return index % 5 === 0 ? "cancelled" : "completed";
  }
  return index % 4 === 0 ? "cancelled" : "confirmed";
}

function itemAt<T>(items: readonly T[], index: number): T {
  const item = items[index % items.length];
  if (item === undefined) {
    throw new Error("Cannot seed orders from an empty list");
  }
  return item;
}
