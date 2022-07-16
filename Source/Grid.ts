import { times } from "./Array";
import {
  Aabb2d,
  Circle,
  clipBounds,
  Dimension2d,
  getCircleBounds,
  getSquaredLength,
  Point2d,
  point2dSubtract,
  point2dZero,
} from "./Geometry";
import { mod } from "./Math";
import {
  createNormalRandomState,
  getNormalRandom,
  getRandomInt,
  getRandomPoint2dInAabb2d,
} from "./Random";

export enum BoundaryRule {
  Clip,
  MirrorWrap,
  Wrap,
}

export enum FillType {
  Splats,
  SplatsBinary,
  UniformRandom,
  UniformRandomBinary,
}

export interface SimulationOptions {
  boundaryRule: BoundaryRule;
}

export interface Grid {
  cells: number[];
  dimension: Dimension2d;
  stateCount: number;
}

interface GridSpec {
  dimension: Dimension2d;
  fillType?: FillType;
  stateCount: number;
}

type GridFillFunction = (position: Point2d) => number;

export type GridSampleFunction = (
  grid: Grid,
  x: number,
  y: number
) => number | null;

type GetState = () => number;

interface SplatSpec {
  dropRadius: number;
  dropsPerSplat: number;
  getState: GetState;
  splatCount: number;
  splatSpread: number;
}

const fill = (grid: Grid, fillFunction: GridFillFunction) => {
  const { height, width } = grid.dimension;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cellIndex = width * y + x;
      grid.cells[cellIndex] = fillFunction({ x, y });
    }
  }
};

const getGridBounds = (grid: Grid): Aabb2d => {
  const { height, width } = grid.dimension;
  const bounds: Aabb2d = {
    bottomLeft: point2dZero,
    topRight: {
      x: width - 1,
      y: height - 1,
    },
  };
  return bounds;
};

const getRandomPoint2dInGrid = (grid: Grid) => {
  const bounds = getGridBounds(grid);
  const point = getRandomPoint2dInAabb2d(bounds);
  return point;
};

const drawUniformRandomCircle = (
  grid: Grid,
  circle: Circle,
  getState: GetState
) => {
  const { center: circleCenter, radius } = circle;
  const squaredRadius = radius * radius;

  const gridBounds = getGridBounds(grid);
  const circleBounds = getCircleBounds(circle);
  const clippedCircleBounds = clipBounds(circleBounds, gridBounds);
  const { bottomLeft, topRight } = clippedCircleBounds;

  for (let y = bottomLeft.y; y < topRight.y; y++) {
    for (let x = bottomLeft.x; x < topRight.x; x++) {
      const cellPosition: Point2d = { x, y };
      const squaredDistance = getSquaredLength(
        point2dSubtract(circleCenter, cellPosition)
      );
      if (squaredDistance <= squaredRadius) {
        const state = getState();
        const cellIndex = grid.dimension.width * y + x;
        grid.cells[cellIndex] = state;
      }
    }
  }
};

const drawSplats = (grid: Grid, spec: SplatSpec) => {
  const { dropRadius, dropsPerSplat, getState, splatCount, splatSpread } = spec;
  const normalRandomState = createNormalRandomState();
  const splatCenters = times(splatCount, () => getRandomPoint2dInGrid(grid));

  splatCenters.forEach((splatCenter) => {
    const { x: splatX, y: splatY } = splatCenter;
    times(dropsPerSplat, () => {
      const dropCenter = {
        x: Math.floor(getNormalRandom(normalRandomState, splatX, splatSpread)),
        y: Math.floor(getNormalRandom(normalRandomState, splatY, splatSpread)),
      };
      const circle: Circle = {
        center: dropCenter,
        radius: dropRadius,
      };
      drawUniformRandomCircle(grid, circle, getState);
    });
  });
};

