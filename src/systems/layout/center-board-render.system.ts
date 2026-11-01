import { Container, Graphics } from "pixi.js";
import { getFactoryPos } from "./center-board-layout.system";
import GameWorld from "../../components/game-world";
import { CIRCLE_R, TILE_SIZE } from "../../consts/sizes";
import { HideHitboxTile, RenderFirstToken, RenderHitboxTile } from "./tile-render.system";
import { MAIN_BG, MAIN_BORDER } from "../../consts/colors";

export const RenderCenterBoard = (container: Container, world: GameWorld) => {
  const lineG = new Graphics();
  renderFactories(world, lineG);
  world.hitboxes.forEach((t) => {
    if (t.source !== "line") return;
    lineG.rect(t.x, t.y, t.w, t.h).fill(MAIN_BG);
  });
  container.addChild(lineG);

  world.hitboxes.forEach((t) => {
    if (t.source === "line") return;
    if (!t.occupied) {
      HideHitboxTile(t);
      return;
    }
    const isSelected = world.lastPickup && t.sourceId === world.lastPickup.factory && t.color === world.lastPickup.color;
    RenderHitboxTile(container, t, t.color, !!isSelected);
  });
  if (!world.center.firstTaken) {
    RenderFirstToken(lineG, world.windowSize.width / 2 - TILE_SIZE / 2, TILE_SIZE);
  }
};

function renderFactories(world: GameWorld, g: Graphics) {
  world.center.factories.forEach((_, circleIndex) => {
    const { x, y } = getFactoryPos(world, circleIndex);
    g.ellipse(x, y, CIRCLE_R, CIRCLE_R).fill(MAIN_BG).stroke(MAIN_BORDER);
  });
}
