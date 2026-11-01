import { Graphics } from "pixi.js";
import { TILE_SIZE } from "../../consts/sizes";
import { tileTextures } from "./textures";

export function RenderFirstToken(g: Graphics, x: number, y: number) {
  g.rect(x, y, TILE_SIZE, TILE_SIZE).fill(tileTextures[6]).stroke(0);
}
