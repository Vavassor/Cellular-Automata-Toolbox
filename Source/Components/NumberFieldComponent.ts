import { concatTruthyItems } from "../Array";
import { addClasses } from "../Css";

export interface NumberFieldComponentClassSpec {
  input: string | string[];
  label: string | string[];
  numberField: string | string[];
}

export interface NumberFieldComponent {
  input: HTMLInputElement;
  label: HTMLLabelElement;
  numberField: HTMLDivElement;
}

export interface NumberFieldComponentSpec {
  classSpec?: NumberFieldComponentClassSpec;
  extraClass?: string | string[];
  id: string;
  inputId: string;
  label: string;
  max?: number;
  min?: number;
  name?: string;
}

export const defaultClassSpec: NumberFieldComponentClassSpec = {
  input: "number-field__input",
  label: "number-field__label",
  numberField: "number-field",
};

const createNumberField = (
  spec: NumberFieldComponentSpec,
  classSpec: NumberFieldComponentClassSpec
) => {
  const { extraClass, id } = spec;

  const numberField = document.createElement("div");
  addClasses(numberField, concatTruthyItems(classSpec.numberField, extraClass));
  numberField.id = id;

  return numberField;
};

const createLabel = (
  inputId: string,
  label: string,
  labelClass: string | string[]
) => {
  const element = document.createElement("label");
  addClasses(element, labelClass);
  element.htmlFor = inputId;
  element.textContent = label;
  return element;
};

const createInput = (
  spec: NumberFieldComponentSpec,
  inputClass: string | string[]
) => {
  const { inputId, max, min, name } = spec;

  const input = document.createElement("input");
  addClasses(input, inputClass);
  input.dataset.target = "input";
  input.id = inputId;
  input.type = "number";

  if (max) {
    input.max = max.toString();
  }
  if (min) {
    input.min = min.toString();
  }
  if (name) {
    input.name = name;
  }

  return input;
};

export const createNumberFieldComponent = (spec: NumberFieldComponentSpec) => {
  const { inputId, label } = spec;
  const classSpec = spec.classSpec || defaultClassSpec;

  const numberField = createNumberField(spec, classSpec);
  const labelElement = createLabel(inputId, label, classSpec.label);
  const input = createInput(spec, classSpec.input);
  numberField.appendChild(labelElement);
  numberField.appendChild(input);

  const component: NumberFieldComponent = {
    input,
    label: labelElement,
    numberField,
  };

  return component;
};
