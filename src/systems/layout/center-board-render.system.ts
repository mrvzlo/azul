import { Container, Graphics } from "pixi.js";
import { CenterBoard } from "../../components/center-board";
import { getFactoryPos } from "./center-board-layout.system";
import GameWorld from "../../components/game-world";
import { CIRCLE_R, OUTER_GAP, TILE_SIZE } from "../../consts/sizes";
import { TileColors } from "../../consts/tile-colors";
import { RenderFirstToken } from "./tile-render.system";

export const RenderCenterBoard = (container: Container, world: GameWorld) => {
  const g = new Graphics();
  container.addChild(g);
  renderFactories(g, world.center);
  world.hitboxes.forEach((t) => {
    const isSelected = world.lastPickup && t.sourceId === world.lastPickup.factory && t.color === world.lastPickup.color;
    g.rect(t.x, t.y, t.w, t.h)
      .fill(TileColors[t.color])
      .stroke(isSelected ? 0xffffff : 0);
  });
  if (!world.center.firstTaken) {
    RenderFirstToken(g, container, OUTER_GAP, OUTER_GAP);
  }
};

function renderFactories(g: Graphics, center: CenterBoard) {
  center.factories.forEach((_, circleIndex) => {
    const { x, y } = getFactoryPos(circleIndex);
    g.ellipse(x, y, CIRCLE_R, CIRCLE_R).fill("#eb8a").stroke({ width: 3, color: "#543a" });
  });
}
