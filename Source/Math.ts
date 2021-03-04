export const clamp = (x: number, min: number, max: number) => {
  return Math.min(Math.max(x, min), max);
};

export const lerp = (v0: number, v1: number, t: number) => {
  return (1 - t) * v0 + t * v1;
};

export const linearRemap = (
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  x: number
) => {
  return lerp(yMin, yMax, unlerp(xMin, xMax, x));
};

export const mod = (n: number, m: number) => {
  return ((n % m) + m) % m;
};

export const roundToNearestMultiple = (value: number, division: number) => {
  const d = 1 / (division === 0 ? 1 : division);
  return Math.round(value * d) / d;
};

/**
 * ╱╲    ╱╲    ╱╲    ╱
 * ┄┄╲┄┄╱┄┄╲┄┄╱┄┄╲┄┄╱┄
 *    ╲╱    ╲╱    ╲╱
 *
 * @param x the independent variable
 * @param p the period
 * @param a the amplitude
 */
export const triangleWave = (x: number, p: number, a: number) => {
  return ((4 * a) / p) * Math.abs(mod(x - p / 4, p) - p / 2) - a;
};

export const unlerp = (v0: number, v1: number, t: number) => {
  return (t - v0) / (v1 - v0);
};
