import { getTargets, TargetMap } from "./Controller";

type HandleChange = (event: Event) => void;

interface RadioButtonTargets extends TargetMap {
  radioButton: HTMLInputElement;
}

export interface RadioButtonController {
  classSpec: RadioButtonControllerClassSpec;
  handleChange?: HandleChange;
  targets: RadioButtonTargets;
}

export interface RadioButtonControllerSpec {
  classSpec?: RadioButtonControllerClassSpec;
  handleChange?: HandleChange;
  id: string;
}

export interface RadioButtonControllerClassSpec {
  radioButton: string;
}

const defaultClassSpec: RadioButtonControllerClassSpec = {
  radioButton: "radio-button",
};

export const createRadioButtonController = (
  spec: RadioButtonControllerSpec
) => {
  const { handleChange, id } = spec;
  const classSpec = spec.classSpec || defaultClassSpec;

  const controller: RadioButtonController = {
    classSpec,
    handleChange,
    targets: getTargets(id, ["radioButton"]),
  };

  const { radioButton } = controller.targets;

  if (handleChange) {
    radioButton.addEventListener("change", handleChange);
  }

  return controller;
};
