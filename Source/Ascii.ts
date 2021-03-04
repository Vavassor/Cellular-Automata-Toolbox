export const findChar = (value: string, isMatch: (char: string) => boolean) => {
  for (let i = 0; i < value.length; i++) {
    const char = value.charAt(i);
    if (isMatch(char)) {
      return char;
    }
  }
  return null;
};

export const isDigitChar = (char: string) => {
  return char >= "0" && char <= "9";
};

export const isHexadecimal = (value: string) => {
  const nonHexidecimalChar = findChar(
    value,
    (char) => !isHexadecimalChar(char)
  );
  return !nonHexidecimalChar;
};

export const isHexadecimalChar = (char: string) => {
  return (
    isDigitChar(char) ||
    (char >= "A" && char <= "F") ||
    (char >= "a" && char <= "f")
  );
};
