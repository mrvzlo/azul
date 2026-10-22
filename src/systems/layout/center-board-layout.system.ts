import { TILE_SIZE, OUTER_GAP, CIRCLE_R, INNER_GAP } from "../../consts/sizes";
import GameWorld from "../../components/game-world";
import { PickupSource } from "../../components/hitbox";

export function SetCenterTileHitboxes(world: GameWorld) {
  addOuterTilesHitboxes(world);
  addFactoryTilesHitboxes(world);
}

function addOuterTilesHitboxes(world: GameWorld) {
  let x = OUTER_GAP * 2 + TILE_SIZE;
  let y = OUTER_GAP;

  world.center.outer.forEach((color) => {
    addTileHitbox(world, color, x, y, "outer", -1);
    x += TILE_SIZE + OUTER_GAP;
  });
}

function addFactoryTilesHitboxes(world: GameWorld) {
  world.center.factories.forEach((factory, factoryIndex) => {
    let { x, y } = getFactoryPos(factoryIndex);
    factory.forEach((color, tileIndex) => addTileHitbox(world, color, x + getTileX(tileIndex), y + getTileY(tileIndex), "factory", factoryIndex));
  });
}

function addTileHitbox(world: GameWorld, color: number, x: number, y: number, source: PickupSource, sourceId: number) {
  world.hitboxes.push({ x, y, w: TILE_SIZE, h: TILE_SIZE, color, source, sourceId, interactive: true });
}

function getTileX(index: number) {
  if (index == 0 || index == 2) return -INNER_GAP / 2 - TILE_SIZE;
  return INNER_GAP / 2;
}

function getTileY(index: number) {
  if (index == 0 || index == 1) return -INNER_GAP / 2 - TILE_SIZE;
  return INNER_GAP / 2;
}

export function getFactoryPos(i: number) {
  const y = TILE_SIZE + OUTER_GAP * 2 + CIRCLE_R;
  const x = OUTER_GAP + i * (CIRCLE_R * 2 + OUTER_GAP) + CIRCLE_R;
  return { x, y };
}
