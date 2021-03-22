import { unique } from "./Array";
import { isAscii } from "./Ascii";
import { numericAscending } from "./Compare";
import { GenerationCaRule } from "./GenerationCa";

const getDigitArrayPart = (part: string) => {
  const digits = unique(Array.from(part).map((value) => parseInt(value)));
  if (digits.find(Number.isNaN) !== undefined) {
    return null;
  }
  return digits.sort(numericAscending);
};

const getNumericPart = (part: string) => {
  const value = parseInt(part);
  return Number.isNaN(value) ? null : value;
};

const getPatternString = (pattern: number[]) => {
  return pattern.join("");
};

export const getRulestring = (rule: GenerationCaRule) => {
  const parts = [
    getPatternString(rule.survivalPattern),
    getPatternString(rule.birthPattern),
    rule.stateCount,
  ];

  const rulestring = parts.join("/");

  return rulestring;
};

export const parseRulestring = (
  rulestring: string
): GenerationCaRule | null => {
  rulestring = rulestring.trim();

  if (!isAscii(rulestring)) {
    return null;
  }

  const parts = rulestring.split("/");
  const survivalPattern = getDigitArrayPart(parts[0]);
  const birthPattern = getDigitArrayPart(parts[1]);
  const stateCount = getNumericPart(parts[2]);

  if (!survivalPattern || !birthPattern || !stateCount) {
    return null;
  }

  const rule: GenerationCaRule = {
    birthPattern,
    survivalPattern,
    stateCount,
  };

  return rule;
};
