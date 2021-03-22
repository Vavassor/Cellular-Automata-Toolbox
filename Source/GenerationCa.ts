import { CaPreset } from "./CaPreset";
import {
  BoundaryRule,
  FillType,
  getGridSampleFunction,
  Grid,
  SimulationOptions,
} from "./Grid";

export interface GenerationCaRule {
  birthPattern: number[];
  stateCount: number;
  survivalPattern: number[];
}

export type GenerationCaPreset = GenerationCaRule & CaPreset;

interface NamedRules {
  [key: string]: GenerationCaPreset;
}

export const emptyRule: GenerationCaRule = {
  birthPattern: [],
  stateCount: 3,
  survivalPattern: [],
};

export const namedRules: NamedRules = {
  banners: {
    birthPattern: [3, 4, 5, 7],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.UniformRandomBinary,
    name: "Banners",
    stateCount: 5,
    survivalPattern: [2, 3, 6, 7],
  },
  belZhab: {
    birthPattern: [2, 3],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.SplatsBinary,
    name: "Bel Zhab",
    stateCount: 8,
    survivalPattern: [2, 3],
  },
  bloomerang: {
    birthPattern: [3, 4, 6, 7, 8],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.SplatsBinary,
    name: "Bloomerang",
    stateCount: 24,
    survivalPattern: [2, 3, 4],
  },
  bombers: {
    birthPattern: [2, 4],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.UniformRandomBinary,
    name: "Bombers",
    stateCount: 25,
    survivalPattern: [3, 4, 5],
  },
  briansBrain: {
    birthPattern: [2],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.UniformRandomBinary,
    name: "Brian's Brain",
    stateCount: 3,
    survivalPattern: [],
  },
  burst: {
    birthPattern: [3, 4, 6, 8],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.UniformRandomBinary,
    name: "Burst",
    stateCount: 9,
    survivalPattern: [0, 2, 3, 5, 6, 7, 8],
  },
  caterpillars: {
    birthPattern: [3, 7, 8],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.SplatsBinary,
    name: "Caterpillars",
    stateCount: 4,
    survivalPattern: [1, 2, 4, 5, 6, 7],
  },
  circuitGenesis: {
    birthPattern: [1, 2, 3, 4],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.SplatsBinary,
    name: "Circuit Genesis",
    stateCount: 8,
    survivalPattern: [2, 3, 4, 5],
  },
  cooties: {
    birthPattern: [2],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.SplatsBinary,
    name: "Cooties",
    stateCount: 8,
    survivalPattern: [2, 3],
  },
  faders: {
    birthPattern: [2],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.UniformRandomBinary,
    name: "Faders",
    stateCount: 25,
    survivalPattern: [2],
  },
  glissergy: {
    birthPattern: [2, 4, 5, 6, 7, 8],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.UniformRandomBinary,
    name: "Glissergy",
    stateCount: 5,
    survivalPattern: [0, 3, 5, 6, 7, 8],
  },
  sticks: {
    birthPattern: [2],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.SplatsBinary,
    name: "Sticks",
    stateCount: 6,
    survivalPattern: [3, 4, 5, 6],
  },
  worms: {
    birthPattern: [2, 5],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.UniformRandomBinary,
    name: "Worms",
    stateCount: 6,
    survivalPattern: [3, 4, 6, 7],
  },
};

export const copyGenerationCaRule = (rule: GenerationCaRule) => {
  const copy: GenerationCaRule = {
    birthPattern: Array.from(rule.birthPattern),
    stateCount: rule.stateCount,
    survivalPattern: Array.from(rule.survivalPattern),
  };
  return copy;
};

export const updateGenerationCa = (
  grid: Grid,
  rule: GenerationCaRule,
  simulationOptions: SimulationOptions
) => {
  const nextCells: number[] = [];
  const gridSampleFunction = getGridSampleFunction(
    simulationOptions.boundaryRule
  );
  const sampleAlive = (grid: Grid, x: number, y: number) => {
    const value = gridSampleFunction(grid, x, y);
    return value === 1 ? 1 : 0;
  };
  const { height, width } = grid.dimension;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cellIndex = width * y + x;
      const state = grid.cells[cellIndex];
      let sum = 0;
      sum += sampleAlive(grid, x - 1, y - 1);
      sum += sampleAlive(grid, x, y - 1);
      sum += sampleAlive(grid, x + 1, y - 1);
      sum += sampleAlive(grid, x - 1, y);
      sum += sampleAlive(grid, x + 1, y);
      sum += sampleAlive(grid, x - 1, y + 1);
      sum += sampleAlive(grid, x, y + 1);
      sum += sampleAlive(grid, x + 1, y + 1);
      if (state === 0) {
        nextCells[cellIndex] = rule.birthPattern.includes(sum) ? 1 : 0;
      } else if (state === 1) {
        nextCells[cellIndex] = rule.survivalPattern.includes(sum) ? 1 : 2;
      } else {
        nextCells[cellIndex] = (state + 1) % rule.stateCount;
      }
    }
  }
  grid.cells = nextCells;
};
