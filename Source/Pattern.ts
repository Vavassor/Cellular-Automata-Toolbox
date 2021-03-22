import * as ArrayUtilities from "./Array";

const addAscendingOrder = (array: number[], addValue: number) => {
  const firstLargerIndex = array.findIndex((value) => value > addValue);
  if (firstLargerIndex === -1) {
    return array.concat(addValue);
  } else {
    return ArrayUtilities.add(array, addValue, firstLargerIndex);
  }
};

export const updatePattern = (
  pattern: number[],
  value: number,
  isChecked: boolean
) => {
  const foundIndex = pattern.indexOf(value);
  if (foundIndex === -1) {
    if (isChecked) {
      return addAscendingOrder(pattern, value);
    } else {
      return pattern;
    }
  } else {
    if (isChecked) {
      return pattern;
    } else {
      return ArrayUtilities.remove(pattern, foundIndex);
    }
  }
};
