import { addClasses } from "../Css";
import { createSubId } from "../Id";

export interface TextFieldComponent {
  input: HTMLInputElement;
  label: HTMLLabelElement;
  textField: HTMLDivElement;
}

export interface TextFieldComponentClassSpec {
  input: string | string[];
  label: string | string[];
  textField: string | string[];
}

export interface TextFieldComponentSpec {
  classSpec?: TextFieldComponentClassSpec;
  defaultValue?: string;
  id: string;
  inputId?: string;
  label: string;
  name: string;
}

const createTextField = (
  spec: TextFieldComponentSpec,
  classSpec: TextFieldComponentClassSpec
) => {
  const { id } = spec;

  const textField = document.createElement("div");
  addClasses(textField, classSpec.textField);
  textField.id = id;

  return textField;
};

const createInput = (
  spec: TextFieldComponentSpec,
  classSpec: TextFieldComponentClassSpec,
  inputId: string
) => {
  const { defaultValue, name } = spec;

  const input = document.createElement("input");
  addClasses(input, classSpec.input);
  input.dataset.target = "input";
  input.id = inputId;
  input.type = "text";

  if (defaultValue) {
    input.defaultValue = defaultValue;
  }
  if (name) {
    input.name = name;
  }

  return input;
};

const createLabel = (
  spec: TextFieldComponentSpec,
  classSpec: TextFieldComponentClassSpec,
  inputId: string
) => {
  const { label } = spec;

  const element = document.createElement("label");
  addClasses(element, classSpec.label);
  element.dataset.target = "label";
  element.htmlFor = inputId;
  element.textContent = label;

  return element;
};

export const defaultClassSpec: TextFieldComponentClassSpec = {
  input: "text-field__input",
  label: "text-field__label",
  textField: "text-field",
};

export const createTextFieldComponent = (spec: TextFieldComponentSpec) => {
  const { id } = spec;
  const classSpec = spec.classSpec || defaultClassSpec;
  const inputId = spec.inputId || createSubId(id, "input");

  const textField = createTextField(spec, classSpec);
  const labelElement = createLabel(spec, classSpec, inputId);
  const input = createInput(spec, classSpec, inputId);
  textField.appendChild(labelElement);
  textField.appendChild(input);

  const component: TextFieldComponent = {
    input,
    label: labelElement,
    textField,
  };

  return component;
};
