import { Container } from "pixi.js";
import GameWorld from "../../components/game-world";
import { SetCenterTileHitboxes } from "./center-board-layout.system";
import { RenderCenterBoard } from "./center-board-render.system";
import { SetPlayerLineHitboxes } from "./player-board-layout.system";
import { RenderPlayerBoard } from "./player-board-render.system";

export function DrawBoard(container: Container, world: GameWorld) {
  world.hitboxes = [];
  SetCenterTileHitboxes(world);
  SetPlayerLineHitboxes(world);
  RenderCenterBoard(container, world);
  RenderPlayerBoard(container, world);
}
