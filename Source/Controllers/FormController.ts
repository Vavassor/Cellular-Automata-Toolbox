import { getTargets, TargetMap } from "./Controller";

type HandleSubmit = (event: Event) => void;

interface FormTargets extends TargetMap {
  form: HTMLFormElement;
}

export interface FormControllerSpec {
  handleSubmit?: HandleSubmit;
  id: string;
}

export interface FormController {
  handleSubmit?: HandleSubmit;
  targets: FormTargets;
}

export const createFormController = (
  spec: FormControllerSpec
): FormController => {
  const { handleSubmit, id } = spec;

  const controller: FormController = {
    handleSubmit,
    targets: getTargets(id, ["form"]),
  };

  const { form } = controller.targets;

  if (handleSubmit) {
    form.addEventListener("submit", handleSubmit);
  }

  return controller;
};
