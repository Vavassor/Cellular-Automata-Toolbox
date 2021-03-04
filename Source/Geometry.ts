import { clamp, linearRemap } from "./Math";

/** Axis-Aligned Bounding Box (AABB) */
export interface Aabb2d {
  bottomLeft: Point2d;
  topRight: Point2d;
}

export interface Circle {
  center: Point2d;
  radius: number;
}

export interface Point2d {
  x: number;
  y: number;
}

export interface Dimension2d {
  height: number;
  width: number;
}

export interface Vector2d {
  x: number;
  y: number;
}

export const point2dZero: Point2d = { x: 0, y: 0 };

export const clipBounds = (aabb: Aabb2d, bounds: Aabb2d): Aabb2d => {
  const bottomLeft: Point2d = {
    x: Math.max(aabb.bottomLeft.x, bounds.bottomLeft.x),
    y: Math.max(aabb.bottomLeft.y, bounds.bottomLeft.y),
  };
  const topRight: Point2d = {
    x: Math.min(aabb.topRight.x, bounds.topRight.x),
    y: Math.min(aabb.topRight.y, bounds.topRight.y),
  };
  const clippedAabb: Aabb2d = {
    bottomLeft,
    topRight,
  };
  return clippedAabb;
};

export const clampPoint2dToAabb2d = (point: Point2d, aabb: Aabb2d) => {
  const result: Point2d = {
    x: clamp(point.x, aabb.bottomLeft.x, aabb.topRight.x),
    y: clamp(point.y, aabb.bottomLeft.y, aabb.topRight.y),
  };
  return result;
};

export const copyPoint2d = (point: Point2d) => {
  const result: Point2d = {
    x: point.x,
    y: point.y,
  };
  return result;
};

export const getCircleBounds = (circle: Circle) => {
  const { center, radius } = circle;
  const radialVector: Vector2d = { x: radius, y: radius };
  const bounds: Aabb2d = {
    bottomLeft: point2dSubtract(center, radialVector),
    topRight: point2dAdd(center, radialVector),
  };
  return bounds;
};

export const getDimension2dFromVector2d = (vector: Vector2d): Dimension2d => {
  const dimension: Dimension2d = {
    height: vector.y,
    width: vector.x,
  };
  return dimension;
};

export const getVector2dFromDimension2d = (
  dimension: Dimension2d
): Vector2d => {
  const vector: Vector2d = {
    x: dimension.width,
    y: dimension.height,
  };
  return vector;
};

export const linearRemap2d = (
  startBounds: Aabb2d,
  endBounds: Aabb2d,
  value: Vector2d
) => {
  const point: Point2d = {
    x: linearRemap(
      startBounds.bottomLeft.x,
      startBounds.topRight.x,
      endBounds.bottomLeft.x,
      endBounds.topRight.x,
      value.x
    ),
    y: linearRemap(
      startBounds.topRight.y,
      startBounds.bottomLeft.y,
      endBounds.topRight.y,
      endBounds.bottomLeft.y,
      value.y
    ),
  };
  return point;
};

export const point2dAdd = (p: Point2d, v: Vector2d): Vector2d => {
  const result: Vector2d = {
    x: p.x + v.x,
    y: p.y + v.y,
  };
  return result;
};

export const point2dDistance = (a: Point2d, b: Point2d): number => {
  return getLength(point2dSubtract(a, b));
};

export const point2dSubtract = (a: Point2d, b: Point2d): Vector2d => {
  const result: Vector2d = {
    x: a.x - b.x,
    y: a.y - b.y,
  };
  return result;
};

export const getLength = (v: Vector2d) => {
  return Math.sqrt(getSquaredLength(v));
};

export const getSquaredLength = (v: Vector2d) => {
  return v.x * v.x + v.y * v.y;
};
