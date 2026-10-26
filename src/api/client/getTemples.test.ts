import { describe, expect, it } from "vitest";
import { useInstantMockApi } from "../../../test/useInstantMockApi";
import { getTemples } from "./getTemples";

describe("getTemples", () => {
  useInstantMockApi();

  it("lists the temples", async () => {
    const temples = await getTemples();

    expect(temples.map((temple) => temple.name)).toEqual(["Vaikom Mahadeva Temple", "Ettumanoor Mahadeva Temple"]);
  });
});
