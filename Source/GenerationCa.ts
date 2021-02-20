import { BoundaryRule, getGridSampleFunction, Grid } from "./Grid";
import { HasName } from "./HasName";

export interface GenerationCaRule extends HasName {
  birthPattern: number[];
  boundaryRule: BoundaryRule;
  stateCount: number;
  survivalPattern: number[];
}

interface NamedRules {
  [key: string]: GenerationCaRule;
}

export const namedRules: NamedRules = {
  belZhab: {
    birthPattern: [2, 3],
    boundaryRule: BoundaryRule.Toroidal,
    name: "Bel Zhab",
    stateCount: 8,
    survivalPattern: [2, 3],
  },
  bombers: {
    birthPattern: [2, 4],
    boundaryRule: BoundaryRule.Toroidal,
    name: "Bombers",
    stateCount: 25,
    survivalPattern: [3, 4, 5],
  },
  faders: {
    birthPattern: [2],
    boundaryRule: BoundaryRule.Toroidal,
    name: "Faders",
    stateCount: 25,
    survivalPattern: [2],
  },
};

const matchPattern = (value: number, pattern: number[]) => {
  return pattern.find((count) => count === value);
};

export const updateGenerationCa = (grid: Grid, rule: GenerationCaRule) => {
  const nextCells: number[] = [];
  const gridSampleFunction = getGridSampleFunction(rule.boundaryRule);
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
        nextCells[cellIndex] = matchPattern(sum, rule.birthPattern) ? 1 : 0;
      } else if (state === 1) {
        nextCells[cellIndex] = matchPattern(sum, rule.survivalPattern) ? 1 : 2;
      } else {
        nextCells[cellIndex] = (state + 1) % rule.stateCount;
      }
    }
  }
  grid.cells = nextCells;
};
