import { getTargets, TargetMap } from "./Controller";

interface SliderTargets extends TargetMap {
  input: HTMLInputElement;
  label: HTMLLabelElement;
}

export interface ChangeEvent {
  controller: SliderController;
  sourceEvent: Event;
  value: number;
}

export type HandleChange = (event: ChangeEvent) => void;

export interface SliderController {
  targets: SliderTargets;
}

export interface SliderControllerSpec {
  handleChange?: HandleChange;
  id: string;
}

export const createSliderController = (spec: SliderControllerSpec) => {
  const { handleChange, id } = spec;

  const controller: SliderController = {
    targets: getTargets(id, ["input", "label"]),
  };

  const { input } = controller.targets;

  if (handleChange) {
    const inputListener = (event: Event) => {
      const value = input.valueAsNumber;
      const changeEvent: ChangeEvent = {
        controller,
        sourceEvent: event,
        value,
      };
      handleChange(changeEvent);
    };
    input.addEventListener("input", inputListener);
  }

  return controller;
};
