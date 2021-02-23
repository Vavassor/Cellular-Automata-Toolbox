import { Aabb2d, Point2d } from "./Geometry";

export interface NormalRandomState {
  hasSpare: boolean;
  spare: number;
}

export const createNormalRandomState = () => {
  const state: NormalRandomState = {
    hasSpare: false,
    spare: 0,
  };
  return state;
};

/**
 * Compute a standard normal random variable.
 *
 * This uses the Marsaglia polar method, which produces two variables each
 * generation. Because of this, only every other call generates new variables,
 * with the subsequent call returning the spare.
 */
export const getNormalRandom = (
  state: NormalRandomState,
  mean: number,
  standardDeviation: number
) => {
  if (state.hasSpare) {
    state.hasSpare = false;
    return state.spare * standardDeviation + mean;
  } else {
    let u, v, s;
    do {
      u = Math.random() * 2 - 1;
      v = Math.random() * 2 - 1;
      s = u * u + v * v;
    } while (s >= 1 || s == 0);
    s = Math.sqrt((-2.0 * Math.log(s)) / s);
    state.spare = v * s;
    state.hasSpare = true;
    return mean + standardDeviation * u * s;
  }
};

export const getNormalRandomWithoutOutliers = (
  state: NormalRandomState,
  mean: number,
  standardDeviation: number,
  standardDeviationLimit = 3
): number => {
  if (state.hasSpare) {
    state.hasSpare = false;
    return state.spare * standardDeviation + mean;
  } else {
    let u, v, s;
    do {
      u = Math.random() * 2 - 1;
      v = Math.random() * 2 - 1;
      s = u * u + v * v;
    } while (s >= 1 || s == 0);
    s = Math.sqrt((-2.0 * Math.log(s)) / s);
    const result = u * s;
    if (result < -standardDeviationLimit || result > standardDeviationLimit) {
      return getNormalRandomWithoutOutliers(state, mean, standardDeviation);
    }
    state.spare = v * s;
    state.hasSpare = true;
    return mean + standardDeviation * result;
  }
};

export const getRandomBoolean = () => {
  return Math.random() > 0.5;
};

export const getRandomFloat = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getRandomPoint2dInAabb2d = (aabb: Aabb2d): Point2d => {
  const { x: xMin, y: yMin } = aabb.bottomLeft;
  const { x: xMax, y: yMax } = aabb.topRight;
  const point = {
    x: getRandomInt(xMin, xMax),
    y: getRandomInt(yMin, yMax),
  };
  return point;
};
