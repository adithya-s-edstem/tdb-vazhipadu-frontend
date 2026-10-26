import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useIdempotencyKey } from "./useIdempotencyKey";

const ORDER = { lines: [{ offeringId: "vaikom-pushpanjali", quantity: 2 }], offeringDate: "2026-11-02" };

describe("useIdempotencyKey", () => {
  it("reuses the key when the same order is retried", () => {
    const { result } = renderHook(() => useIdempotencyKey());

    const firstKey = result.current.keyFor(ORDER);
    const retryKey = result.current.keyFor({ ...ORDER });

    expect(retryKey).toBe(firstKey);
  });

  it("starts a new key when the order changes before a retry", () => {
    const { result } = renderHook(() => useIdempotencyKey());

    const firstKey = result.current.keyFor(ORDER);
    const changedKey = result.current.keyFor({ ...ORDER, offeringDate: "2026-11-03" });

    expect(changedKey).not.toBe(firstKey);
  });

  it("starts a new key for the same order once the key is released", () => {
    const { result } = renderHook(() => useIdempotencyKey());
    const firstKey = result.current.keyFor(ORDER);

    result.current.release();

    expect(result.current.keyFor(ORDER)).not.toBe(firstKey);
  });
});
