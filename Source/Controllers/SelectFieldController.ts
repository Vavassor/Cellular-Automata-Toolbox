import { getTargets, TargetMap } from "./Controller";

interface ChangeEvent {
  controller: SelectFieldController;
  sourceEvent: Event;
}

export interface NumberFieldFocusEvent {
  controller: SelectFieldController;
  sourceEvent: FocusEvent;
}

export type HandleChange = (event: ChangeEvent) => void;
export type HandleFocusInCapturing = (event: NumberFieldFocusEvent) => void;
export type HandleFocusOutCapturing = (event: NumberFieldFocusEvent) => void;

interface SelectFieldTargets extends TargetMap {
  select: HTMLSelectElement;
}

export interface SelectFieldController {
  classSpec: SelectFieldControllerClassSpec;
  handleChange: HandleChange | null;
  targets: SelectFieldTargets;
}

export interface SelectFieldControllerSpec {
  classSpec?: SelectFieldControllerClassSpec;
  handleChange?: HandleChange;
  handleFocusInCapturing?: HandleFocusInCapturing;
  handleFocusOutCapturing?: HandleFocusOutCapturing;
  id: string;
  value?: string;
}

export interface SelectFieldControllerClassSpec {
  select: string;
}

const defaultClassSpec: SelectFieldControllerClassSpec = {
  select: "select",
};

export const createSelectFieldController = (
  spec: SelectFieldControllerSpec
) => {
  const {
    handleChange,
    handleFocusInCapturing,
    handleFocusOutCapturing,
    id,
    value,
  } = spec;
  const classSpec = spec.classSpec || defaultClassSpec;

  const controller: SelectFieldController = {
    classSpec,
    handleChange: handleChange ? handleChange : null,
    targets: getTargets(id, ["select"]),
  };

  const { select } = controller.targets;

  if (handleChange) {
    select.addEventListener("change", (event) => {
      const changeEvent: ChangeEvent = {
        controller,
        sourceEvent: event,
      };
      handleChange(changeEvent);
    });
  }

  if (handleFocusInCapturing) {
    select.addEventListener("focus", (event) => {
      const textFieldFocusEvent: NumberFieldFocusEvent = {
        controller,
        sourceEvent: event,
      };
      handleFocusInCapturing(textFieldFocusEvent);
    });
  }

  if (handleFocusOutCapturing) {
    select.addEventListener("blur", (event) => {
      const textFieldFocusEvent: NumberFieldFocusEvent = {
        controller,
        sourceEvent: event,
      };
      handleFocusOutCapturing(textFieldFocusEvent);
    });
  }

  if (value) {
    select.value = value;
  }

  return controller;
};

export const setValue = (controller: SelectFieldController, value: string) => {
  const { select } = controller.targets;
  select.value = value;
};
