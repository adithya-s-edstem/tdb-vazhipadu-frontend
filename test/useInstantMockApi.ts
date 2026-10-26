import { afterEach, beforeEach } from "vitest";
import { configureMockApi, resetMockApi } from "../src/api/client";

export function useInstantMockApi(today?: Date): void {
  beforeEach(() => {
    resetMockApi(today);
    configureMockApi({ minLatencyMs: 0, maxLatencyMs: 0, failureRate: 0 });
  });

  afterEach(() => {
    resetMockApi();
  });
}
