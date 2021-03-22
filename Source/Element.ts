export const removeAllChildNodes = (parent: Element) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};
