import { CaRuleBase } from "./CaRule";
import { BoundaryRule, FillType, getGridSampleFunction, Grid } from "./Grid";

export interface LifelikeCaRule extends CaRuleBase {
  birthPattern: number[];
  boundaryRule: BoundaryRule;
  survivalPattern: number[];
}

interface NamedRules {
  [key: string]: LifelikeCaRule;
}

export const namedRules: NamedRules = {
  assimilation: {
    birthPattern: [3, 4, 5],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.SplatsBinary,
    name: "Assimilation",
    survivalPattern: [4, 5, 6, 7],
  },
  bugs: {
    birthPattern: [3, 5, 6, 7],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.SplatsBinary,
    name: "Bugs",
    survivalPattern: [1, 5, 6, 7, 8],
  },
  coral: {
    birthPattern: [3],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.UniformRandomBinary,
    name: "Coral",
    survivalPattern: [4, 5, 6, 7, 8],
  },
  dayAndNight: {
    birthPattern: [3, 6, 7, 8],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.UniformRandomBinary,
    name: "Day and Night",
    survivalPattern: [3, 4, 6, 7, 8],
  },
  diamoeba: {
    birthPattern: [3, 5, 6, 7, 8],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.UniformRandomBinary,
    name: "Diamoeba",
    survivalPattern: [5, 6, 7, 8],
  },
  electrifiedMaze: {
    birthPattern: [4, 5],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.SplatsBinary,
    name: "Electrified Maze",
    survivalPattern: [1, 2, 3, 4, 5],
  },
  flakes: {
    birthPattern: [3],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.SplatsBinary,
    name: "Flakes",
    survivalPattern: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  },
  gameOfLife: {
    birthPattern: [3],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.UniformRandomBinary,
    name: "Game Of Life",
    survivalPattern: [2, 3],
  },
  gems: {
    birthPattern: [3, 4, 5, 7],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.SplatsBinary,
    name: "Gems",
    survivalPattern: [4, 5, 6, 8],
  },
  hTrees: {
    birthPattern: [1],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.SplatsBinary,
    name: "H-trees",
    survivalPattern: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  },
  landRush: {
    birthPattern: [3, 5],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.SplatsBinary,
    name: "Land Rush",
    survivalPattern: [2, 3, 4, 5, 7, 8],
  },
  mazectric: {
    birthPattern: [3],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.SplatsBinary,
    name: "Mazectric",
    survivalPattern: [1, 2, 3, 4],
  },
  plowWorld: {
    birthPattern: [3, 7, 8],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.SplatsBinary,
    name: "Plow World",
    survivalPattern: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  },
  slowBlob: {
    birthPattern: [3, 6, 7],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.SplatsBinary,
    name: "Slow Blob",
    survivalPattern: [1, 2, 5, 6, 7, 8],
  },
  stains: {
    birthPattern: [3, 6, 7, 8],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.SplatsBinary,
    name: "Stains",
    survivalPattern: [2, 3, 5, 6, 7, 8],
  },
  vote: {
    birthPattern: [5, 6, 7, 8],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.UniformRandomBinary,
    name: "Vote",
    survivalPattern: [4, 5, 6, 7, 8],
  },
  walledCities: {
    birthPattern: [4, 5, 6, 7, 8],
    boundaryRule: BoundaryRule.Wrap,
    fillType: FillType.SplatsBinary,
    name: "Walled Cities",
    survivalPattern: [2, 3, 4, 5],
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
