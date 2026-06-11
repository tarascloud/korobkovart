import { describe, it, expect } from "vitest";
import en from "../src/messages/en.json";
import ua from "../src/messages/ua.json";
import es from "../src/messages/es.json";

/**
 * i18n key parity: every key present in one locale must exist in all three.
 * Prevents runtime MISSING_MESSAGE errors (e.g. artwork.zoom, 48 errors/7d).
 */

function flattenKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      return flattenKeys(value as Record<string, unknown>, path);
    }
    return [path];
  });
}

const locales: Record<string, Record<string, unknown>> = { en, ua, es };

describe("i18n key parity (en/ua/es)", () => {
  const keySets = Object.fromEntries(
    Object.entries(locales).map(([name, messages]) => [
      name,
      new Set(flattenKeys(messages)),
    ])
  );

  const allKeys = new Set(
    Object.values(keySets).flatMap((set) => [...set])
  );

  for (const [name, keys] of Object.entries(keySets)) {
    it(`${name}.json has every key from all locales`, () => {
      const missing = [...allKeys].filter((key) => !keys.has(key));
      expect(missing, `keys missing in ${name}.json`).toEqual([]);
    });
  }

  it("locales are not empty", () => {
    expect(allKeys.size).toBeGreaterThan(0);
  });
});
