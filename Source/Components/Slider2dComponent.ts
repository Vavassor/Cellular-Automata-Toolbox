export interface Slider2dComponentClassSpec {
  field: string;
  slider: string;
  thumb: string;
  thumbLabel: string;
}

export interface Slider2dComponent {
  field: HTMLDivElement;
  slider: HTMLDivElement;
  thumb: HTMLDivElement;
  thumbLabel: HTMLSpanElement;
}

export interface Slider2dComponentSpec {
  classSpec?: Slider2dComponentClassSpec;
  id: string;
}

export const defaultClassSpec: Slider2dComponentClassSpec = {
  field: "slider-2d__field",
  slider: "slider-2d",
  thumb: "slider-2d__thumb",
  thumbLabel: "slider-2d__thumb-label",
};

const createField = (classSpec: Slider2dComponentClassSpec) => {
  const field = document.createElement("div");
  field.classList.add(classSpec.field);
  field.dataset.target = "field";

  return field;
};

const createSlider = (
  spec: Slider2dComponentSpec,
  classSpec: Slider2dComponentClassSpec
) => {
  const { id } = spec;

  const slider = document.createElement("div");
  slider.classList.add(classSpec.slider);
  slider.id = id;

  return slider;
};

const createThumbLabel = (classSpec: Slider2dComponentClassSpec) => {
  const thumbLabel = document.createElement("span");
  thumbLabel.classList.add(classSpec.thumbLabel);
  thumbLabel.dataset.target = "thumbLabel";
  thumbLabel.textContent = "X 0, Y 0";

  return thumbLabel;
};

const createThumb = (classSpec: Slider2dComponentClassSpec) => {
  const thumb = document.createElement("div");
  thumb.classList.add(classSpec.thumb);
  thumb.dataset.target = "thumb";
  thumb.tabIndex = 0;

  return thumb;
};

export const createSlider2dComponent = (spec: Slider2dComponentSpec) => {
  const classSpec = spec.classSpec || defaultClassSpec;

  const field = createField(classSpec);
  const slider = createSlider(spec, classSpec);
  const thumb = createThumb(classSpec);
  const thumbLabel = createThumbLabel(classSpec);
  thumb.appendChild(thumbLabel);
  slider.appendChild(field);
  slider.appendChild(thumb);

  const component: Slider2dComponent = {
    field,
    slider,
    thumb,
    thumbLabel,
  };

  return component;
};
