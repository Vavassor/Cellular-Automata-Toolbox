export interface SelectFieldComponentClassSpec {
  option: string;
  select: string;
}

export interface OptionSpec {
  label: string;
  value: string;
}

export interface SelectFieldComponentSpec {
  ariaLabelledBy: string;
  classSpec?: SelectFieldComponentClassSpec;
  id: string;
  name?: string;
  options: OptionSpec[];
}

export interface SelectComponent {
  select: HTMLSelectElement;
}

const defaultClassSpec: SelectFieldComponentClassSpec = {
  option: "option",
  select: "select",
};

const createOption = (optionSpec: OptionSpec, optionClass: string) => {
  const { label, value } = optionSpec;
  const option = document.createElement("option");
  option.classList.add(optionClass);
  option.textContent = label;
  option.value = value;
  return option;
};

export const createSelectFieldComponent = (spec: SelectFieldComponentSpec) => {
  const { ariaLabelledBy, id, name } = spec;
  const classSpec = spec.classSpec || defaultClassSpec;

  const select = document.createElement("select");
  select.classList.add(classSpec.select);
  select.dataset.target = "select";
  select.id = id;
  select.setAttribute("aria-labelledby", ariaLabelledBy);

  if (name) {
    select.name = name;
  }

  for (const optionSpec of spec.options) {
    const option = createOption(optionSpec, classSpec.option);
    select.appendChild(option);
  }

  const component: SelectComponent = {
    select,
  };

  return component;
};
