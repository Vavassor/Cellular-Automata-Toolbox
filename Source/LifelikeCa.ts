import { BoundaryRule, getGridSampleFunction, Grid } from "./Grid";
import { HasName } from "./HasName";

export interface LifelikeCaRule extends HasName {
  birthPattern: number[];
  boundaryRule: BoundaryRule;
  survivalPattern: number[];
}

interface NamedRules {
  [key: string]: LifelikeCaRule;
}

export const namedRules: NamedRules = {
  gameOfLife: {
    birthPattern: [3],
    boundaryRule: BoundaryRule.Toroidal,
    name: "Game Of Life",
    survivalPattern: [2, 3],
  },
};

const matchPattern = (value: number, pattern: number[]) => {
  return pattern.find((count) => count === value);
};

export const updateLifelikeCa = (grid: Grid, rule: LifelikeCaRule) => {
  const { height, width } = grid.dimension;
  const gridSampleFunction = getGridSampleFunction(rule.boundaryRule);
  const sample = (grid: Grid, x: number, y: number) => {
    const value = gridSampleFunction(grid, x, y);
    return value === null ? 0 : value;
  };
  const nextCells = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cellIndex = width * y + x;
      const center = grid.cells[cellIndex];
      let sum = 0;
      sum += sample(grid, x - 1, y - 1);
      sum += sample(grid, x, y - 1);
      sum += sample(grid, x + 1, y - 1);
      sum += sample(grid, x - 1, y);
      sum += sample(grid, x + 1, y);
      sum += sample(grid, x - 1, y + 1);
      sum += sample(grid, x, y + 1);
      sum += sample(grid, x + 1, y + 1);
      const pattern = center > 0 ? rule.survivalPattern : rule.birthPattern;
      nextCells[cellIndex] = matchPattern(sum, pattern) ? 1 : 0;
    }
  }
  grid.cells = nextCells;
};
