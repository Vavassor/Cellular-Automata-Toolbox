export interface SliderComponentClassSpec {
  input: string;
  label: string;
  slider: string;
}

export interface SliderComponentSpec {
  classSpec?: SliderComponentClassSpec;
  id: string;
  inputId: string;
  isLabelHidden?: boolean;
  label: string;
  max?: number;
  min?: number;
  name: string;
  step?: number;
}

export interface SliderComponent {
  input: HTMLInputElement;
  label: HTMLLabelElement;
  slider: HTMLDivElement;
}

const defaultClassSpec: SliderComponentClassSpec = {
  input: "slider__input",
  label: "slider__label",
  slider: "slider",
};

const createLabel = (
  spec: SliderComponentSpec,
  classSpec: SliderComponentClassSpec
) => {
  const { inputId, label } = spec;
  const isLabelHidden = !!spec.isLabelHidden;

  const labelElement = document.createElement("label");
  labelElement.classList.add(classSpec.label);
  labelElement.dataset.target = "label";
  labelElement.htmlFor = inputId;
  labelElement.textContent = label;

  if (isLabelHidden) {
    labelElement.classList.add("visually-hidden");
  }

  return labelElement;
};

const createInput = (
  spec: SliderComponentSpec,
  classSpec: SliderComponentClassSpec
) => {
  const { inputId, max, min, name, step } = spec;

  const input = document.createElement("input");
  input.classList.add(classSpec.input);
  input.dataset.target = "input";
  input.id = inputId;
  input.name = name;
  input.type = "range";

  if (max) {
    input.max = max.toString();
  }
  if (min) {
    input.min = min.toString();
  }
  if (step) {
    input.step = step.toString();
  }

  return input;
};

const createSlider = (
  spec: SliderComponentSpec,
  classSpec: SliderComponentClassSpec
) => {
  const { id } = spec;

  const slider = document.createElement("div");
  slider.classList.add(classSpec.slider);
  slider.id = id;

  return slider;
};

export const createSliderComponent = (spec: SliderComponentSpec) => {
  const classSpec = spec.classSpec || defaultClassSpec;

  const input = createInput(spec, classSpec);
  const label = createLabel(spec, classSpec);
  const slider = createSlider(spec, classSpec);
  slider.appendChild(label);
  slider.appendChild(input);

  const component: SliderComponent = {
    input,
    label,
    slider,
  };

  return component;
};
