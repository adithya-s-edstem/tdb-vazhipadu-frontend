import { ApiError } from "../../types/ApiError";
import { getNetworkSettings, type NetworkSettings } from "./networkSettings";

export async function simulateNetwork<T>(operation: () => T): Promise<T> {
  const settings = getNetworkSettings();
  await wait(pickLatencyMs(settings));
  if (settings.random() < settings.failureRate) {
    throw new ApiError("network", "The request failed. Please try again.");
  }
  return structuredClone(operation());
}

function pickLatencyMs({ minLatencyMs, maxLatencyMs, random }: NetworkSettings): number {
  return Math.round(minLatencyMs + random() * (maxLatencyMs - minLatencyMs));
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
