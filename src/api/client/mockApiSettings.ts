import { configureNetwork, resetNetwork, type NetworkSettings } from "../server/network/networkSettings";
import { resetDatabase } from "../server/store/currentDatabase";

export type MockApiSettings = NetworkSettings;

export function configureMockApi(overrides: Partial<MockApiSettings>): void {
  configureNetwork(overrides);
}

export function resetMockApi(today?: Date): void {
  resetNetwork();
  resetDatabase(today);
}
