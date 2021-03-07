import { times } from "./Array";
import { isHexadecimal } from "./Ascii";
import { lerp } from "./Math";

export interface Color {
  a: number;
  b: number;
  g: number;
  r: number;
}

/** HSV (hue, saturation, value) color model */
export interface Hsv {
  h: number;
  s: number;
  v: number;
}

/** CIELAB color model */
export interface Lab {
  a: number;
  b: number;
  l: number;
}

/** RGB (red, green, blue) color model */
export interface Rgb {
  b: number;
  g: number;
  r: number;
}

/** CIE 1931 XYZ color model */
export interface Xyz {
  x: number;
  y: number;
  z: number;
}

export const rgbBlack: Rgb = { r: 0, g: 0, b: 0 };
export const rgbWhite: Rgb = { r: 1, g: 1, b: 1 };

/**
 * XYZ tristimulus values of standard illuminant D65 using the standard 2 degree
 * observer.
 */
export const referenceIlluminantD65Observer2Degree: Xyz = {
  x: 95.047,
  y: 100,
  z: 108.883,
};

export const getHsvFromRgb = (rgb: Rgb) => {
  const { r, g, b } = rgb;

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

export const getLabFromRgb = (
  rgb: Rgb,
  reference: Xyz = referenceIlluminantD65Observer2Degree
) => {
  const xyz = getXyzFromRgb(rgb);
  const lab = getLabFromXyz(xyz, reference);
  return lab;
};

export const getLabFromXyz = (
  xyz: Xyz,
  reference: Xyz = referenceIlluminantD65Observer2Degree
) => {
  let x = xyz.x / reference.x;
  let y = xyz.y / reference.y;
  let z = xyz.z / reference.z;

  if (x > 0.008856) {
    x = Math.pow(x, 1 / 3);
  } else {
    x = 7.787 * x + 16 / 116;
  }
  if (y > 0.008856) {
    y = Math.pow(y, 1 / 3);
  } else {
    y = 7.787 * y + 16 / 116;
  }
  if (z > 0.008856) {
    z = Math.pow(z, 1 / 3);
  } else {
    z = 7.787 * z + 16 / 116;
  }

  const lab: Lab = {
    l: 116 * y - 16,
    a: 500 * (x - y),
    b: 200 * (y - z),
  };

  return lab;
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

  const rgb: Rgb = { r, g, b };

  return rgb;
};

export const getRgbFromHexTriplet = (hexTriplet: string) => {
  const rgb: Rgb = {
    r: parseInt(hexTriplet.slice(0, 2), 16) / 255,
    g: parseInt(hexTriplet.slice(2, 4), 16) / 255,
    b: parseInt(hexTriplet.slice(4, 6), 16) / 255,
  };
  return rgb;
};

export const getRgbaFromRgb = (rgb: Rgb) => {
  const rgba: Color = { ...rgb, a: 1 };
  return rgba;
};

export const getHexTripletFromRgb = (rgb: Rgb) => {
  let r = packUbyte(rgb.r).toString(16);
  let g = packUbyte(rgb.g).toString(16);
  let b = packUbyte(rgb.b).toString(16);

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
  stopA: Rgb,
  stopB: Rgb,
  valueCount: number
) => {
  const colors = times(valueCount, (index) => {
    const t = index / (valueCount - 1);
    const rgb = lerpRgb(stopA, stopB, t);
    return getRgbaFromRgb(rgb);
  });
  return colors;
};

export const getXyzFromRgb = (rgb: Rgb) => {
  let { r, g, b } = rgb;

  if (r > 0.04045) {
    r = Math.pow((r + 0.055) / 1.055, 2.4);
  } else {
    r = r / 12.92;
  }
  if (g > 0.04045) {
    g = Math.pow((g + 0.055) / 1.055, 2.4);
  } else {
    g = g / 12.92;
  }
  if (b > 0.04045) {
    b = Math.pow((b + 0.055) / 1.055, 2.4);
  } else {
    b = b / 12.92;
  }

  r *= 100;
  g *= 100;
  b *= 100;

  const xyz: Xyz = {
    x: r * 0.4124 + g * 0.3576 + b * 0.1805,
    y: r * 0.2126 + g * 0.7152 + b * 0.0722,
    z: r * 0.0193 + g * 0.1192 + b * 0.9505,
  };

  return xyz;
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

export const lerpRgb = (v0: Rgb, v1: Rgb, t: number) => {
  const r = lerp(v0.r, v1.r, t);
  const g = lerp(v0.g, v1.g, t);
  const b = lerp(v0.b, v1.b, t);
  const rgb: Rgb = { r, g, b };
  return rgb;
};

export const packUbyte = (component: number) => {
  return Math.round(255 * component);
};

export const unpackUByte3 = (rgbInteger: number): Rgb => {
  const r = ((rgbInteger >> 16) & 0xff) / 255;
  const g = ((rgbInteger >> 8) & 0xff) / 255;
  const b = (rgbInteger & 0xff) / 255;
  const rgb: Rgb = { r, g, b };
  return rgb;
};

export const unpackUByte4 = (rgbaInteger: number): Color => {
  const r = ((rgbaInteger >> 24) & 0xff) / 255;
  const g = ((rgbaInteger >> 16) & 0xff) / 255;
  const b = ((rgbaInteger >> 8) & 0xff) / 255;
  const a = (rgbaInteger & 0xff) / 255;
  const color: Color = { r, g, b, a };
  return color;
};
