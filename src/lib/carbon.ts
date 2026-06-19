// Pure carbon-math helpers. Kept separate from React/data modules so they
// stay trivially unit-testable and reusable from server functions.

/** Average grams of CO2 absorbed by a mature tree per year. */
export const TREE_KG_PER_YEAR = 21;

/** Average grams of CO2 per km driven by a typical petrol car. */
export const CAR_KG_PER_KM = 0.192;

/** Wh -> kg CO2 for grid electricity (global avg ~0.4 kg / kWh). */
export const GRID_KG_PER_KWH = 0.4;

/** Translate a kg-CO2 amount into a "trees absorbing for a year" equivalent. */
export function kgToTrees(kg: number): number {
  if (!Number.isFinite(kg) || kg <= 0) return 0;
  return Math.round((kg / TREE_KG_PER_YEAR) * 10) / 10;
}

/** Translate kg CO2 into km driven in a typical petrol car. */
export function kgToCarKm(kg: number): number {
  if (!Number.isFinite(kg) || kg <= 0) return 0;
  return Math.round(kg / CAR_KG_PER_KM);
}

/** Translate kg CO2 into smartphone full-charge equivalents (~8g per charge). */
export function kgToPhoneCharges(kg: number): number {
  if (!Number.isFinite(kg) || kg <= 0) return 0;
  return Math.round((kg * 1000) / 8);
}

/** Sum a series of daily emission entries. */
export function sumEmissions(entries: Array<{ kg: number }>): number {
  return entries.reduce((acc, e) => acc + (Number.isFinite(e.kg) ? e.kg : 0), 0);
}

/** Project a daily average forward by N days. */
export function projectKg(dailyAvgKg: number, days: number): number {
  if (!Number.isFinite(dailyAvgKg) || dailyAvgKg < 0) return 0;
  if (!Number.isFinite(days) || days <= 0) return 0;
  return Math.round(dailyAvgKg * days * 10) / 10;
}

/** Pick a level name from a cumulative XP total. */
export function levelFromXp(xp: number, thresholds = [0, 1200, 3600, 8400, 14000]): number {
  let level = 0;
  for (let i = 0; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) level = i;
  }
  return level;
}

/**
 * Progress (0..1) towards the next XP threshold. Returns 1 at the cap.
 * Useful for rendering a level progress bar.
 */
export function levelProgress(xp: number, thresholds = [0, 1200, 3600, 8400, 14000]): number {
  if (!Number.isFinite(xp) || xp <= 0) return 0;
  const level = levelFromXp(xp, thresholds);
  if (level >= thresholds.length - 1) return 1;
  const base = thresholds[level];
  const next = thresholds[level + 1];
  return Math.max(0, Math.min(1, (xp - base) / (next - base)));
}

/** Convert kg CO2 saved to a friendly "X trees / Y km / Z phone charges" summary. */
export function impactSummary(kg: number): {
  trees: number;
  carKm: number;
  phoneCharges: number;
} {
  return {
    trees: kgToTrees(kg),
    carKm: kgToCarKm(kg),
    phoneCharges: kgToPhoneCharges(kg),
  };
}

/** Weighted average of a series of daily emissions, weighted by recency. */
export function trendingAverage(entries: Array<{ kg: number }>): number {
  if (!entries.length) return 0;
  let weightSum = 0;
  let total = 0;
  entries.forEach((e, i) => {
    const w = i + 1; // newer entries weigh more
    weightSum += w;
    total += w * (Number.isFinite(e.kg) ? e.kg : 0);
  });
  return Math.round((total / weightSum) * 100) / 100;
}
