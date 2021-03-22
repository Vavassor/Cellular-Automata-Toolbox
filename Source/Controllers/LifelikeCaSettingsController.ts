import { times } from "../Array";
import { getRulestring, parseRulestring } from "../LifelikeCaRulestring";
import { createSubId, joinIds } from "../Id";
import { copyLifelikeCaRule, LifelikeCaRule } from "../LifelikeCa";
import { updatePattern } from "../Pattern";
import {
  CheckboxController,
  createCheckboxController,
  HandleChange as HandleChangeCheckbox,
  setIsChecked,
} from "./CheckboxController";
import {
  createTextFieldController,
  setValue as setValueTextField,
  TextFieldController,
} from "./TextFieldController";

export interface LifelikeCaSettingsController {
  birthCountControllers: CheckboxController[];
  rule: LifelikeCaRule;
  rulestringController: TextFieldController;
  survivalCountControllers: CheckboxController[];
}

export interface LifelikeCaSettingsControllerSpec {
  id: string;
  rule: LifelikeCaRule;
}

const setRulestring = (
  rulestringController: TextFieldController,
  rule: LifelikeCaRule
) => {
  setValueTextField(rulestringController, getRulestring(rule));
};

export const createLifelikeCaSettingsController = (
  spec: LifelikeCaSettingsControllerSpec
) => {
  const { id, rule } = spec;
  const rulestringId = createSubId(id, "rulestring");

  let settingsController: LifelikeCaSettingsController;

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
    rule: copyLifelikeCaRule(rule),
    rulestringController,
    survivalCountControllers,
  };

  return settingsController;
};

export const setRule = (
  settingsController: LifelikeCaSettingsController,
  rule: LifelikeCaRule
) => {
  const {
    birthCountControllers,
    rulestringController,
    survivalCountControllers,
  } = settingsController;

  birthCountControllers.forEach((controller, index) => {
    setIsChecked(controller, rule.birthPattern.includes(index));
  });
  survivalCountControllers.forEach((controller, index) => {
    setIsChecked(controller, rule.survivalPattern.includes(index));
  });
  setRulestring(rulestringController, rule);

  settingsController.rule = copyLifelikeCaRule(rule);
};
