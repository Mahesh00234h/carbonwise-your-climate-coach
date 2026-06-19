import { describe, it, expect } from "vitest";
import {
  kgToTrees,
  kgToCarKm,
  kgToPhoneCharges,
  sumEmissions,
  projectKg,
  levelFromXp,
  levelProgress,
  impactSummary,
  trendingAverage,
  percentChange,
  safeKg,
  emissionBand,
  streakDays,
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

describe("level progress", () => {
  it("is 0 at level start, 1 at cap", () => {
    expect(levelProgress(0)).toBe(0);
    expect(levelProgress(20000)).toBe(1);
  });

  it("is roughly halfway between thresholds", () => {
    // thresholds: 1200 -> 3600, midpoint 2400
    expect(levelProgress(2400)).toBeCloseTo(0.5, 2);
  });
});

describe("impactSummary", () => {
  it("returns all three equivalents", () => {
    const s = impactSummary(21);
    expect(s.trees).toBe(1);
    expect(s.carKm).toBeGreaterThan(100);
    expect(s.phoneCharges).toBeGreaterThan(2000);
  });

  it("is zeroed for non-positive input", () => {
    expect(impactSummary(0)).toEqual({ trees: 0, carKm: 0, phoneCharges: 0 });
  });
});

describe("trendingAverage", () => {
  it("weights recent values more heavily", () => {
    const flat = trendingAverage([{ kg: 10 }, { kg: 10 }, { kg: 10 }]);
    expect(flat).toBe(10);
    const rising = trendingAverage([{ kg: 0 }, { kg: 0 }, { kg: 12 }]);
    // last value has weight 3 of 6 -> average = 6
    expect(rising).toBe(6);
  });

  it("returns 0 for empty input", () => {
    expect(trendingAverage([])).toBe(0);
  });
});

describe("percentChange", () => {
  it("computes positive and negative deltas", () => {
    expect(percentChange(10, 15)).toBe(50);
    expect(percentChange(10, 5)).toBe(-50);
    expect(percentChange(10, 10)).toBe(0);
  });
  it("is safe for zero or invalid previous", () => {
    expect(percentChange(0, 5)).toBe(0);
    expect(percentChange(Number.NaN, 5)).toBe(0);
  });
});

describe("safeKg", () => {
  it("clamps invalid or negative values to 0", () => {
    expect(safeKg(-3)).toBe(0);
    expect(safeKg(Number.NaN)).toBe(0);
    expect(safeKg("abc")).toBe(0);
  });
  it("rounds to 2 decimal places", () => {
    expect(safeKg(1.236)).toBe(1.24);
    expect(safeKg("2.5")).toBe(2.5);
  });
});

describe("emissionBand", () => {
  it("buckets by severity", () => {
    expect(emissionBand(2)).toBe("low");
    expect(emissionBand(8)).toBe("moderate");
    expect(emissionBand(20)).toBe("high");
    expect(emissionBand(50)).toBe("severe");
  });
  it("handles bad input as low", () => {
    expect(emissionBand(Number.NaN)).toBe("low");
  });
});

describe("streakDays", () => {
  it("counts trailing days under target", () => {
    expect(streakDays([{ kg: 20 }, { kg: 4 }, { kg: 3 }, { kg: 2 }], 5)).toBe(3);
    expect(streakDays([{ kg: 8 }], 5)).toBe(0);
    expect(streakDays([], 5)).toBe(0);
  });
});
