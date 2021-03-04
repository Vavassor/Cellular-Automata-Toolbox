interface InterpolationSpec {
  [key: string]: string;
}

export const interpolate = (key: string, options: InterpolationSpec) => {
  let result = "";
  for (let i = 0; i < key.length; i++) {
    const nextChar = key[i];
    switch (nextChar) {
      case "{":
        if (i + 1 === key.length) {
          result += nextChar;
        } else {
          const lookAhead = key[i + 1];
          if (lookAhead !== "{") {
            result += nextChar;
          } else {
            const parameterStartIndex = i + 2;
            const endBraceIndex = key.indexOf("}}", parameterStartIndex);
            if (endBraceIndex === -1) {
              throw new Error(
                "Invalid key. Parameter does not have closing braces."
              );
            }
            const parameter = key
              .slice(parameterStartIndex, endBraceIndex)
              .trim();
            result += options[parameter];
            i = endBraceIndex + 2;
          }
        }
        break;

      default:
        result += nextChar;
        break;
    }
  }
  return result;
};
