import { CaPreset } from "./CaPreset";
import { Point2d } from "./Geometry";
import {
  BoundaryRule,
  FillType,
  getGridSampleFunction,
  Grid,
  GridSampleFunction,
  SimulationOptions,
} from "./Grid";

export enum Neighborhood {
  Moore = "Moore",
  VonNeumann = "VonNeumann",
}

export interface CyclicCaRule {
  advanceThreshold: number;
  neighborhood: Neighborhood;
  neighborhoodRange: number;
  stateCount: number;
}

export type CyclicCaPreset = CyclicCaRule & CaPreset;

type NeighborSummationFunction = (
  grid: Grid,
  rule: CyclicCaRule,
  sample: GridSampleFunction,
  nextState: number,
  cellPosition: Point2d
) => number;

interface NamedRules {
  [key: string]: CyclicCaPreset;
}

export const emptyRule: CyclicCaRule = {
  advanceThreshold: 1,
  neighborhood: Neighborhood.Moore,
  neighborhoodRange: 1,
  stateCount: 2,
};

export const namedRules: NamedRules = {
  threeOneThree: {
    advanceThreshold: 3,
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.UniformRandom,
    name: "313",
    neighborhood: Neighborhood.Moore,
    neighborhoodRange: 1,
    stateCount: 3,
  },
  basic: {
    advanceThreshold: 1,
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.UniformRandom,
    name: "CCA",
    neighborhood: Neighborhood.VonNeumann,
    neighborhoodRange: 1,
    stateCount: 14,
  },
  imperfect: {
    advanceThreshold: 2,
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.UniformRandom,
    name: "Imperfect",
    neighborhood: Neighborhood.Moore,
    neighborhoodRange: 1,
    stateCount: 4,
  },
  squarishSpirals: {
    advanceThreshold: 2,
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.UniformRandom,
    name: "Squarish Spirals",
    neighborhood: Neighborhood.VonNeumann,
    neighborhoodRange: 2,
    stateCount: 6,
  },
};

const sumNeighborsMoore: NeighborSummationFunction = (
  grid,
  rule,
  sample,
  nextState,
  cellPosition
) => {
  let sum = 0;
  for (
    let kernelY = -rule.neighborhoodRange;
    kernelY <= rule.neighborhoodRange;
    kernelY++
  ) {
    for (
      let kernelX = -rule.neighborhoodRange;
      kernelX <= rule.neighborhoodRange;
      kernelX++
    ) {
      if (kernelX === 0 && kernelY === 0) {
        continue;
      }
      const x = cellPosition.x + kernelX;
      const y = cellPosition.y + kernelY;
      const result = sample(grid, x, y);
      sum += result === nextState ? 1 : 0;
    }
  }
  return sum;
};

const sumNeighborsVonNeumann: NeighborSummationFunction = (
  grid,
  rule,
  sample,
  nextState,
  cellPosition
) => {
  let sum = 0;

  const addSample = (kernelX: number, kernelY: number) => {
    const x = cellPosition.x + kernelX;
    const y = cellPosition.y + kernelY;
    const result = sample(grid, x, y);
    sum += result === nextState ? 1 : 0;
  };

  // Sum the top half of the diamond.
  for (let rangeX = 0; rangeX < rule.neighborhoodRange; rangeX++) {
    const kernelY = -rule.neighborhoodRange + rangeX;
    for (let kernelX = -rangeX; kernelX <= rangeX; kernelX++) {
      addSample(kernelX, kernelY);
    }
  }

  // Sum the middle row of the diamond, excluding the center.
  for (let kernelX = -rule.neighborhoodRange; kernelX < 0; kernelX++) {
    addSample(kernelX, 0);
  }
  for (let kernelX = 1; kernelX <= rule.neighborhoodRange; kernelX++) {
    addSample(kernelX, 0);
  }

  // Sum the bottom half of the diamond.
  for (let rangeX = rule.neighborhoodRange - 1; rangeX >= 0; rangeX--) {
    const kernelY = rule.neighborhoodRange - rangeX;
    for (let kernelX = -rangeX; kernelX <= rangeX; kernelX++) {
      addSample(kernelX, kernelY);
    }
  }

  return sum;
};

const getNeighborSummationFunction = (neighborhood: Neighborhood) => {
  switch (neighborhood) {
    case Neighborhood.Moore:
      return sumNeighborsMoore;
    case Neighborhood.VonNeumann:
      return sumNeighborsVonNeumann;
  }
};

export const copyCyclicCaRule = (rule: CyclicCaRule) => {
  return Object.assign({}, rule);
};

export const parseNeighborhood = (neighborhoodString: string) => {
  switch (neighborhoodString) {
    default:
    case "Moore":
      return Neighborhood.Moore;
    case "VonNeumann":
      return Neighborhood.VonNeumann;
  }
};

export const updateCyclicCa = (
  grid: Grid,
  rule: CyclicCaRule,
  simulationOptions: SimulationOptions
) => {
  const nextCells: number[] = [];
  const sample = getGridSampleFunction(simulationOptions.boundaryRule);
  const sumNeighbors = getNeighborSummationFunction(rule.neighborhood);
  const { height, width } = grid.dimension;
  for (let cellY = 0; cellY < height; cellY++) {
    for (let cellX = 0; cellX < width; cellX++) {
      const cellIndex = width * cellY + cellX;
      const state = grid.cells[cellIndex];
      const nextState = (state + 1) % rule.stateCount;
      const sum = sumNeighbors(grid, rule, sample, nextState, {
        x: cellX,
        y: cellY,
      });
      nextCells[cellIndex] = sum >= rule.advanceThreshold ? nextState : state;
    }
  }
  grid.cells = nextCells;
};
