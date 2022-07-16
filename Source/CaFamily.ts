export enum CaFamily {
  Cyclic = "Cyclic",
  Generation = "Generation",
  Lifelike = "Lifelike",
}

export const parseFamily = (value: string | null) => {
  if (!value) {
    return null;
  }

  value = value.trim();

  switch (value) {
    case "Cyclic":
      return CaFamily.Cyclic;
    case "Generation":
      return CaFamily.Generation;
    case "Lifelike":
      return CaFamily.Lifelike;
    default:
      return null;
  }
};
