export interface NumberFieldComponentClassSpec {
  input: string;
  label: string;
  numberField: string;
}

export interface NumberFieldComponent {
  input: HTMLInputElement;
  label: HTMLLabelElement;
  numberField: HTMLDivElement;
}

export interface NumberFieldComponentSpec {
  classSpec?: NumberFieldComponentClassSpec;
  id: string;
  inputId: string;
  label: string;
  max?: number;
  min?: number;
  name?: string;
}

const defaultClassSpec: NumberFieldComponentClassSpec = {
  input: "number-field__input",
  label: "number-field__label",
  numberField: "number-field",
};

const createNumberField = (id: string, frameClass: string) => {
  const numberField = document.createElement("div");
  numberField.classList.add(frameClass);
  numberField.id = id;
  return numberField;
};

const createLabel = (inputId: string, label: string, labelClass: string) => {
  const element = document.createElement("label");
  element.classList.add(labelClass);
  element.htmlFor = inputId;
  element.textContent = label;
  return element;
};

const createInput = (spec: NumberFieldComponentSpec, inputClass: string) => {
  const { inputId, max, min, name } = spec;

  const input = document.createElement("input");
  input.classList.add(inputClass);
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
  const { id, inputId, label } = spec;
  const classSpec = spec.classSpec || defaultClassSpec;

  const numberField = createNumberField(id, classSpec.numberField);
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
