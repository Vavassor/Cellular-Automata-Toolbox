import { Dimension2d, Point2d } from "./Geometry";
import { mod } from "./Math";
import { getRandomInt } from "./Random";

export enum BoundaryRule {
  Closed,
  Toroidal,
}

export enum FillType {
  UniformRandom,
  UniformRandomBinary,
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

const fill = (grid: Grid, fillFunction: GridFillFunction) => {
  const { height, width } = grid.dimension;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cellIndex = width * y + x;
      grid.cells[cellIndex] = fillFunction({ x, y });
    }
  }
};

const fillByType = (grid: Grid, fillType: FillType) => {
  switch (fillType) {
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
  const fillType = gridSpec.fillType || FillType.UniformRandom;

  const grid: Grid = {
    cells: [],
    dimension,
    stateCount,
  };

  fillByType(grid, fillType);

  return grid;
};

const sampleClosedBoundary: GridSampleFunction = (grid, x, y) => {
  const { height, width } = grid.dimension;
  const cellIndex = width * y + x;
  if (cellIndex >= 0 && cellIndex < width * height) {
    return grid.cells[cellIndex];
  }
  return null;
};

const sampleToroidalBoundary: GridSampleFunction = (grid, x, y) => {
  const { height, width } = grid.dimension;
  x = mod(x, width);
  y = mod(y, height);
  const cellIndex = width * y + x;
  return grid.cells[cellIndex];
};

export const getGridSampleFunction = (
  boundaryRule: BoundaryRule
): GridSampleFunction => {
  switch (boundaryRule) {
    case BoundaryRule.Closed:
      return sampleClosedBoundary;
    case BoundaryRule.Toroidal:
      return sampleToroidalBoundary;
  }
};
