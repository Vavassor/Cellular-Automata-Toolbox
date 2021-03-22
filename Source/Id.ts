export const createSubId = (id: string, suffix: string) => {
  return `${id}-${suffix}`;
};

export const joinIds = (...idParts: string[]) => {
  return idParts.join("-");
};
