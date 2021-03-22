import { times } from "../Array";
import { copyGenerationCaRule, GenerationCaRule } from "../GenerationCa";
import { getRulestring, parseRulestring } from "../GenerationCaRulestring";
import { createSubId, joinIds } from "../Id";
import { updatePattern } from "../Pattern";
import {
  CheckboxController,
  createCheckboxController,
  HandleChange as HandleChangeCheckbox,
  setIsChecked,
} from "./CheckboxController";
import {
  createNumberFieldController,
  NumberFieldController,
  setValue as setValueNumberField,
} from "./NumberFieldController";
import {
  createTextFieldController,
  setValue as setValueTextField,
  TextFieldController,
} from "./TextFieldController";

export interface GenerationCaSettingsController {
  birthCountControllers: CheckboxController[];
  rule: GenerationCaRule;
  rulestringController: TextFieldController;
  stateCountController: NumberFieldController;
  survivalCountControllers: CheckboxController[];
}

export interface GenerationCaSettingsControllerSpec {
  id: string;
  rule: GenerationCaRule;
}

const setRulestring = (
  rulestringController: TextFieldController,
  rule: GenerationCaRule
) => {
  setValueTextField(rulestringController, getRulestring(rule));
};

export const createGenerationCaSettingsController = (
  spec: GenerationCaSettingsControllerSpec
) => {
  const { id, rule } = spec;
  const rulestringId = createSubId(id, "rulestring");
  const stateCountId = createSubId(id, "state-count");

  let settingsController: GenerationCaSettingsController;

  const handleChangeBirthCount: HandleChangeCheckbox = (event) => {
    const checkboxController = event.controller;
    const { input } = checkboxController.targets;
    const count = parseInt(input.value);
    const { rule, rulestringController } = settingsController;
    rule.birthPattern = updatePattern(rule.birthPattern, count, input.checked);
    setRulestring(rulestringController, rule);
  };

  const handleChangeSurvivalCount: HandleChangeCheckbox = (event) => {
    const checkboxController = event.controller;
    const { input } = checkboxController.targets;
    const count = parseInt(input.value);
    const { rule, rulestringController } = settingsController;
    rule.survivalPattern = updatePattern(
      rule.survivalPattern,
      count,
      input.checked
    );
    setRulestring(rulestringController, rule);
  };

  const birthCountControllers = times(9, (index) => {
    const count = index;
    const controller = createCheckboxController({
      handleChange: handleChangeBirthCount,
      id: joinIds(id, "birth-count", count.toString()),
      isChecked: rule.birthPattern.includes(count),
    });
    return controller;
  });

  const survivalCountControllers = times(9, (index) => {
    const count = index;
    const controller = createCheckboxController({
      handleChange: handleChangeSurvivalCount,
      id: joinIds(id, "survival-count", count.toString()),
      isChecked: rule.survivalPattern.includes(count),
    });
    return controller;
  });

  const stateCountController = createNumberFieldController({
    handleFocusOutCapturing: (event) => {
      const { input } = event.controller.targets;
      const { rule, rulestringController } = settingsController;
      rule.stateCount = parseInt(input.value);
      setRulestring(rulestringController, rule);
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
        setRulestring(rulestringController, settingsController.rule);
      }
    },
    id: rulestringId,
    value: getRulestring(rule),
  });

  settingsController = {
    birthCountControllers,
    rule: copyGenerationCaRule(rule),
    rulestringController,
    stateCountController,
    survivalCountControllers,
  };

  return settingsController;
};

export const setRule = (
  settingsController: GenerationCaSettingsController,
  rule: GenerationCaRule
) => {
  const {
    birthCountControllers,
    rulestringController,
    stateCountController,
    survivalCountControllers,
  } = settingsController;

  birthCountControllers.forEach((controller, index) => {
    setIsChecked(controller, rule.birthPattern.includes(index));
  });
  survivalCountControllers.forEach((controller, index) => {
    setIsChecked(controller, rule.survivalPattern.includes(index));
  });
  setValueNumberField(stateCountController, rule.stateCount);
  setRulestring(rulestringController, rule);

  settingsController.rule = copyGenerationCaRule(rule);
};
