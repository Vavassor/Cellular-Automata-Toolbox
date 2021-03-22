import { addClasses } from "../Css";

export interface FormComponentClassSpec {
  form: string | string[];
}

export interface FormComponent {
  form: HTMLFormElement;
}

export interface FormComponentSpec {
  classSpec?: FormComponentClassSpec;
  id: string;
}

export const defaultClassSpec: FormComponentClassSpec = {
  form: "form",
};

const createForm = (
  spec: FormComponentSpec,
  classSpec: FormComponentClassSpec
) => {
  const { id } = spec;

  const form = document.createElement("form");
  addClasses(form, classSpec.form);
  form.id = id;
  form.noValidate = true;

  return form;
};

export const createFormComponent = (spec: FormComponentSpec) => {
  const classSpec = spec.classSpec || defaultClassSpec;

  const form = createForm(spec, classSpec);

  const component: FormComponent = {
    form,
  };

  return component;
};
