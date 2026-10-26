import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../../types/ApiError";
import { configureNetwork, getNetworkSettings, resetNetwork } from "./networkSettings";
import { simulateNetwork } from "./simulateNetwork";

function settle<T>(promise: Promise<T>) {
  const outcome: { state: "pending" | "resolved" | "rejected"; value?: T; error?: unknown } = { state: "pending" };
  promise.then(
    (value) => Object.assign(outcome, { state: "resolved", value }),
    (error: unknown) => Object.assign(outcome, { state: "rejected", error }),
  );
  return outcome;
}

function randomSequence(...values: number[]) {
  const queue = [...values];
  return () => queue.shift() ?? 0;
}

describe("simulateNetwork", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    resetNetwork();
  });

  it("defaults to 200–1000 ms latency and a 10% failure rate", () => {
    const settings = getNetworkSettings();

    expect(settings).toMatchObject({ minLatencyMs: 200, maxLatencyMs: 1000, failureRate: 0.1 });
  });

  it("resolves no sooner than the minimum latency", async () => {
    configureNetwork({ random: randomSequence(0, 0.99) });

    const outcome = settle(simulateNetwork(() => "temples"));
    await vi.advanceTimersByTimeAsync(199);
    const stateBeforeMinimum = outcome.state;
    await vi.advanceTimersByTimeAsync(1);

    expect(stateBeforeMinimum).toBe("pending");
    expect(outcome).toEqual({ state: "resolved", value: "temples" });
  });

  it("resolves by the maximum latency", async () => {
    configureNetwork({ random: randomSequence(0.9999, 0.99) });

    const outcome = settle(simulateNetwork(() => "temples"));
    await vi.advanceTimersByTimeAsync(999);
    const stateBeforeMaximum = outcome.state;
    await vi.advanceTimersByTimeAsync(1);

    expect(stateBeforeMaximum).toBe("pending");
    expect(outcome.state).toBe("resolved");
  });

  it("rejects with a network error when the roll falls under the failure rate", async () => {
    configureNetwork({ random: randomSequence(0, 0.05) });

    const outcome = settle(simulateNetwork(() => "temples"));
    await vi.advanceTimersByTimeAsync(200);

    expect(outcome.state).toBe("rejected");
    expect(outcome.error).toBeInstanceOf(ApiError);
    expect(outcome.error).toMatchObject({ code: "network" });
  });

  it("does not run the operation when the call fails", async () => {
    configureNetwork({ failureRate: 1, minLatencyMs: 0, maxLatencyMs: 0 });
    const operation = vi.fn(() => "order");

    const outcome = settle(simulateNetwork(operation));
    await vi.advanceTimersByTimeAsync(0);

    expect(outcome.state).toBe("rejected");
    expect(operation).not.toHaveBeenCalled();
  });

  it("never fails when the failure rate is 0", async () => {
    configureNetwork({ failureRate: 0, random: () => 0 });

    const outcome = settle(simulateNetwork(() => "temples"));
    await vi.advanceTimersByTimeAsync(200);

    expect(outcome.state).toBe("resolved");
  });

  it("resolves on the next tick when latency is set to 0", async () => {
    configureNetwork({ minLatencyMs: 0, maxLatencyMs: 0, failureRate: 0 });

    const outcome = settle(simulateNetwork(() => "temples"));
    await vi.advanceTimersByTimeAsync(0);

    expect(outcome.state).toBe("resolved");
  });

  it("rejects with the operation's error when the operation throws", async () => {
    configureNetwork({ minLatencyMs: 0, maxLatencyMs: 0, failureRate: 0 });
    const notFound = new ApiError("not-found", "Unknown temple");

    const outcome = settle(
      simulateNetwork(() => {
        throw notFound;
      }),
    );
    await vi.advanceTimersByTimeAsync(0);

    expect(outcome).toMatchObject({ state: "rejected", error: notFound });
  });

  it("returns a copy so callers cannot change stored data", async () => {
    configureNetwork({ minLatencyMs: 0, maxLatencyMs: 0, failureRate: 0 });
    const stored = { name: "Pushpanjali" };

    const outcome = settle(simulateNetwork(() => stored));
    await vi.advanceTimersByTimeAsync(0);

    expect(outcome.value).toEqual(stored);
    expect(outcome.value).not.toBe(stored);
  });

  it("rejects settings outside their valid range", () => {
    expect(() => configureNetwork({ failureRate: 1.5 })).toThrow(RangeError);
    expect(() => configureNetwork({ minLatencyMs: 500, maxLatencyMs: 100 })).toThrow(RangeError);
  });
});