const fillByType = (grid: Grid, fillType: FillType) => {
  switch (fillType) {
    case FillType.Splats:
      fill(grid, () => 0);
      drawSplats(grid, {
        dropRadius: 4,
        dropsPerSplat: 50,
        getState: () => getRandomInt(0, grid.stateCount - 1),
        splatCount: 10,
        splatSpread: 12,
      });
      break;

    case FillType.SplatsBinary:
      fill(grid, () => 0);
      drawSplats(grid, {
        dropRadius: 4,
        dropsPerSplat: 50,
        getState: () => getRandomInt(0, 1),
        splatCount: 10,
        splatSpread: 12,
      });
      break;

    case FillType.UniformRandom:
      fill(grid, () => getRandomInt(0, grid.stateCount - 1));
      break;

    case FillType.UniformRandomBinary:
      fill(grid, () => getRandomInt(0, 1));
      break;
  }
};

export const createGrid = (gridSpec: GridSpec) => {
  const { dimension, stateCount } = gridSpec;
  const fillType =
    gridSpec.fillType !== undefined
      ? gridSpec.fillType
      : FillType.UniformRandom;

  const grid: Grid = {
    cells: [],
    dimension,
    stateCount,
  };

  fillByType(grid, fillType);

  return grid;
};

const sampleClip: GridSampleFunction = (grid, x, y) => {
  const { height, width } = grid.dimension;
  const cellIndex = width * y + x;
  if (cellIndex >= 0 && cellIndex < width * height) {
    return grid.cells[cellIndex];
  }
  return null;
};

const mirror = (x: number, width: number) => {
  const parity = Math.abs(Math.floor(x / width)) & 1;
  return parity === 0 ? mod(x, width) : mod(width - x - 1, width);
};

const sampleMirrorWrap: GridSampleFunction = (grid, x, y) => {
  const { height, width } = grid.dimension;
  x = mirror(x, width);
  y = mirror(y, height);
  const cellIndex = width * y + x;
  return grid.cells[cellIndex];
};

const sampleWrap: GridSampleFunction = (grid, x, y) => {
  const { height, width } = grid.dimension;
  x = mod(x, width);
  y = mod(y, height);
  const cellIndex = width * y + x;
  return grid.cells[cellIndex];
};

export const getBoundaryRuleAsString = (boundaryRule: BoundaryRule) => {
  switch (boundaryRule) {
    case BoundaryRule.Clip:
      return "Clip";
    case BoundaryRule.MirrorWrap:
      return "MirrorWrap";
    case BoundaryRule.Wrap:
      return "Wrap";
  }
}

export const getFillTypeAsString = (fillType: FillType) => {
  switch (fillType) {
    case FillType.Splats:
      return "Splats";
    case FillType.SplatsBinary:
      return "SplatsBinary";
    case FillType.UniformRandom:
      return "UniformRandom";
    case FillType.UniformRandomBinary:
      return "UniformRandomBinary";
  }
}

export const getGridSampleFunction = (
  boundaryRule: BoundaryRule
): GridSampleFunction => {
  switch (boundaryRule) {
    case BoundaryRule.Clip:
      return sampleClip;
    case BoundaryRule.MirrorWrap:
      return sampleMirrorWrap;
    case BoundaryRule.Wrap:
      return sampleWrap;
  }
};

export const parseBoundaryRule = (value: string | null) => {
  if (!value) {
    return null;
  }

  value = value.trim();

  switch (value) {
    case "Clip":
      return BoundaryRule.Clip;
    case "MirrorWrap":
      return BoundaryRule.MirrorWrap;
    case "Wrap":
      return BoundaryRule.Wrap; 
    default:
      return null;
  }
}

export const parseFillType = (value: string | null) => {
  if (!value) {
    return null;
  }

  value = value.trim();

  switch (value) {
    case "Splats":
      return FillType.Splats;
    case "SplatsBinary":
      return FillType.SplatsBinary;
    case "UniformRandom":
      return FillType.UniformRandom; 
    case "UniformRandomBinary":
      return FillType.UniformRandomBinary;
    default:
      return null;
  }
}
