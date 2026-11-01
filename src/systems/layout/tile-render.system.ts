import { Container, Graphics } from "pixi.js";
import Hitbox from "../../components/hitbox";
import { TILE_SIZE } from "../../consts/sizes";
import { getPlayerBoardScale } from "./player-board-layout.system";
import { tileTextures } from "./textures";

export function RenderFirstToken(g: Graphics, x: number, y: number, size = TILE_SIZE) {
  g.rect(x, y, size, size).fill(tileTextures[6]);
}

export function RenderHitboxTile(container: Container, hitbox: Hitbox, color: number, selected = false) {
  const graphic = hitbox.graphic;
  const size = TILE_SIZE * getPlayerBoardScale(hitbox.playerIndex ?? 0);
  if (hitbox.graphicColor !== color || hitbox.graphicSelected !== selected) {
    graphic.clear().rect(0, 0, size, size).fill(tileTextures[color]);
    if (selected) graphic.stroke(0xffffff);
    hitbox.graphicColor = color;
    hitbox.graphicSelected = selected;
  }
  const x = hitbox.x + (hitbox.w - size) / 2;
  const y = hitbox.y + (hitbox.h - size) / 2;
  if (graphic.position.x !== x || graphic.position.y !== y) graphic.position.set(x, y);
  graphic.scale.set(1);
  graphic.visible = true;
  if (graphic.parent !== container) container.addChild(graphic);
  return graphic;
}

export function HideHitboxTile(hitbox: Hitbox) {
  hitbox.graphic.visible = false;
}
