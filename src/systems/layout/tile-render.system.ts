import { Container, Graphics, Text, TextStyleOptions } from "pixi.js";
import { TILE_SIZE } from "../../consts/sizes";

export function RenderFirstToken(g: Graphics, container: Container, x: number, y: number) {
  g.rect(x, y, TILE_SIZE, TILE_SIZE).fill("#aaa").stroke(0);

  const style: TextStyleOptions = { fontSize: 20, fill: 0x111 };
  const score = new Text({ text: "1", style });
  score.x = x + TILE_SIZE / 2 - score.width / 2;
  score.y = y + TILE_SIZE / 2 - score.height / 2;
  container.addChild(score);
}
