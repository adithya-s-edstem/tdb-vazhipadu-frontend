import { afterEach, beforeEach, vi } from "vitest";
import { configureMockApi, resetMockApi } from "../src/api/client";

const FIXED_TODAY = new Date(2026, 9, 26);

export function useInstantMockApi(today: Date = FIXED_TODAY): void {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(today);
    resetMockApi(today);
    configureMockApi({ minLatencyMs: 0, maxLatencyMs: 0, failureRate: 0 });
  });

  afterEach(() => {
    resetMockApi();
    vi.useRealTimers();
  });
}
