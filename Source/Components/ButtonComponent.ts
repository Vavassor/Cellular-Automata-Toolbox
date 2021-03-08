export interface ButtonComponent {
  button: HTMLButtonElement;
}

export interface ButtonComponentClassSpec {
  button: string;
}

export interface ButtonComponentSpec {
  classSpec?: ButtonComponentClassSpec;
  id: string;
  label: string;
}

export const defaultClassSpec: ButtonComponentClassSpec = {
  button: "button",
};

const createButton = (
  spec: ButtonComponentSpec,
  classSpec: ButtonComponentClassSpec
) => {
  const { id, label } = spec;
  const button = document.createElement("button");
  button.classList.add(classSpec.button);
  button.dataset.target = "button";
  button.id = id;
  button.textContent = label;
  button.type = "button";
  
  return button;
};

export const createButtonComponent = (spec: ButtonComponentSpec) => {
  const classSpec = spec.classSpec || defaultClassSpec;

  const button = createButton(spec, classSpec);

  const component: ButtonComponent = {
    button,
  };

  return component;
};
