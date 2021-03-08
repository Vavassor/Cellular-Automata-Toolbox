import {
  ButtonComponent,
  ButtonComponentClassSpec,
  ButtonComponentSpec,
  createButtonComponent,
} from "./ButtonComponent";

export interface ColorButtonComponentClassSpec {
  swatch: string;
}

export interface ColorButtonComponentSpec {
  buttonSpec?: ButtonComponentSpec;
  classSpec?: ColorButtonComponentClassSpec;
  id: string;
  label: string;
}

export interface ColorButtonComponent {
  button: ButtonComponent;
  swatch: HTMLDivElement;
}

const createSwatch = (classSpec: ColorButtonComponentClassSpec) => {
  const swatch = document.createElement("div");
  swatch.classList.add(classSpec.swatch);
  swatch.dataset.target = "swatch";

  return swatch;
};

const defaultButtonComponentClassSpec: ButtonComponentClassSpec = {
  button: "color-button",
};

export const defaultClassSpec: ColorButtonComponentClassSpec = {
  swatch: "color-button__swatch",
};

export const createColorButtonComponent = (spec: ColorButtonComponentSpec) => {
  const { buttonSpec, id, label } = spec;
  const classSpec = spec.classSpec || defaultClassSpec;

  const button = createButtonComponent({
    classSpec: defaultButtonComponentClassSpec,
    id,
    label,
    ...buttonSpec,
  });

  const swatch = createSwatch(classSpec);

  button.button.insertAdjacentElement("afterbegin", swatch);

  const component: ColorButtonComponent = {
    button,
    swatch,
  };

  return component;
};
