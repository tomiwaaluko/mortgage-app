import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock localStorage with proper typing
const storage: Record<string, string> = {};

const localStorageMock = {
  getItem: (key: string): string | null => {
    return storage[key] || null;
  },
  setItem: (key: string, value: string): void => {
    storage[key] = value;
  },
  removeItem: (key: string): void => {
    delete storage[key];
  },
  clear: (): void => {
    Object.keys(storage).forEach((key) => {
      delete storage[key];
    });
  },
};

globalThis.localStorage = localStorageMock as Storage;
