import { getCssValueInPixels } from "../Css";
import {
  Aabb2d,
  clampPoint2dToAabb2d,
  copyPoint2d,
  Dimension2d,
  linearRemap2d,
  Point2d,
  point2dSubtract,
  point2dZero,
  Vector2d,
} from "../Geometry";
import { interpolate } from "../Interpolate";
import { NavigationKey } from "../Key";
import { clamp, linearRemap, roundToNearestMultiple } from "../Math";
import { getTargets, TargetMap } from "./Controller";

interface Slider2dTargets extends TargetMap {
  field: HTMLDivElement;
  thumb: HTMLDivElement;
  thumbLabel: HTMLSpanElement;
}

interface AxisSpec {
  initialValue: number;
  max: number;
  min: number;
  skipStepMultiplier: number;
  step: number;
}

interface AxesSpec {
  horizontal: AxisSpec;
  vertical: AxisSpec;
}

export interface ChangeEvent {
  controller: Slider2dController;
  priorValue: Point2d;
}

export type HandleChange = (event: ChangeEvent) => void;

export interface Slider2dControllerSpec {
  axes: AxesSpec;
  handleChange?: HandleChange;
  id: string;
  thumbLabelKey?: string;
}

type PointerEventHandler<T extends HTMLElement> = (
  this: T,
  ev: PointerEvent
) => any;

export interface Slider2dController {
  axesSpec: AxesSpec;
  handleChange: HandleChange | null;
  handlePointerMove: PointerEventHandler<HTMLDivElement> | null;
  position: Point2d;
  targets: Slider2dTargets;
  thumbLabelKey: string;
}

const defaultThumbLabelKey = "X {{x}}, Y {{y}}";

const fireChangeEvent = (
  controller: Slider2dController,
  priorValue: Point2d
) => {
  const { handleChange } = controller;
  if (handleChange) {
    const event: ChangeEvent = {
      controller,
      priorValue,
    };
    handleChange(event);
  }
};

const updateThumbLabel = (controller: Slider2dController) => {
  const { x, y } = controller.position;
  const { thumbLabel } = controller.targets;
  thumbLabel.textContent = interpolate(controller.thumbLabelKey, {
    x: x.toString(),
    y: y.toString(),
  });
};

const handleKeyDown = (
  controller: Slider2dController,
  event: KeyboardEvent
) => {
  const { axesSpec, position } = controller;
  const { horizontal, vertical } = axesSpec;
  const { field, thumb } = controller.targets;
  const fieldHeight = field.offsetHeight;
  const fieldWidth = field.offsetWidth;
  const isControlPressed = event.ctrlKey;
  const priorPosition = copyPoint2d(position);

  switch (event.key) {
    case NavigationKey.ArrowDown: {
      event.preventDefault();
      const step = isControlPressed
        ? vertical.skipStepMultiplier * vertical.step
        : vertical.step;
      position.y = Math.max(position.y - step, vertical.min);
      const bottom = linearRemap(
        vertical.min,
        vertical.max,
        0,
        fieldHeight,
        position.y
      );
      thumb.style.bottom = getCssValueInPixels(bottom);
      updateThumbLabel(controller);
      fireChangeEvent(controller, priorPosition);
      break;
    }

    case NavigationKey.ArrowLeft: {
      event.preventDefault();
      const step = isControlPressed
        ? horizontal.skipStepMultiplier * horizontal.step
        : horizontal.step;
      position.x = Math.max(position.x - step, horizontal.min);
      const left = linearRemap(
        horizontal.min,
        horizontal.max,
        0,
        fieldWidth,
        position.x
      );
      thumb.style.left = getCssValueInPixels(left);
      updateThumbLabel(controller);
      fireChangeEvent(controller, priorPosition);
      break;
    }

    case NavigationKey.ArrowRight: {
      event.preventDefault();
      const step = isControlPressed
        ? horizontal.skipStepMultiplier * horizontal.step
        : horizontal.step;
      position.x = Math.min(position.x + step, horizontal.max);
      const left = linearRemap(
        horizontal.min,
        horizontal.max,
        0,
        fieldWidth,
        position.x
      );
      thumb.style.left = getCssValueInPixels(left);
      updateThumbLabel(controller);
      fireChangeEvent(controller, priorPosition);
      break;
    }

    case NavigationKey.ArrowUp: {
      event.preventDefault();
      const step = isControlPressed
        ? vertical.skipStepMultiplier * vertical.step
        : vertical.step;
      position.y = Math.min(position.y + step, vertical.max);
      const bottom = linearRemap(
        vertical.min,
        vertical.max,
        0,
        fieldHeight,
        position.y
      );
      thumb.style.bottom = getCssValueInPixels(bottom);
      updateThumbLabel(controller);
      fireChangeEvent(controller, priorPosition);
      break;
    }

    case NavigationKey.End: {
      event.preventDefault();
      position.x = horizontal.max;
      thumb.style.left = getCssValueInPixels(fieldWidth);
      updateThumbLabel(controller);
      fireChangeEvent(controller, priorPosition);
      break;
    }

    case NavigationKey.Home: {
      event.preventDefault();
      position.x = horizontal.min;
      thumb.style.left = getCssValueInPixels(0);
      updateThumbLabel(controller);
      fireChangeEvent(controller, priorPosition);
      break;
    }

    case NavigationKey.PageDown: {
      event.preventDefault();
      position.y = vertical.min;
      thumb.style.bottom = getCssValueInPixels(0);
      updateThumbLabel(controller);
      fireChangeEvent(controller, priorPosition);
      break;
    }

    case NavigationKey.PageUp: {
      event.preventDefault();
      position.y = vertical.max;
      thumb.style.bottom = getCssValueInPixels(fieldHeight);
      updateThumbLabel(controller);
      fireChangeEvent(controller, priorPosition);
      break;
    }
  }
};

