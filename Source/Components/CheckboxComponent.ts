import { concatTruthyItems } from "../Array";
import { addClasses } from "../Css";

export interface CheckboxComponentClassSpec {
  checkbox: string | string[];
  input: string | string[];
  label: string | string[];
}

export interface CheckboxComponentSpec {
  classSpec?: CheckboxComponentClassSpec;
  extraClass?: string | string[];
  id: string;
  inputId: string;
  isChecked?: boolean;
  label: string;
  name?: string;
  value?: string;
}

export interface CheckboxComponent {
  checkbox: HTMLDivElement;
  input: HTMLInputElement;
  label: HTMLLabelElement;
}

export const defaultClassSpec: CheckboxComponentClassSpec = {
  checkbox: "checkbox",
  input: "checkbox__input",
  label: "checkbox__label",
};

const createCheckbox = (
  spec: CheckboxComponentSpec,
  classSpec: CheckboxComponentClassSpec
) => {
  const { id, extraClass } = spec;

  const checkbox = document.createElement("div");
  addClasses(checkbox, concatTruthyItems(classSpec.checkbox, extraClass));
  checkbox.id = id;

  return checkbox;
};

const createInput = (
  spec: CheckboxComponentSpec,
  classSpec: CheckboxComponentClassSpec
) => {
  const { inputId, isChecked, name, value } = spec;

  const input = document.createElement("input");
  addClasses(input, classSpec.input);
  input.dataset.target = "input";
  input.id = inputId;
  input.type = "checkbox";

  if (isChecked) {
    input.checked = true;
  }
  if (name) {
    input.name = name;
  }
  if (value) {
    input.value = value;
  }

  return input;
};

const createLabel = (
  spec: CheckboxComponentSpec,
  classSpec: CheckboxComponentClassSpec
) => {
  const { inputId, label } = spec;

  const labelElement = document.createElement("label");
  addClasses(labelElement, classSpec.label);
  labelElement.htmlFor = inputId;
  labelElement.textContent = label;

  return labelElement;
};

export const createCheckboxComponent = (spec: CheckboxComponentSpec) => {
  const classSpec = spec.classSpec || defaultClassSpec;

  const checkbox = createCheckbox(spec, classSpec);
  const input = createInput(spec, classSpec);
  const label = createLabel(spec, classSpec);
  checkbox.appendChild(input);
  checkbox.appendChild(label);

  const component: CheckboxComponent = {
    checkbox,
    input,
    label,
  };

  return component;
};
