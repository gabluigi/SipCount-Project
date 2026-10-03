// formula for calculating standard drinks based on volume and ABV
// src/utils/alcohol.js
const ETHANOL_DENSITY = 0.789; // grams per ml of pure ethanol

export function gramsOfAlcoholFor(volumeMl, abvPercent) {
  if (!volumeMl || !abvPercent) return 0;
  return volumeMl * (abvPercent / 100) * ETHANOL_DENSITY;
}
