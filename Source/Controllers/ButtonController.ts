import { getTargets, TargetMap } from "./Controller";

type HandleClickButton = (event: MouseEvent) => void;

interface ButtonTargets extends TargetMap {
  button: HTMLButtonElement;
}

export interface ButtonControllerSpec {
  handleClick?: HandleClickButton;
  id: string;
  isDisabled?: boolean;
}

export interface ButtonController {
  isDisabled: boolean;
  handleClick?: HandleClickButton;
  targets: ButtonTargets;
}

export const createButtonController = (
  spec: ButtonControllerSpec
): ButtonController => {
  const { handleClick, id, isDisabled } = spec;

  const controller: ButtonController = {
    isDisabled: !!isDisabled,
    handleClick,
    targets: getTargets(id, ["button"]),
  };

  const { button } = controller.targets;
  button.disabled = controller.isDisabled;

  if (handleClick) {
    button.addEventListener("click", handleClick);
  }

  return controller;
};

export const setDisabled = (
  controller: ButtonController,
  isDisabled: boolean
) => {
  const { button } = controller.targets;
  button.disabled = isDisabled;
  controller.isDisabled = isDisabled;
};
