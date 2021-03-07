import { createPopper, Instance } from "@popperjs/core";
import { createFocusTrap, FocusTrap } from "focus-trap";
import { UiKey, WhitespaceKey } from "../Key";

export interface DialogControllerSpec {
  button: HTMLElement;
  canDismissWithEnterKey?: boolean;
  dialog: HTMLElement;
}

type HandleKeyDown = (event: KeyboardEvent) => void;
type HandleMouseDown = (event: MouseEvent) => void;

export interface DialogController {
  button: HTMLElement;
  canDismissWithEnterKey: boolean;
  dialog: HTMLElement;
  focusTrap: FocusTrap;
  handleKeyDownDialog: HandleKeyDown | null;
  handleMouseDownDocument: HandleMouseDown | null;
  isOpen: boolean;
  popper: Instance;
}

const handleKeyDownDialog = (
  controller: DialogController,
  event: KeyboardEvent
) => {
  switch (event.key) {
    case WhitespaceKey.Enter: {
      if (controller.canDismissWithEnterKey) {
        event.preventDefault();
        dismissDialog(controller);
        controller.focusTrap.deactivate();
      }
      break;
    }

    case UiKey.Escape: {
      event.preventDefault();
      dismissDialog(controller);
      break;
    }
  }
};

const handleMouseDownDocument = (
  controller: DialogController,
  event: MouseEvent
) => {
  const target = event.target as Node | null;
  const { button, dialog } = controller;
  if (
    !button.contains(target) &&
    !dialog.contains(target) &&
    controller.isOpen
  ) {
    event.preventDefault();
    dismissDialog(controller);
    controller.focusTrap.deactivate();
  }
};

export const createDialogController = (spec: DialogControllerSpec) => {
  const { button, canDismissWithEnterKey, dialog } = spec;

  const focusTrap = createFocusTrap(dialog, {
    escapeDeactivates: true,
  });
  const popper = createPopper(button, dialog);

  const controller: DialogController = {
    button,
    canDismissWithEnterKey: !!canDismissWithEnterKey,
    dialog,
    focusTrap,
    handleKeyDownDialog: null,
    handleMouseDownDocument: null,
    isOpen: true,
    popper,
  };

  return controller;
};

export const dismissDialog = (controller: DialogController) => {
  const { handleKeyDownDialog, handleMouseDownDocument } = controller;

  controller.isOpen = false;

  if (handleMouseDownDocument) {
    document.removeEventListener("mousedown", handleMouseDownDocument);
    controller.handleMouseDownDocument = null;
  }
  if (handleKeyDownDialog) {
    controller.dialog.removeEventListener("keydown", handleKeyDownDialog);
    controller.handleKeyDownDialog = null;
  }

  controller.dialog.remove();
};

export const openDialog = (controller: DialogController) => {
  controller.isOpen = true;

  const keyDownListener = (event: KeyboardEvent) => {
    handleKeyDownDialog(controller, event);
  };
  controller.handleKeyDownDialog = keyDownListener;
  controller.dialog.addEventListener("keydown", keyDownListener);

  const mouseDownDocumentListener = (event: MouseEvent) => {
    handleMouseDownDocument(controller, event);
  };
  controller.handleMouseDownDocument = mouseDownDocumentListener;
  document.addEventListener("mousedown", mouseDownDocumentListener);

  controller.focusTrap.activate();
};
