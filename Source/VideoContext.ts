import { Color, getTwoStopGradient, Rgb } from "./Color";
import { Point2d } from "./Geometry";
import { Grid } from "./Grid";

interface TwoStopGradient {
  stopA: Rgb;
  stopB: Rgb;
}

export interface VideoContext {
  canvas: HTMLCanvasElement;
  gradient: TwoStopGradient;
  pixelImageData: ImageData;
  renderingContext: CanvasRenderingContext2D;
}

const getUint8FromUnorm = (x: number) => {
  return Math.floor(255 * x);
};

const setPixel = (
  videoContext: VideoContext,
  position: Point2d,
  color: Color
) => {
  const { canvas, pixelImageData } = videoContext;
  const { data } = pixelImageData;
  const { r, g, b, a } = color;
  const pixelIndex = 4 * (canvas.width * position.y + position.x);
  data[pixelIndex] = getUint8FromUnorm(r);
  data[pixelIndex + 1] = getUint8FromUnorm(g);
  data[pixelIndex + 2] = getUint8FromUnorm(b);
  data[pixelIndex + 3] = getUint8FromUnorm(a);
};

export const clearCanvas = (videoContext: VideoContext) => {
  const { canvas, renderingContext: context } = videoContext;
  context.clearRect(0, 0, canvas.width, canvas.height);
};

export const updateCanvas = (videoContext: VideoContext) => {
  const { renderingContext: context, pixelImageData } = videoContext;
  context.putImageData(pixelImageData, 0, 0);
};

export const drawGrid = (videoContext: VideoContext, grid: Grid) => {
  const { gradient } = videoContext;
  const palette = getTwoStopGradient(
    gradient.stopA,
    gradient.stopB,
    grid.stateCount
  );
  const { height, width } = grid.dimension;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cellIndex = width * y + x;
      const state = grid.cells[cellIndex];
      const color = palette[state];
      setPixel(videoContext, { x, y }, color);
    }
  }
};
