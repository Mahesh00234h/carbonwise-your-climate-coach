import { describe, it, expect } from "vitest";
import {
  tonsToTrees,
  kgToKm,
  HABITS,
  CHALLENGES,
  LEVELS,
  LEADERBOARD,
  weeklyEmissions,
} from "./app-data";

describe("app-data helpers", () => {
  it("tonsToTrees rounds to nearest tree", () => {
    expect(tonsToTrees(21)).toBe(1);
    expect(tonsToTrees(0)).toBe(0);
    expect(tonsToTrees(105)).toBe(5);
  });

  it("kgToKm uses ~120g/km", () => {
    expect(kgToKm(0.12)).toBe(1);
    expect(kgToKm(12)).toBe(100);
  });
});

describe("app-data shape", () => {
  it("every habit has a positive xp and co2 value", () => {
    HABITS.forEach((h) => {
      expect(h.xp).toBeGreaterThan(0);
      expect(h.co2).toBeGreaterThan(0);
      expect(h.label.length).toBeGreaterThan(3);
    });
  });

  it("habit ids are unique", () => {
    const ids = HABITS.map((h) => h.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("challenge progress never exceeds total days", () => {
    CHALLENGES.forEach((c) => {
      expect(c.progress).toBeLessThanOrEqual(c.days);
      expect(c.xp).toBeGreaterThan(0);
    });
  });

  it("levels list has 5 tiers", () => {
    expect(LEVELS.length).toBe(5);
  });

  it("leaderboard is sorted by xp descending", () => {
    for (let i = 1; i < LEADERBOARD.length; i++) {
      expect(LEADERBOARD[i - 1].xp).toBeGreaterThanOrEqual(LEADERBOARD[i].xp);
    }
  });

  it("weekly emissions cover 7 days with non-negative kg", () => {
    expect(weeklyEmissions.length).toBe(7);
    weeklyEmissions.forEach((d) => expect(d.kg).toBeGreaterThanOrEqual(0));
  });
});
