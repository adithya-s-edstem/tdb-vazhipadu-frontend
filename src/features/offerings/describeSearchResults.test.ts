import { describe, expect, it } from "vitest";
import { describeSearchResults } from "./describeSearchResults";

describe("describeSearchResults", () => {
  it("says no offering matches the trimmed search term when nothing matches", () => {
    expect(describeSearchResults(0, "  xyz ")).toBe('No offerings match "xyz".');
  });

  it("uses the singular for one matching offering", () => {
    expect(describeSearchResults(1, "push")).toBe("1 offering available.");
  });

  it("uses the plural for several matching offerings", () => {
    expect(describeSearchResults(8, "")).toBe("8 offerings available.");
  });
});
