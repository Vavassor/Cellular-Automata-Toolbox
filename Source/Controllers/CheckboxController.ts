import { getTargets, TargetMap } from "./Controller";

interface ChangeEvent {
  controller: CheckboxController;
  sourceEvent: Event;
}

interface CheckboxTargets extends TargetMap {
  input: HTMLInputElement;
}

export type HandleChange = (event: ChangeEvent) => void;

export interface CheckboxController {
  handleChange: HandleChange | null;
  targets: CheckboxTargets;
}

export interface CheckboxControllerSpec {
  handleChange?: HandleChange;
  id: string;
  isChecked?: boolean;
}

export const createCheckboxController = (spec: CheckboxControllerSpec) => {
  const { handleChange, id, isChecked } = spec;

  const controller: CheckboxController = {
    handleChange: handleChange ? handleChange : null,
    targets: getTargets(id, ["input"]),
  };

  const { input } = controller.targets;

  if (handleChange) {
    input.addEventListener("change", (event) => {
      const changeEvent: ChangeEvent = {
        controller,
        sourceEvent: event,
      };
      handleChange(changeEvent);
    });
  }

  if (isChecked !== undefined) {
    input.checked = isChecked;
  }

  return controller;
};

export const setIsChecked = (
  controller: CheckboxController,
  isChecked: boolean
) => {
  const { input } = controller.targets;
  input.checked = isChecked;
};
