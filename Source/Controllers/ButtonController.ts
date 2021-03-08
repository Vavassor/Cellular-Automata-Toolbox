import { getTargets, TargetMap } from "./Controller";

interface ClickEvent {
  controller: ButtonController;
  sourceEvent: MouseEvent;
}

export type HandleClickButton = (event: ClickEvent) => void;

type ClickEventListener = (event: MouseEvent) => void;

interface ButtonTargets extends TargetMap {
  button: HTMLButtonElement;
}

export interface ButtonControllerSpec {
  handleClick?: HandleClickButton;
  id: string;
  isDisabled?: boolean;
}

export interface ButtonController {
  clickEventListener: ClickEventListener | null;
  isDisabled: boolean;
  targets: ButtonTargets;
}

export const createButtonController = (
  spec: ButtonControllerSpec
): ButtonController => {
  const { handleClick, id, isDisabled } = spec;

  let controller: ButtonController;

  const clickEventListener = (event: MouseEvent) => {
    const clickEvent: ClickEvent = {
      controller,
      sourceEvent: event,
    };
    if (handleClick) {
      handleClick(clickEvent);
    }
  };

  controller = {
    clickEventListener: !!handleClick ? clickEventListener : null,
    isDisabled: !!isDisabled,
    targets: getTargets(id, ["button"]),
  };

  const { button } = controller.targets;
  button.disabled = controller.isDisabled;

  if (handleClick) {
    button.addEventListener("click", clickEventListener);
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
