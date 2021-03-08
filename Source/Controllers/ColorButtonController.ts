import { getRgbHexString, Rgb, rgbBlack } from "../Color";
import {
  ColorPickerComponent,
  createColorPickerComponent,
} from "../Components/ColorPickerComponent";
import {
  createColorPickerController,
  HandleChange as HandleChangeColorPicker,
} from "../Controllers/ColorPickerController";
import { createSubId } from "../Id";
import {
  ButtonController,
  ButtonControllerSpec,
  createButtonController,
  HandleClickButton,
} from "./ButtonController";
import { getTargets, TargetMap } from "./Controller";
import {
  createDialogController,
  DialogController,
  openDialog,
} from "./DialogController";

interface ColorButtonTargets extends TargetMap {
  swatch: HTMLDivElement;
}

interface ChangeEvent {
  controller: ColorButtonController;
}

export type HandleChange = (event: ChangeEvent) => void;

export interface ColorButtonControllerSpec {
  buttonSpec?: ButtonControllerSpec;
  color?: Rgb;
  handleChange?: HandleChange;
  id: string;
}

export interface ColorButtonController {
  button: ButtonController;
  color: Rgb;
  dialog: DialogController | null;
  handleChange: HandleChange | null;
  targets: ColorButtonTargets;
}

const createColorPicker = (
  colorPickerId: string,
  color: Rgb,
  mount: HTMLButtonElement,
  colorButtonController: ColorButtonController
) => {
  const component = createColorPickerComponent({
    id: colorPickerId,
  });

  mount.insertAdjacentElement("afterend", component.colorPicker);

  const handleChange: HandleChangeColorPicker = (event) => {
    const { controller } = event;
    setColor(colorButtonController, controller.color);
  };

  const controller = createColorPickerController({
    color,
    handleChange,
    id: colorPickerId,
  });

  return { component, controller };
};

const createDialog = (
  colorButton: HTMLButtonElement,
  colorPickerComponent: ColorPickerComponent
) => {
  const dialogController = createDialogController({
    button: colorButton,
    canDismissWithEnterKey: true,
    dialog: colorPickerComponent.colorPicker,
  });
  openDialog(dialogController);

  return dialogController;
};

const fireChangeEvent = (controller: ColorButtonController) => {
  const { handleChange } = controller;
  if (handleChange) {
    const event: ChangeEvent = {
      controller,
    };
    handleChange(event);
  }
};

const setColorWithoutChange = (
  controller: ColorButtonController,
  color: Rgb
) => {
  const { swatch } = controller.targets;
  swatch.style.backgroundColor = getRgbHexString(color);
};

export const createColorButtonController = (
  spec: ColorButtonControllerSpec
) => {
  const { buttonSpec, handleChange, id } = spec;
  const color = spec.color || rgbBlack;
  const colorPickerId = createSubId(id, "color-picker");

  let controller: ColorButtonController;
  let dialog: DialogController | null;
  let buttonController: ButtonController;

  const handleClick: HandleClickButton = (event) => {
    const { controller: buttonController } = event;
    if (!dialog || !dialog.isOpen) {
      const colorButton = buttonController.targets.button;
      const colorPicker = createColorPicker(
        colorPickerId,
        controller.color,
        colorButton,
        controller
      );
      dialog = createDialog(colorButton, colorPicker.component);
    }
  };

  buttonController = createButtonController({
    handleClick,
    id,
    ...buttonSpec,
  });

  controller = {
    button: buttonController,
    color,
    dialog: null,
    handleChange: handleChange ? handleChange : null,
    targets: getTargets(id, ["swatch"]),
  };

  setColorWithoutChange(controller, color);

  return controller;
};

export const setColor = (controller: ColorButtonController, color: Rgb) => {
  setColorWithoutChange(controller, color);
  controller.color = color;
  fireChangeEvent(controller);
};
