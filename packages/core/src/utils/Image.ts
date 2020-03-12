export default class Image {
  public w: number;
  public h: number;
  public context: CanvasRenderingContext2D;
  public pixels: Uint8ClampedArray;
  public imageData: ImageData;

  public constructor(canvas: HTMLCanvasElement) {
    this.w = canvas.width;
    this.h = canvas.height;

    this.context = canvas.getContext("2d");
    this.imageData = this.context.getImageData(0, 0, this.w, this.h);
    this.pixels = this.imageData.data;
  }

  public putPixel(
    x: number,
    y: number,
    color: { r: number; g: number; b: number }
  ): void {
    const offset = (y * this.w + x) * 4;
    this.pixels[offset] = color.r | 0;
    this.pixels[offset + 1] = color.g | 0;
    this.pixels[offset + 2] = color.b | 0;
    this.pixels[offset + 3] = 255;
  }

  public renderInto(element: Element): void {
    this.context.putImageData(this.imageData, 0, 0);
  }
}