const clampVector2dByDimension = (offset: Vector2d, dimension: Dimension2d) => {
  const vector: Vector2d = {
    x: clamp(offset.x, 0, dimension.width),
    y: clamp(offset.y, 0, dimension.height),
  };
  return vector;
};

const roundToNearestStep2d = (value: Point2d, xStep: number, yStep: number) => {
  const point: Point2d = {
    x: roundToNearestMultiple(value.x, xStep),
    y: roundToNearestMultiple(value.y, yStep),
  };
  return point;
};

const getValueFromThumbOffset = (
  thumbOffset: Vector2d,
  fieldRect: DOMRect,
  axesSpec: AxesSpec
) => {
  const { horizontal, vertical } = axesSpec;
  const fieldBounds: Aabb2d = {
    bottomLeft: point2dZero,
    topRight: { x: fieldRect.width, y: fieldRect.height },
  };
  const valueBounds: Aabb2d = {
    bottomLeft: { x: horizontal.min, y: vertical.min },
    topRight: { x: horizontal.max, y: vertical.max },
  };
  const unrestrictedValue = linearRemap2d(
    fieldBounds,
    valueBounds,
    thumbOffset
  );
  const roundedValue = roundToNearestStep2d(
    unrestrictedValue,
    horizontal.step,
    vertical.step
  );
  const clampedValue = clampPoint2dToAabb2d(roundedValue, valueBounds);
  return clampedValue;
};

const getThumbOffset = (point: Point2d, fieldRect: DOMRect) => {
  const fieldBottomLeft: Point2d = { x: fieldRect.left, y: fieldRect.bottom };
  const fieldOffset = point2dSubtract(point, fieldBottomLeft);
  fieldOffset.y *= -1;
  const clampedFieldOffset = clampVector2dByDimension(fieldOffset, fieldRect);
  return clampedFieldOffset;
};

const getThumbOffsetFromValue = (
  controller: Slider2dController,
  value: Point2d
) => {
  const { field } = controller.targets;
  const { horizontal, vertical } = controller.axesSpec;
  const fieldRect = field.getBoundingClientRect();
  const fieldBounds: Aabb2d = {
    bottomLeft: point2dZero,
    topRight: { x: fieldRect.width, y: fieldRect.height },
  };
  const valueBounds: Aabb2d = {
    bottomLeft: { x: horizontal.min, y: vertical.min },
    topRight: { x: horizontal.max, y: vertical.max },
  };
  const thumbOffset = linearRemap2d(valueBounds, fieldBounds, value);
  return thumbOffset;
};

