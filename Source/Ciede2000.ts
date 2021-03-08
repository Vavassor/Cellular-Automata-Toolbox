import { Lab } from "./Color";
import {
  getDegreesFromRadians as degrees,
  getRadiansFromDegrees as radians,
} from "./Math";

/**
 * Weighting factors used in calculating the CIE distance metric ΔE* in the
 * CIEDE2000 formula.
 */
export interface Ciede2000Weights {
  kc: number;
  kh: number;
  kl: number;
}

export const defaultCiede2000Weights: Ciede2000Weights = {
  kc: 1,
  kh: 1,
  kl: 1,
};

const { abs, atan2, cos, exp, sin, sqrt } = Math;

const getHp = (x: number, y: number) => {
  if (x === 0 && y === 0) {
    return 0;
  } else {
    const tmphp = degrees(atan2(x, y));
    return tmphp >= 0 ? tmphp : tmphp + 360;
  }
};

const getDhp = (c1: number, c2: number, h1p: number, h2p: number) => {
  if (c1 * c2 === 0) {
    return 0;
  } else if (abs(h2p - h1p) <= 180) {
    return h2p - h1p;
  } else if (h2p - h1p > 180) {
    return h2p - h1p - 360;
  } else if (h2p - h1p < -180) {
    return h2p - h1p + 360;
  } else {
    throw new Error();
  }
};

const getAHp = (c1: number, c2: number, h1p: number, h2p: number) => {
  if (c1 * c2 === 0) {
    return h1p + h2p;
  } else if (abs(h1p - h2p) <= 180) {
    return (h1p + h2p) / 2;
  } else if (abs(h1p - h2p) > 180 && h1p + h2p < 360) {
    return (h1p + h2p + 360) / 2;
  } else if (abs(h1p - h2p) > 180 && h1p + h2p >= 360) {
    return (h1p + h2p - 360) / 2;
  } else {
    throw new Error();
  }
};

const getRt = (aHp: number, aCp: number) => {
  const dRo = 30 * exp(-(((aHp - 275) / 25) ** 2));
  const rc = sqrt(aCp ** 7 / (aCp ** 7 + 25 ** 7));
  const rt = -2 * rc * sin(radians(2 * dRo));
  return rt;
};

/** CIE distance metric ΔE* using the CIEDE2000 formula. */
export const getCiede2000 = (
  labA: Lab,
  labB: Lab,
  weights: Ciede2000Weights = defaultCiede2000Weights
): number => {
  const { l: l1, a: a1, b: b1 } = labA;
  const { l: l2, a: a2, b: b2 } = labB;
  const { kc, kh, kl } = weights;

  const c1 = sqrt(a1 * a1 + b1 * b1);
  const c2 = sqrt(a2 * a2 + b2 * b2);

  const aC1C2 = (c1 + c2) / 2;

  const g = 0.5 * (1 - sqrt(aC1C2 ** 7 / (aC1C2 ** 7 + 25 ** 7)));

  const a1p = (1 + g) * a1;
  const a2p = (1 + g) * a2;

  const c1p = sqrt(a1p * a1p + b1 * b1);
  const c2p = sqrt(a2p * a2p + b2 * b2);

  const h1p = getHp(b1, a1p);
  const h2p = getHp(b2, a2p);

  const dLp = l2 - l1;
  const dCp = c2p - c1p;

  const dhp = getDhp(c1, c2, h1p, h2p);
  const dHp = 2 * sqrt(c1p * c2p) * sin(radians(dhp) / 2);

  const aL = (l1 + l2) / 2;
  const aCp = (c1p + c2p) / 2;
  const aHp = getAHp(c1, c2, h1p, h2p);

  const t =
    1 -
    0.17 * cos(radians(aHp - 30)) +
    0.24 * cos(radians(2 * aHp)) +
    0.32 * cos(radians(3 * aHp + 6)) -
    0.2 * cos(radians(4 * aHp - 63));

  const sl = 1 + (0.015 * (aL - 50) ** 2) / sqrt(20 + (aL - 50) ** 2);
  const sc = 1 + 0.045 * aCp;
  const sh = 1 + 0.015 * aCp * t;

  const rt = getRt(aHp, aCp);

  const dE = sqrt(
    (dLp / (sl * kl)) ** 2 +
      (dCp / (sc * kc)) ** 2 +
      (dHp / (sh * kh)) ** 2 +
      rt * (dCp / (sc * kc)) * (dHp / (sh * kh))
  );

  return dE;
};
