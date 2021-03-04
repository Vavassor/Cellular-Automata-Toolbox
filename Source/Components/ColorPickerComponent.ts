import { concatItems } from "../Array";
import { createSubId } from "../Id";
import {
  createSlider2dComponent,
  defaultClassSpec as defaultSlider2dClassSpec,
  Slider2dComponent,
  Slider2dComponentSpec,
} from "./Slider2dComponent";
import {
  createSliderComponent,
  SliderComponent,
  SliderComponentSpec,
} from "./SliderComponent";
import {
  createTextFieldComponent,
  defaultClassSpec as defaultTextFieldClassSpec,
  TextFieldComponent,
  TextFieldComponentSpec,
} from "./TextFieldComponent";

export interface ColorPickerComponent {
  colorPicker: HTMLDivElement;
  hexadecimalTextField: TextFieldComponent;
  hueSlider: SliderComponent;
  saturationValueSlider: Slider2dComponent;
}

export interface ColorPickerComponentClassSpec {
  colorPicker: string;
  row: string;
  swatch: string;
}

export interface ColorPickerComponentSpec {
  classSpec?: ColorPickerComponentClassSpec;
  id: string;
  hexadecimalTextFieldSpec?: TextFieldComponentSpec;
  hueSliderSpec?: SliderComponentSpec;
  saturationValueSliderSpec?: Slider2dComponentSpec;
}

export const defaultClassSpec: ColorPickerComponentClassSpec = {
  colorPicker: "color-picker",
  row: "color-picker__row",
  swatch: "color-picker__swatch",
};

const createColorPicker = (
  spec: ColorPickerComponentSpec,
  classSpec: ColorPickerComponentClassSpec
) => {
  const { id } = spec;
  const colorPicker = document.createElement("div");
  colorPicker.classList.add(classSpec.colorPicker);
  colorPicker.id = id;

  return colorPicker;
};

const createRow = (classSpec: ColorPickerComponentClassSpec) => {
  const row = document.createElement("div");
  row.classList.add(classSpec.row);

  return row;
};

const createSwatch = (
  spec: ColorPickerComponentSpec,
  classSpec: ColorPickerComponentClassSpec
) => {
  const swatch = document.createElement("div");
  swatch.classList.add(classSpec.swatch);
  swatch.dataset.target = "swatch";

  return swatch;
};

export const createColorPickerComponent = (spec: ColorPickerComponentSpec) => {
  const { id } = spec;
  const classSpec = spec.classSpec || defaultClassSpec;
  const hexadecimalId = createSubId(id, "hexadecimal");
  const hueId = createSubId(id, "hue-slider");
  const hueInputId = createSubId(id, "hue");
  const saturationValueId = createSubId(id, "saturation-value");

  const colorPicker = createColorPicker(spec, classSpec);

  const hexadecimalTextField = createTextFieldComponent({
    classSpec: {
      ...defaultTextFieldClassSpec,
      input: concatItems(defaultTextFieldClassSpec.input, "width-100"),
      textField: concatItems(defaultTextFieldClassSpec.textField, "flex-grow"),
    },
    defaultValue: "000000",
    id: hexadecimalId,
    label: "Hexadecimal",
    name: "hexadecimal",
    ...spec.hexadecimalTextFieldSpec,
  });

  const hueSlider = createSliderComponent({
    classSpec: {
      input: "hue-slider__input",
      label: "hue-slider__label",
      slider: "hue-slider",
    },
    id: hueId,
    inputId: hueInputId,
    isLabelHidden: true,
    label: "Hue",
    max: 1,
    min: 0,
    name: "hue",
    step: 0.01,
    ...spec.hueSliderSpec,
  });

  const saturationValueSlider = createSlider2dComponent({
    classSpec: {
      ...defaultSlider2dClassSpec,
      field: "saturation-value__field",
    },
    id: saturationValueId,
    ...spec.saturationValueSliderSpec,
  });

  const swatch = createSwatch(spec, classSpec);
  const row = createRow(classSpec);

  row.appendChild(swatch);
  row.appendChild(hexadecimalTextField.textField);

  colorPicker.appendChild(hueSlider.slider);
  colorPicker.appendChild(saturationValueSlider.slider);
  colorPicker.appendChild(row);

  const component: ColorPickerComponent = {
    colorPicker,
    hexadecimalTextField,
    hueSlider,
    saturationValueSlider,
  };

  return component;
};
