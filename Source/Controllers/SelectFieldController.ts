import { getTargets, TargetMap } from "./Controller";

type HandleChange = (event: Event) => void;

interface SelectFieldTargets extends TargetMap {
  select: HTMLSelectElement;
}

export interface SelectFieldController {
  classSpec: SelectFieldControllerClassSpec;
  handleChange?: HandleChange;
  targets: SelectFieldTargets;
}

export interface SelectFieldControllerSpec {
  classSpec?: SelectFieldControllerClassSpec;
  handleChange?: HandleChange;
  id: string;
}

export interface SelectFieldControllerClassSpec {
  select: string;
}

const defaultClassSpec: SelectFieldControllerClassSpec = {
  select: "select",
};

export const createSelectFieldController = (spec: SelectFieldControllerSpec) => {
  const { handleChange, id } = spec;
  const classSpec = spec.classSpec || defaultClassSpec;

  const controller: SelectFieldController = {
    classSpec,
    handleChange,
    targets: getTargets(id, ["select"]),
  };

  const { select } = controller.targets;

  if (handleChange) {
    select.addEventListener("change", handleChange);
  }

  return controller;
};
