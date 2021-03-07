import { getCiede2000 } from "../Ciede2000";
import {
  getHexTripletFromRgb,
  getHsvFromRgb,
  getLabFromRgb,
  getRgbFromHexTriplet,
  getRgbFromHsv,
  getRgbHexString,
  Hsv,
  isHexTripletValid,
  Rgb,
  rgbBlack,
  rgbWhite,
} from "../Color";
import { createSubId } from "../Id";
import { roundToNearestMultiple } from "../Math";
import { getTargets, TargetMap } from "./Controller";
import {
  createSlider2dController,
  HandleChange as Slider2dHandleChange,
  Slider2dController,
} from "./Slider2dController";
import {
  createSliderController,
  focus as focusSliderController,
  HandleChange as SliderHandleChange,
  SliderController,
} from "./SliderController";
import {
  createTextFieldController,
  HandleFocusOutCapturing,
  TextFieldController,
} from "./TextFieldController";

interface ColorPickerTargets extends TargetMap {
  swatch: HTMLDivElement;
}

interface ChangeEvent {
  controller: ColorPickerController;
}

export type HandleChange = (event: ChangeEvent) => void;

export interface ColorPickerController {
  color: Rgb;
  handleChange: HandleChange | null;
  hexadecimalTextField: TextFieldController;
  hueSlider: SliderController;
  saturationValueSlider: Slider2dController;
  targets: ColorPickerTargets;
}

export interface ColorPickerControllerSpec {
  color?: Rgb;
  handleChange?: HandleChange;
  id: string;
}

const getHsv = (hue: number, saturationValueSlider: Slider2dController) => {
  const { position } = saturationValueSlider;
  const hsv: Hsv = { h: hue, s: position.x, v: position.y };
  return hsv;
};

const setFieldHue = (
  saturationValueSlider: Slider2dController,
  hue: number
) => {
  const saturationValueField = saturationValueSlider.targets.field;
  const rgb = getRgbFromHsv({ h: hue, s: 1, v: 1 });
  saturationValueField.style.backgroundColor = getRgbHexString(rgb);
};

const getHighContrastBorderColor = (color: Rgb) => {
  const lab = getLabFromRgb(color);
  return lab.l > 50 ? rgbBlack : rgbWhite;
};

const setThumbColor = (
  saturationValueSlider: Slider2dController,
  hue: number
) => {
  const { position } = saturationValueSlider;
  const { thumb } = saturationValueSlider.targets;
  const rgb = getRgbFromHsv({ h: hue, s: position.x, v: position.y });
  thumb.style.backgroundColor = getRgbHexString(rgb);
  thumb.style.borderColor = getRgbHexString(getHighContrastBorderColor(rgb));
};

const setSaturationValue = (
  saturationValueSlider: Slider2dController,
  hsv: Hsv
) => {
  const { position } = saturationValueSlider;
  const { s, v } = hsv;
  position.x = s;
  position.y = v;
};

const setHexadecimalTextField = (
  colorTextField: TextFieldController,
  hsv: Hsv
) => {
  const { input } = colorTextField.targets;
  const rgb = getRgbFromHsv(hsv);
  input.value = getHexTripletFromRgb(rgb);
};

const fireChangeEvent = (controller: ColorPickerController) => {
  const { handleChange } = controller;
  if (handleChange) {
    const event: ChangeEvent = {
      controller,
    };
    handleChange(event);
  }
};

const setSwatchColor = (controller: ColorPickerController) => {
  const { color } = controller;
  const { swatch } = controller.targets;
  swatch.style.backgroundColor = getRgbHexString(color);
};

const setRgbColor = (controller: ColorPickerController, rgb: Rgb) => {
  controller.color = rgb;
  setSwatchColor(controller);
  fireChangeEvent(controller);
};

const setHsvColor = (controller: ColorPickerController, hsv: Hsv) => {
  setRgbColor(controller, getRgbFromHsv(hsv));
};

const updateHsv = (controller: ColorPickerController) => {
  const color = controller.color;
  const { saturationValueSlider } = controller;
  const hsv = getHsvFromRgb(color);
  const hue = hsv.h;
  setSaturationValue(saturationValueSlider, hsv);
  setFieldHue(saturationValueSlider, hue);
  setThumbColor(saturationValueSlider, hue);
};

const initColor = (controller: ColorPickerController) => {
  setSwatchColor(controller);
  updateHsv(controller);
};

export const createColorPickerController = (
  spec: ColorPickerControllerSpec
) => {
  const { handleChange, id } = spec;
  const color = spec.color || rgbBlack;
  const colorHsv = getHsvFromRgb(color);
  const hexadecimalId = createSubId(id, "hexadecimal");
  const hueId = createSubId(id, "hue");
  const saturationValueId = createSubId(id, "saturation-value");

  let controller: ColorPickerController;
  let hexadecimalTextField: TextFieldController;
  let hueSlider: SliderController;
  let saturationValueSlider: Slider2dController;

  const handleChangeHue: SliderHandleChange = (event) => {
    const { input } = event.controller.targets;
    const hue = input.valueAsNumber;
    const hsv = getHsv(hue, saturationValueSlider);
    setFieldHue(saturationValueSlider, hue);
    setThumbColor(saturationValueSlider, hue);
    setHexadecimalTextField(hexadecimalTextField, hsv);
    setHsvColor(controller, hsv);
  };

  const handleChangeSaturationValue: Slider2dHandleChange = (event) => {
    const hue = hueSlider.targets.input.valueAsNumber;
    const hsv = getHsv(hue, saturationValueSlider);
    setThumbColor(event.controller, hue);
    setHexadecimalTextField(hexadecimalTextField, hsv);
    setHsvColor(controller, hsv);
  };

  const handleFocusOutCapturingColor: HandleFocusOutCapturing = (event) => {
    const { input } = event.controller.targets;
    const value = input.value;
    const paddedValue = value.padStart(6, "0");
    if (value.length > 0 && isHexTripletValid(paddedValue)) {
      setRgbColor(controller, getRgbFromHexTriplet(paddedValue));
      updateHsv(controller);
      input.value = paddedValue;
    } else {
      input.value = getHexTripletFromRgb(controller.color);
    }
  };

  hexadecimalTextField = createTextFieldController({
    id: hexadecimalId,
    handleFocusOutCapturing: handleFocusOutCapturingColor,
    value: getHexTripletFromRgb(color),
  });

  hueSlider = createSliderController({
    handleChange: handleChangeHue,
    id: hueId,
    value: colorHsv.h,
  });

  const step = 0.01;
  saturationValueSlider = createSlider2dController({
    axes: {
      horizontal: {
        initialValue: roundToNearestMultiple(colorHsv.s, step),
        max: 1,
        min: 0,
        skipStepMultiplier: 16,
        step,
      },
      vertical: {
        initialValue: roundToNearestMultiple(colorHsv.v, step),
        max: 1,
        min: 0,
        skipStepMultiplier: 16,
        step,
      },
    },
    handleChange: handleChangeSaturationValue,
    id: saturationValueId,
    thumbLabelKey: "saturation {{x}}, value {{y}}",
  });

  controller = {
    color,
    handleChange: handleChange ? handleChange : null,
    hexadecimalTextField,
    hueSlider,
    saturationValueSlider,
    targets: getTargets(id, ["swatch"]),
  };

  initColor(controller);

  return controller;
};

export const focus = (controller: ColorPickerController) => {
  focusSliderController(controller.hueSlider);
};