const setThumbPosition = (
  controller: Slider2dController,
  thumbOffset: Point2d
) => {
  const { thumb } = controller.targets;
  thumb.style.left = getCssValueInPixels(thumbOffset.x);
  thumb.style.bottom = getCssValueInPixels(thumbOffset.y);
};

const moveThumbToPoint = (controller: Slider2dController, point: Point2d) => {
  const { axesSpec, position } = controller;
  const { field } = controller.targets;
  const fieldRect = field.getBoundingClientRect();
  const thumbOffset = getThumbOffset(point, fieldRect);

  controller.position = getValueFromThumbOffset(
    thumbOffset,
    fieldRect,
    axesSpec
  );

  setThumbPosition(controller, thumbOffset);
  updateThumbLabel(controller);
  fireChangeEvent(controller, position);
};

const handlePointerMove = (
  controller: Slider2dController,
  event: PointerEvent
) => {
  event.preventDefault();
  const pointerPosition: Point2d = { x: event.clientX, y: event.clientY };
  moveThumbToPoint(controller, pointerPosition);
};

const startTrackingPointer = (controller: Slider2dController) => {
  const { field } = controller.targets;
  const pointerMoveListener = (event: PointerEvent) => {
    handlePointerMove(controller, event);
  };
  field.addEventListener("pointermove", pointerMoveListener);
  controller.handlePointerMove = pointerMoveListener;
};

const stopTrackingPointer = (controller: Slider2dController) => {
  const { field } = controller.targets;
  if (controller.handlePointerMove) {
    field.removeEventListener("pointermove", controller.handlePointerMove);
  }
  controller.handlePointerMove = null;
};

const handlePointerCancel = (
  controller: Slider2dController,
  event: PointerEvent
) => {
  stopTrackingPointer(controller);
};

const handlePointerDown = (
  controller: Slider2dController,
  event: PointerEvent
) => {
  event.preventDefault();

  const { field, thumb } = controller.targets;
  const pointerPosition: Point2d = { x: event.clientX, y: event.clientY };

  thumb.focus();
  field.setPointerCapture(event.pointerId);
  startTrackingPointer(controller);
  moveThumbToPoint(controller, pointerPosition);
};

const handlePointerUp = (
  controller: Slider2dController,
  event: PointerEvent
) => {
  stopTrackingPointer(controller);
};

const setPointerEventHandlers = (
  controller: Slider2dController,
  element: HTMLElement
) => {
  element.addEventListener("pointercancel", (event) => {
    handlePointerCancel(controller, event);
  });
  element.addEventListener("pointerdown", (event) => {
    handlePointerDown(controller, event);
  });
  element.addEventListener("pointerup", (event) => {
    handlePointerUp(controller, event);
  });
};

const initValue = (controller: Slider2dController) => {
  setThumbPosition(
    controller,
    getThumbOffsetFromValue(controller, controller.position)
  );
  updateThumbLabel(controller);
};

export const createSlider2dController = (spec: Slider2dControllerSpec) => {
  const { axes, id, handleChange } = spec;
  const { horizontal, vertical } = axes;

  const controller: Slider2dController = {
    axesSpec: axes,
    handleChange: handleChange ? handleChange : null,
    handlePointerMove: null,
    position: {
      x: horizontal.initialValue,
      y: vertical.initialValue,
    },
    targets: getTargets(id, ["field", "thumb", "thumbLabel"]),
    thumbLabelKey: spec.thumbLabelKey || defaultThumbLabelKey,
  };

  const { field, thumb } = controller.targets;
  thumb.addEventListener("keydown", (event) => {
    handleKeyDown(controller, event);
  });
  setPointerEventHandlers(controller, field);
  setPointerEventHandlers(controller, thumb);

  initValue(controller);

  return controller;
};

export const focus = (controller: Slider2dController) => {
  controller.targets.thumb.focus();
};

export const setValue = (controller: Slider2dController, value: Point2d) => {
  controller.position = value;
  initValue(controller);
};
