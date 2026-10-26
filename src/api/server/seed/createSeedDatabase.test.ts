import { describe, expect, it } from "vitest";
import { ORDER_STATUSES } from "../../types/OrderStatus";
import { createSeedDatabase } from "./createSeedDatabase";

const TODAY = new Date(2026, 9, 26);

describe("createSeedDatabase", () => {
  const database = createSeedDatabase(TODAY);

  function offeringsOf(templeId: string) {
    return database.offerings.filter((offering) => offering.templeId === templeId);
  }

  it("has at least two temples", () => {
    expect(database.temples.length).toBeGreaterThanOrEqual(2);
  });

  it("gives every temple 8 to 10 offerings", () => {
    for (const temple of database.temples) {
      expect(offeringsOf(temple.id).length).toBeGreaterThanOrEqual(8);
      expect(offeringsOf(temple.id).length).toBeLessThanOrEqual(10);
    }
  });

  it("gives every temple at least one inactive offering", () => {
    for (const temple of database.temples) {
      expect(offeringsOf(temple.id).some((offering) => !offering.active)).toBe(true);
    }
  });

  it("has a temple offering active Pushpanjali at ₹30 and Archana at ₹50", () => {
    const isBookableAt = (templeId: string, name: string, price: number) =>
      offeringsOf(templeId).some((offering) => offering.name === name && offering.price === price && offering.active);

    const hasBothOfferings = database.temples.some(
      (temple) => isBookableAt(temple.id, "Pushpanjali", 30) && isBookableAt(temple.id, "Archana", 50),
    );

    expect(hasBothOfferings).toBe(true);
  });

  it("uses unique ids for temples, offerings and orders", () => {
    const ids = [...database.temples, ...database.offerings, ...database.orders].map(({ id }) => id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has around 50 orders", () => {
    expect(database.orders.length).toBeGreaterThanOrEqual(45);
    expect(database.orders.length).toBeLessThanOrEqual(55);
  });

  it("spreads orders across every status", () => {
    const statuses = new Set(database.orders.map((order) => order.status));

    expect([...statuses].sort()).toEqual([...ORDER_STATUSES].sort());
  });

  it("spreads orders across past and future offering dates", () => {
    const dates = new Set(database.orders.map((order) => order.offeringDate));

    expect(dates.size).toBeGreaterThan(10);
    expect([...dates].some((date) => date < "2026-10-26")).toBe(true);
    expect([...dates].some((date) => date > "2026-10-26")).toBe(true);
  });

  it("only marks orders completed when their offering date has passed", () => {
    const completed = database.orders.filter((order) => order.status === "completed");

    expect(completed.every((order) => order.offeringDate < "2026-10-26")).toBe(true);
  });

  it("only orders active offerings of the order's temple", () => {
    for (const order of database.orders) {
      const templeOfferingIds = offeringsOf(order.templeId)
        .filter((offering) => offering.active)
        .map(({ id }) => id);
      expect(order.lines.every((line) => templeOfferingIds.includes(line.offeringId))).toBe(true);
    }
  });

  it("stores each order total as the sum of its line totals", () => {
    for (const order of database.orders) {
      const sumOfLines = order.lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
      expect(order.total).toBe(sumOfLines);
    }
  });
});
