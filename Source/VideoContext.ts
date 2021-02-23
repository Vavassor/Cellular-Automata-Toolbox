import { Color, getTwoStopGradient, unpackUByte4 } from "./Color";
import { Point2d } from "./Geometry";
import { Grid } from "./Grid";
import { mod } from "./Math";

export interface VideoContext {
  canvas: HTMLCanvasElement;
  renderingContext: CanvasRenderingContext2D;
  pixelImageData: ImageData;
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
  const palette = getTwoStopGradient(
    unpackUByte4(0x000000ff),
    unpackUByte4(0xffffffff),
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
