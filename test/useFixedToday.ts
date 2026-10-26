import { afterEach, beforeEach, vi } from "vitest";

export const FIXED_TODAY = new Date(2026, 9, 26);

export function useFixedToday(today: Date = FIXED_TODAY): void {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(today);
  });

  afterEach(() => {
    vi.useRealTimers();
  });
}
