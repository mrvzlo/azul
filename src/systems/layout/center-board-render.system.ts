import { Container, Graphics } from "pixi.js";
import { CenterBoard } from "../../components/center-board";
import { getFactoryPos } from "./center-board-layout.system";
import GameWorld from "../../components/game-world";
import { CIRCLE_R, OUTER_GAP } from "../../consts/sizes";
import { RenderFirstToken } from "./tile-render.system";
import { tileTextures } from "./textures";
import { MAIN_BG, MAIN_BORDER } from "../../consts/colors";

export const RenderCenterBoard = (container: Container, world: GameWorld) => {
  const g = new Graphics();
  container.addChild(g);
  renderFactories(g, world.center);
  world.hitboxes.forEach((t) => {
    const isSelected = world.lastPickup && t.sourceId === world.lastPickup.factory && t.color === world.lastPickup.color;
    g.rect(t.x, t.y, t.w, t.h).fill(t.source === "line" ? MAIN_BG : tileTextures[t.color]);
    if (isSelected) g.stroke(0xffffff);
  });
  if (!world.center.firstTaken) {
    RenderFirstToken(g, OUTER_GAP, OUTER_GAP);
  }
};

function renderFactories(g: Graphics, center: CenterBoard) {
  center.factories.forEach((_, circleIndex) => {
    const { x, y } = getFactoryPos(circleIndex);
    g.ellipse(x, y, CIRCLE_R, CIRCLE_R).fill(MAIN_BG).stroke(MAIN_BORDER);
  });
}
