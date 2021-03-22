import { copyCyclicCaRule, CyclicCaRule, parseNeighborhood } from "../CyclicCa";
import { getRulestring, parseRulestring } from "../CyclicCaRulestring";
import { createSubId } from "../Id";
import {
  createNumberFieldController,
  NumberFieldController,
  setValue as setValueNumberField,
} from "./NumberFieldController";
import {
  createSelectFieldController,
  SelectFieldController,
  setValue as setValueSelectField,
} from "./SelectFieldController";
import {
  createTextFieldController,
  setValue as setValueTextField,
  TextFieldController,
} from "./TextFieldController";

interface SubcomponentIdSpec {
  advanceThresholdId?: string;
  neighborhoodId?: string;
  neighborhoodRangeId?: string;
  rulestringId?: string;
  stateCountId?: string;
}

export interface CyclicCaSettingsControllerSpec {
  id: string;
  subcomponentIdSpec?: SubcomponentIdSpec;
  rule: CyclicCaRule;
}

export interface CyclicCaSettingsController {
  advanceThresholdController: NumberFieldController;
  neighborhoodController: SelectFieldController;
  neighborhoodRangeController: NumberFieldController;
  rule: CyclicCaRule;
  rulestringController: TextFieldController;
  stateCountController: NumberFieldController;
}

const updateRulestring = (
  rulestringController: TextFieldController,
  rule: CyclicCaRule
) => {
  setValueTextField(rulestringController, getRulestring(rule));
};

export const createCyclicCaSettingsController = (
  spec: CyclicCaSettingsControllerSpec
) => {
  const { id, rule } = spec;
  const idSpec = spec.subcomponentIdSpec || {};
  const advanceThresholdId =
    idSpec.advanceThresholdId ||
    createSubId(id, "advance-threshold-number-field");
  const neighborhoodId =
    idSpec.neighborhoodId || createSubId(id, "neighborhood-select-field");
  const neighborhoodRangeId =
    idSpec.neighborhoodRangeId ||
    createSubId(id, "neighborhood-range-number-field");
  const rulestringId =
    idSpec.rulestringId || createSubId(id, "rulestring-text-field");
  const stateCountId =
    idSpec.stateCountId || createSubId(id, "state-count-number-field");

  let settingsController: CyclicCaSettingsController;

  const advanceThresholdController = createNumberFieldController({
    handleFocusOutCapturing: (event) => {
      const { input } = event.controller.targets;
      const { rule, rulestringController } = settingsController;
      rule.advanceThreshold = parseInt(input.value);
      updateRulestring(rulestringController, rule);
    },
    id: advanceThresholdId,
    value: rule.advanceThreshold,
  });

  const neighborhoodRangeController = createNumberFieldController({
    handleFocusOutCapturing: (event) => {
      const { input } = event.controller.targets;
      const { rule, rulestringController } = settingsController;
      rule.neighborhoodRange = parseInt(input.value);
      updateRulestring(rulestringController, rule);
    },
    id: neighborhoodRangeId,
    value: rule.neighborhoodRange,
  });

  const neighborhoodController = createSelectFieldController({
    handleFocusOutCapturing: (event) => {
      const { select } = event.controller.targets;
      const { rule, rulestringController } = settingsController;
      rule.neighborhood = parseNeighborhood(select.value);
      updateRulestring(rulestringController, rule);
    },
    id: neighborhoodId,
    value: rule.neighborhood,
  });

  const stateCountController = createNumberFieldController({
    handleFocusOutCapturing: (event) => {
      const { input } = event.controller.targets;
      const { rule, rulestringController } = settingsController;
      rule.stateCount = parseInt(input.value);
      updateRulestring(rulestringController, rule);
    },
    id: stateCountId,
    value: rule.stateCount,
  });

  const rulestringController = createTextFieldController({
    handleFocusOutCapturing: (event) => {
      const { input } = event.controller.targets;
      const rule = parseRulestring(input.value);
      if (rule) {
        setRule(settingsController, rule);
      } else {
        updateRulestring(rulestringController, settingsController.rule);
      }
    },
    id: rulestringId,
    value: getRulestring(rule),
  });

  settingsController = {
    advanceThresholdController,
    neighborhoodController,
    neighborhoodRangeController,
    rule: copyCyclicCaRule(rule),
    rulestringController,
    stateCountController,
  };

  return settingsController;
};

export const setRule = (
  controller: CyclicCaSettingsController,
  rule: CyclicCaRule
) => {
  const {
    advanceThresholdController,
    neighborhoodController,
    neighborhoodRangeController,
    stateCountController,
  } = controller;

  setValueNumberField(advanceThresholdController, rule.advanceThreshold);
  setValueNumberField(neighborhoodRangeController, rule.neighborhoodRange);
  setValueSelectField(neighborhoodController, rule.neighborhood);
  setValueNumberField(stateCountController, rule.stateCount);

  controller.rule = copyCyclicCaRule(rule);
};
