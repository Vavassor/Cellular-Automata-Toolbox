import { lerp } from "./Math";

export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export const unpackUByte4 = (rgbaInteger: number): Color => {
  const r = ((rgbaInteger >> 24) & 0xff) / 255;
  const g = ((rgbaInteger >> 16) & 0xff) / 255;
  const b = ((rgbaInteger >> 8) & 0xff) / 255;
  const a = (rgbaInteger & 0xff) / 255;
  const color: Color = { r, g, b, a };
  return color;
};

export const getTwoStopGradient = (
  v0: Color,
  v1: Color,
  valueCount: number
) => {
  let colors: Color[] = [];
  for (let i = 0; i < valueCount; i++) {
    colors[i] = lerpColor(v0, v1, i / (valueCount - 1));
  }
  return colors;
};

export const lerpColor = (v0: Color, v1: Color, t: number) => {
  const r = lerp(v0.r, v1.r, t);
  const g = lerp(v0.g, v1.g, t);
  const b = lerp(v0.b, v1.b, t);
  const a = lerp(v0.a, v1.a, t);
  const color: Color = { r, g, b, a };
  return color;
};
