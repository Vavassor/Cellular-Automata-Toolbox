import UnicodeProperties from "unicode-properties";

/**
 * @see {@link https://www.w3.org/TR/2017/CR-uievents-key-20170601/#keys-editing|Editing Keys}
 */
export enum EditingKey {
  Backspace = "Backspace",
  Clear = "Clear",
  Copy = "Copy",
  CrSel = "CrSel",
  Cut = "Cut",
  Delete = "Delete",
  EraseEof = "EraseEof",
  ExSel = "ExSel",
  Insert = "Insert",
  Paste = "Paste",
  Redo = "Redo",
  Undo = "Undo",
}

/**
 * @see {@link https://www.w3.org/TR/2017/CR-uievents-key-20170601/#keys-modifier|Modifer Keys}
 */
export enum ModifierKey {
  Alt = "Alt",
  AltGraph = "AltGraph",
  CapsLock = "CapsLock",
  Control = "Control",
  Fn = "Fn",
  FnLock = "FnLock",
  Meta = "Meta",
  NumLock = "NumLock",
  ScrollLock = "ScrollLock",
  Shift = "Shift",
  Symbol = "Symbol",
  SymbolLock = "SymbolLock",
}

/**
 * @see {@link https://www.w3.org/TR/2017/CR-uievents-key-20170601/#keys-navigation|Navigation Keys}
 */
export enum NavigationKey {
  ArrowDown = "ArrowDown",
  ArrowLeft = "ArrowLeft",
  ArrowRight = "ArrowRight",
  ArrowUp = "ArrowUp",
  End = "End",
  Home = "Home",
  PageDown = "PageDown",
  PageUp = "PageUp",
}

/**
 * @see {@link https://www.w3.org/TR/2017/CR-uievents-key-20170601/#keys-special|Special Keys}
 */
export enum SpecialKey {
  Unidentified = "Unidentified",
}

/**
 * @see {@link https://www.w3.org/TR/2017/CR-uievents-key-20170601/#keys-ui|UI Keys}
 */
export enum UiKey {
  Accept = "Accept",
  Again = "Again",
  Attn = "Attn",
  Cancel = "Cancel",
  ContextMenu = "ContextMenu",
  Escape = "Escape",
  Execute = "Execute",
  Find = "Find",
  Help = "Help",
  Pause = "Pause",
  Play = "Play",
  Props = "Props",
  Select = "Select",
  ZoomIn = "ZoomIn",
  ZoomOut = "ZoomOut",
}

/**
 * @see {@link https://www.w3.org/TR/2017/CR-uievents-key-20170601/#keys-whitespace|Whitespace Keys}
 */
export enum WhitespaceKey {
  Enter = "Enter",
  Tab = "Tab",
}

/**
 * @see {@link https://www.w3.org/TR/2017/CR-uievents-key-20170601/#named-key-attribute-values|Named key Attribute Values}
 */
export type NamedKey =
  | EditingKey
  | ModifierKey
  | NavigationKey
  | SpecialKey
  | UiKey
  | WhitespaceKey;

const isControlCode = (codepoint: number | undefined) => {
  return (
    typeof codepoint === "number" &&
    ((codepoint >= 0x00 && codepoint <= 0x1f) ||
      (codepoint >= 0x7f && codepoint <= 0x9f))
  );
};

const isCombiningCharacter = (codepoint: number) => {
  return (
    !!String.fromCodePoint(codepoint).match(
      /\p{General_Category=Spacing_Mark}/gu
    ) || UnicodeProperties.getCombiningClass(codepoint) !== "Not_Reordered"
  );
};

/**
 * Determine whether a key attribute value is a key string. Any value which
 * returns false is assumed to be a named key attribute value.
 *
 * @param value A valid {@link https://www.w3.org/TR/2017/CR-uievents-key-20170601/#key-attribute-value|key attribute value}.
 *
 * @see {@link https://www.w3.org/TR/2017/CR-uievents-key-20170601/#key-string|Key String}
 */
export const isKeyString = (value: string): boolean => {
  if (isControlCode(value.codePointAt(0))) {
    return false;
  }

  for (let i = 1; ; i++) {
    const codepoint = value.codePointAt(i);
    if (!codepoint) {
      break;
    }
    if (!isCombiningCharacter(codepoint)) {
      return false;
    }
  }

  return true;
};
