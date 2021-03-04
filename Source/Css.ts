export const addClasses = (
  element: HTMLElement,
  classOrArray: string | string[]
) => {
  if (typeof classOrArray === "string") {
    element.classList.add(classOrArray);
  } else {
    classOrArray.forEach((className) => element.classList.add(className));
  }
};

export const getCssValueInPixels = (value: number) => {
  return `${value}px`;
};

export const joinClasses = (
  ...classNames: (string | null | undefined | false)[]
): string => {
  return classNames
    .filter((className): className is string => !!className)
    .join(" ");
};
