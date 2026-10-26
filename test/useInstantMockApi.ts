import { afterEach, beforeEach } from "vitest";
import { configureMockApi, resetMockApi } from "../src/api/client";
import { FIXED_TODAY, useFixedToday } from "./useFixedToday";

export function useInstantMockApi(today: Date = FIXED_TODAY): void {
  useFixedToday(today);

  beforeEach(() => {
    resetMockApi(today);
    configureMockApi({ minLatencyMs: 0, maxLatencyMs: 0, failureRate: 0 });
  });

  afterEach(() => {
    resetMockApi();
  });
}
