export const getChildById = (parent: Element, id: string) => {
  return parent.querySelector(`#${id}`);
};

export const removeAllChildNodes = (parent: Element) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};
