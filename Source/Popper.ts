import { createPopper, Instance, Options } from "@popperjs/core";

export interface PopperController {
  instance: Instance;
}

export interface PopperControllerSpec {
  element: HTMLElement;
  options?: Options;
  reference: Element;
}

export const createPopperController = (
  spec: PopperControllerSpec
): PopperController => {
  const { element, options, reference } = spec;

  const instance = createPopper(reference, element, options);

  const controller: PopperController = {
    instance,
  };

  return controller;
};
