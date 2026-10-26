import { describe, expect, it } from "vitest";
import { toIndianMobile } from "./toIndianMobile";

describe("toIndianMobile", () => {
  it.each(["9847000001", "+919847000001", "+91 98470 00001", "98470-00001"])(
    "reads %s as the 10-digit mobile 9847000001",
    (phone) => {
      expect(toIndianMobile(phone)).toBe("9847000001");
    },
  );

  it.each([
    ["too short", "984700001"],
    ["too long", "98470000012"],
    ["starting with 5", "5847000001"],
    ["containing letters", "98470abc01"],
    ["using another country code", "+449847000001"],
  ])("rejects a number %s", (_reason, phone) => {
    expect(toIndianMobile(phone)).toBeUndefined();
  });
});
