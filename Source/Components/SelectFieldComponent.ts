import { concatItems } from "../Array";
import { addClasses } from "../Css";

export interface SelectFieldComponentClassSpec {
  label: string | string[];
  option: string | string[];
  select: string | string[];
  selectField: string | string[];
}

export interface OptionSpec {
  id?: string;
  label: string;
  value: string;
}

export interface SelectFieldComponentSpec {
  classSpec?: SelectFieldComponentClassSpec;
  extraClass?: string | string[];
  id: string;
  label: string;
  name?: string;
  options: OptionSpec[];
  selectId: string;
}

export interface SelectFieldComponent {
  label: HTMLLabelElement;
  select: HTMLSelectElement;
  selectField: HTMLDivElement;
}

export const defaultClassSpec: SelectFieldComponentClassSpec = {
  label: "select-field__label",
  option: "option",
  select: "select-field__input",
  selectField: "select-field",
};

const createLabel = (
  spec: SelectFieldComponentSpec,
  classSpec: SelectFieldComponentClassSpec
) => {
  const { label, selectId } = spec;

  const labelElement = document.createElement("label");
  addClasses(labelElement, classSpec.label);
  labelElement.htmlFor = selectId;
  labelElement.textContent = label;

  return labelElement;
};

const createOption = (
  optionSpec: OptionSpec,
  classSpec: SelectFieldComponentClassSpec
) => {
  const { id, label, value } = optionSpec;

  const option = document.createElement("option");
  addClasses(option, classSpec.option);
  option.textContent = label;
  option.value = value;

  if (id) {
    option.id = id;
  }

  return option;
};

const createSelect = (
  spec: SelectFieldComponentSpec,
  classSpec: SelectFieldComponentClassSpec
) => {
  const { selectId, name } = spec;

  const select = document.createElement("select");
  addClasses(select, classSpec.select);
  select.dataset.target = "select";
  select.id = selectId;

  if (name) {
    select.name = name;
  }

  for (const optionSpec of spec.options) {
    const option = createOption(optionSpec, classSpec);
    select.appendChild(option);
  }

  return select;
};

const createSelectField = (
  spec: SelectFieldComponentSpec,
  classSpec: SelectFieldComponentClassSpec
) => {
  const { extraClass, id } = spec;

  const classes = extraClass
    ? concatItems(classSpec.selectField, extraClass)
    : classSpec.selectField;

  const selectField = document.createElement("div");
  addClasses(selectField, classes);
  selectField.id = id;

  return selectField;
};

export const createSelectFieldComponent = (spec: SelectFieldComponentSpec) => {
  const classSpec = spec.classSpec || defaultClassSpec;

  const label = createLabel(spec, classSpec);
  const select = createSelect(spec, classSpec);
  const selectField = createSelectField(spec, classSpec);
  selectField.appendChild(label);
  selectField.appendChild(select);

  const component: SelectFieldComponent = {
    label,
    select,
    selectField,
  };

  return component;
};
