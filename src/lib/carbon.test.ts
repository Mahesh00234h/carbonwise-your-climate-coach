import { describe, it, expect } from "vitest";
import {
  kgToTrees,
  kgToCarKm,
  kgToPhoneCharges,
  sumEmissions,
  projectKg,
  levelFromXp,
} from "./carbon";

describe("carbon helpers", () => {
  it("converts kg CO2 to tree-years", () => {
    expect(kgToTrees(21)).toBe(1);
    expect(kgToTrees(0)).toBe(0);
    expect(kgToTrees(-5)).toBe(0);
  });

  it("converts kg CO2 to car km", () => {
    expect(kgToCarKm(0.192)).toBe(1);
    expect(kgToCarKm(0)).toBe(0);
  });

  it("converts kg CO2 to phone charges", () => {
    expect(kgToPhoneCharges(0.008)).toBe(1);
  });

  it("sums emission entries safely", () => {
    expect(sumEmissions([{ kg: 1 }, { kg: 2.5 }, { kg: 0 }])).toBe(3.5);
    expect(sumEmissions([])).toBe(0);
    // Resilient to bad data
    expect(sumEmissions([{ kg: Number.NaN }, { kg: 4 }])).toBe(4);
  });

  it("projects daily avg forward", () => {
    expect(projectKg(10, 30)).toBe(300);
    expect(projectKg(0, 30)).toBe(0);
    expect(projectKg(10, 0)).toBe(0);
  });

  it("computes level from xp", () => {
    expect(levelFromXp(0)).toBe(0);
    expect(levelFromXp(1200)).toBe(1);
    expect(levelFromXp(9420)).toBe(3);
    expect(levelFromXp(20000)).toBe(4);
  });
});