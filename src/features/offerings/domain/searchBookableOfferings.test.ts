import { describe, expect, it } from "vitest";
import { buildOffering } from "../../../../test/buildOffering";
import { searchBookableOfferings } from "./searchBookableOfferings";

const pushpanjali = buildOffering({ id: "pushpanjali", name: "Pushpanjali" });
const swayamvaraPushpanjali = buildOffering({ id: "swayamvara", name: "Swayamvara Pushpanjali" });
const archana = buildOffering({ id: "archana", name: "Archana" });
const inactiveEnnabhishekam = buildOffering({ id: "ennabhishekam", name: "Ennabhishekam", active: false });
const offerings = [pushpanjali, swayamvaraPushpanjali, archana, inactiveEnnabhishekam];

describe("searchBookableOfferings", () => {
  it("returns every active offering when the search is empty", () => {
    expect(searchBookableOfferings(offerings, "")).toEqual([pushpanjali, swayamvaraPushpanjali, archana]);
  });

  it("never returns inactive offerings", () => {
    expect(searchBookableOfferings(offerings, "ennabhishekam")).toEqual([]);
  });

  it("matches ignoring case", () => {
    expect(searchBookableOfferings(offerings, "PUSH")).toContain(pushpanjali);
  });

  it("matches anywhere in the name", () => {
    expect(searchBookableOfferings(offerings, "push")).toEqual([pushpanjali, swayamvaraPushpanjali]);
  });

  it("ignores spaces around the search", () => {
    expect(searchBookableOfferings(offerings, "  archana ")).toEqual([archana]);
  });

  it("returns nothing when no name matches", () => {
    expect(searchBookableOfferings(offerings, "thulabharam")).toEqual([]);
  });
});
