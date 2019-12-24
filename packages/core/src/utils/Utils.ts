import { Color } from "three";

const Utils = {
  imageColorFromColor: (c: Color): { r: number; g: number; b: number } => ({
    r: Math.floor(c.r * 255),
    g: Math.floor(c.g * 255),
    b: Math.floor(c.b * 255)
  })
};

export default Utils;
