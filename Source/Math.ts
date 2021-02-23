export const lerp = (v0: number, v1: number, t: number) => {
  return (1 - t) * v0 + t * v1;
};

export const mod = (n: number, m: number) => {
  return ((n % m) + m) % m;
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
