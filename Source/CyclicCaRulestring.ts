import { isAscii } from "./Ascii";
import { CyclicCaRule, Neighborhood } from "./CyclicCa";

const getNeighborhoodMarker = (neighborhood: Neighborhood) => {
  switch (neighborhood) {
    case Neighborhood.Moore:
      return "NM";
    case Neighborhood.VonNeumann:
      return "NN";
  }
};

const getNeighborhoodFromMarker = (marker: string) => {
  switch (marker) {
    case "NM":
      return Neighborhood.Moore;
    case "NN":
      return Neighborhood.VonNeumann;
    default:
      return null;
  }
};

const getNumericPart = (part: string, marker: string) => {
  if (part.startsWith(marker)) {
    const value = parseInt(part.slice(1));
    if (Number.isNaN(value)) {
      return null;
    }
    return value;
  }
  return null;
};

export const getRulestring = (rule: CyclicCaRule) => {
  const parts = [
    `R${rule.neighborhoodRange}`,
    `T${rule.advanceThreshold}`,
    `C${rule.stateCount}`,
    getNeighborhoodMarker(rule.neighborhood),
  ];

  const rulestring = parts.join("/");

  return rulestring;
};

export const parseRulestring = (rulestring: string): CyclicCaRule | null => {
  rulestring = rulestring.trim();

  if (!isAscii(rulestring)) {
    return null;
  }

  const parts = rulestring.split("/");
  const neighborhoodRange = getNumericPart(parts[0], "R");
  const advanceThreshold = getNumericPart(parts[1], "T");
  const stateCount = getNumericPart(parts[2], "C");
  const neighborhood = getNeighborhoodFromMarker(parts[3]);

  if (!neighborhoodRange || !advanceThreshold || !stateCount || !neighborhood) {
    return null;
  }

  const rule: CyclicCaRule = {
    advanceThreshold,
    neighborhood,
    neighborhoodRange,
    stateCount,
  };

  return rule;
};
