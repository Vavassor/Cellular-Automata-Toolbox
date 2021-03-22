import { getTargets, TargetMap } from "./Controller";

interface ChangeEvent {
  controller: NumberFieldController;
  sourceEvent: Event;
}

export interface NumberFieldFocusEvent {
  controller: NumberFieldController;
  sourceEvent: FocusEvent;
}

export type HandleChange = (event: ChangeEvent) => void;
export type HandleFocusInCapturing = (event: NumberFieldFocusEvent) => void;
export type HandleFocusOutCapturing = (event: NumberFieldFocusEvent) => void;

interface NumberFieldTargets extends TargetMap {
  input: HTMLInputElement;
}

export interface NumberFieldControllerSpec {
  handleChange?: HandleChange;
  handleFocusInCapturing?: HandleFocusInCapturing;
  handleFocusOutCapturing?: HandleFocusOutCapturing;
  id: string;
  value?: number;
}

export interface NumberFieldController {
  handleChange: HandleChange | null;
  targets: NumberFieldTargets;
}

export const createNumberFieldController = (
  spec: NumberFieldControllerSpec
) => {
  const {
    handleChange,
    handleFocusInCapturing,
    handleFocusOutCapturing,
    id,
    value,
  } = spec;

  const controller: NumberFieldController = {
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

  if (handleFocusInCapturing) {
    input.addEventListener("focus", (event) => {
      const textFieldFocusEvent: NumberFieldFocusEvent = {
        controller,
        sourceEvent: event,
      };
      handleFocusInCapturing(textFieldFocusEvent);
    });
  }

  if (handleFocusOutCapturing) {
    input.addEventListener("blur", (event) => {
      const textFieldFocusEvent: NumberFieldFocusEvent = {
        controller,
        sourceEvent: event,
      };
      handleFocusOutCapturing(textFieldFocusEvent);
    });
  }

  if (value) {
    input.value = value.toString();
  }

  return controller;
};

export const setValue = (controller: NumberFieldController, value: number) => {
  const { input } = controller.targets;
  input.value = value.toString();
};
