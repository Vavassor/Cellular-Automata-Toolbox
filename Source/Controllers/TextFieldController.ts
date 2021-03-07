import { getTargets, TargetMap } from "./Controller";

interface ChangeEvent {
  controller: TextFieldController;
  sourceEvent: Event;
}

interface TextFieldFocusEvent {
  controller: TextFieldController;
  sourceEvent: FocusEvent;
}

export type HandleChange = (event: ChangeEvent) => void;
export type HandleFocusInCapturing = (event: TextFieldFocusEvent) => void;
export type HandleFocusOutCapturing = (event: TextFieldFocusEvent) => void;

interface TextFieldTargets extends TargetMap {
  input: HTMLInputElement;
  label: HTMLLabelElement;
}

export interface TextFieldController {
  handleChange: HandleChange | null;
  targets: TextFieldTargets;
}

export interface TextFieldControllerSpec {
  handleChange?: HandleChange;
  handleFocusInCapturing?: HandleFocusInCapturing;
  handleFocusOutCapturing?: HandleFocusOutCapturing;
  id: string;
  value?: string;
}

export const createTextFieldController = (spec: TextFieldControllerSpec) => {
  const {
    handleChange,
    handleFocusInCapturing,
    handleFocusOutCapturing,
    id,
    value
  } = spec;

  const controller: TextFieldController = {
    handleChange: handleChange ? handleChange : null,
    targets: getTargets(id, ["input", "label"]),
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
      const textFieldFocusEvent: TextFieldFocusEvent = {
        controller,
        sourceEvent: event,
      };
      handleFocusInCapturing(textFieldFocusEvent);
    });
  }

  if (handleFocusOutCapturing) {
    input.addEventListener("blur", (event) => {
      const textFieldFocusEvent: TextFieldFocusEvent = {
        controller,
        sourceEvent: event,
      };
      handleFocusOutCapturing(textFieldFocusEvent);
    });
  }

  if (value) {
    input.value = value;
  }

  return controller;
};
