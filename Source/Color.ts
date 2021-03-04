import { isHexadecimal } from "./Ascii";
import { lerp } from "./Math";

export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface Hsv {
  h: number;
  s: number;
  v: number;
}

export const rgbBlack: Rgb = { r: 0, g: 0, b: 0 };

export const getHsvFromRgb = (rgb: Rgb) => {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = max;
  let s = max == 0 ? 0 : d / max;
  let v = max;

  if (max == min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  const hsv: Hsv = { h, s, v };

  return hsv;
};

export const getRgbFromHsv = (hsv: Hsv) => {
  const { h, s, v } = hsv;

  let r = 0;
  let g = 0;
  let b = 0;

  if (s == 0) {
    r = v;
    g = v;
    b = v;
  } else {
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;

      case 1:
        r = q;
        g = v;
        b = p;
        break;

      case 2:
        r = p;
        g = v;
        b = t;
        break;

      case 3:
        r = p;
        g = q;
        b = v;
        break;

      case 4:
        r = t;
        g = p;
        b = v;
        break;

      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }
  }

  const rgb: Rgb = {
    r: Math.round(255 * r),
    g: Math.round(255 * g),
    b: Math.round(255 * b),
  };

  return rgb;
};

export const getRgbFromHexTriplet = (hexTriplet: string) => {
  const rgb: Rgb = {
    r: parseInt(hexTriplet.slice(0, 2), 16),
    g: parseInt(hexTriplet.slice(2, 4), 16),
    b: parseInt(hexTriplet.slice(4, 6), 16),
  };
  return rgb;
};

export const getHexTripletFromRgb = (rgb: Rgb) => {
  let r = rgb.r.toString(16);
  let g = rgb.g.toString(16);
  let b = rgb.b.toString(16);

  if (r.length == 1) {
    r = "0" + r;
  }
  if (g.length == 1) {
    g = "0" + g;
  }
  if (b.length == 1) {
    b = "0" + b;
  }

  return r + g + b;
};

export const getRgbHexString = (rgb: Rgb) => {
  return "#" + getHexTripletFromRgb(rgb);
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

export const isHexTripletValid = (hexTriplet: string): boolean => {
  return hexTriplet.length == 6 && isHexadecimal(hexTriplet);
};

export const lerpColor = (v0: Color, v1: Color, t: number) => {
  const r = lerp(v0.r, v1.r, t);
  const g = lerp(v0.g, v1.g, t);
  const b = lerp(v0.b, v1.b, t);
  const a = lerp(v0.a, v1.a, t);
  const color: Color = { r, g, b, a };
  return color;
};

export const unpackUByte4 = (rgbaInteger: number): Color => {
  const r = ((rgbaInteger >> 24) & 0xff) / 255;
  const g = ((rgbaInteger >> 16) & 0xff) / 255;
  const b = ((rgbaInteger >> 8) & 0xff) / 255;
  const a = (rgbaInteger & 0xff) / 255;
  const color: Color = { r, g, b, a };
  return color;
};
