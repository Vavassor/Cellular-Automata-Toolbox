import { unique } from "./Array";
import { isAscii } from "./Ascii";
import { numericAscending } from "./Compare";
import { LifelikeCaRule } from "./LifelikeCa";

const getDigitArrayPart = (part: string) => {
  const digits = unique(Array.from(part).map((value) => parseInt(value)));
  if (digits.find(Number.isNaN) !== undefined) {
    return null;
  }
  return digits.sort(numericAscending);
};

const getPatternString = (pattern: number[]) => {
  return pattern.join("");
};

export const getRulestring = (rule: LifelikeCaRule) => {
  const parts = [
    getPatternString(rule.survivalPattern),
    getPatternString(rule.birthPattern),
  ];

  const rulestring = parts.join("/");

  return rulestring;
};

export const parseRulestring = (rulestring: string): LifelikeCaRule | null => {
  rulestring = rulestring.trim();

  if (!isAscii(rulestring)) {
    return null;
  }

  const parts = rulestring.split("/");
  const survivalPattern = getDigitArrayPart(parts[0]);
  const birthPattern = getDigitArrayPart(parts[1]);

  if (!survivalPattern || !birthPattern) {
    return null;
  }

  const rule: LifelikeCaRule = {
    birthPattern,
    survivalPattern,
  };

  return rule;
};
