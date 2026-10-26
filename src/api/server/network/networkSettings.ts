export interface NetworkSettings {
  minLatencyMs: number;
  maxLatencyMs: number;
  failureRate: number;
  random: () => number;
}

export const DEFAULT_NETWORK_SETTINGS: NetworkSettings = {
  minLatencyMs: 200,
  maxLatencyMs: 1000,
  failureRate: 0.1,
  random: Math.random,
};

let currentSettings: NetworkSettings = DEFAULT_NETWORK_SETTINGS;

export function getNetworkSettings(): NetworkSettings {
  return currentSettings;
}

export function configureNetwork(overrides: Partial<NetworkSettings>): void {
  const nextSettings = { ...currentSettings, ...overrides };
  assertValidSettings(nextSettings);
  currentSettings = nextSettings;
}

export function resetNetwork(): void {
  currentSettings = DEFAULT_NETWORK_SETTINGS;
}

function assertValidSettings({ minLatencyMs, maxLatencyMs, failureRate }: NetworkSettings): void {
  if (failureRate < 0 || failureRate > 1) {
    throw new RangeError(`failureRate must be between 0 and 1, got ${failureRate}`);
  }
  if (minLatencyMs < 0 || maxLatencyMs < minLatencyMs) {
    throw new RangeError(`latency range ${minLatencyMs}–${maxLatencyMs} ms is invalid`);
  }
}
