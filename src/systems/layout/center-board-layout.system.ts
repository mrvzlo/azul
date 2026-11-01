import { TILE_SIZE, OUTER_GAP, CIRCLE_R, INNER_GAP } from "../../consts/sizes";
import GameWorld from "../../components/game-world";
import { updateHitbox } from "../../components/hitbox";
import { PickupSource } from "../../components/hitbox";

export function SetCenterTileHitboxes(world: GameWorld) {
  const outerCapacity = world.center.factories.length * 4;
  for (let i = 0; i < outerCapacity; i++) {
    const color = world.center.outer[i] ?? 0;
    const key = `outer:${i}`;
    const shift = i - world.center.outer.length / 2 + 0.5;
    const x = world.windowSize.width / 2 - TILE_SIZE / 2 + shift * (TILE_SIZE / 2 + 2);
    const y = OUTER_GAP + TILE_SIZE * 2 + (i % 2) * (TILE_SIZE + 2);
    setTileHitbox(world, key, color, x, y, "outer", -1);
  }

  world.center.factories.forEach((factory, factoryIndex) => {
    const { x, y } = getFactoryPos(world, factoryIndex);
    for (let tileIndex = 0; tileIndex < 4; tileIndex++) {
      const color = factory[tileIndex] ?? 0;
      const key = `factory:${factoryIndex}:${tileIndex}`;
      setTileHitbox(world, key, color, x + getTileX(tileIndex), y + getTileY(tileIndex), "factory", factoryIndex);
    }
  });
}

function setTileHitbox(world: GameWorld, key: string, color: number, x: number, y: number, source: PickupSource, sourceId: number) {
  updateHitbox(world.hitboxes, key, {
    x,
    y,
    w: TILE_SIZE,
    h: TILE_SIZE,
    color,
    source,
    sourceId,
    interactive: color > 0,
    occupied: color > 0,
  });
}

function getTileX(index: number) {
  if (index == 0 || index == 2) return -INNER_GAP / 2 - TILE_SIZE;
  return INNER_GAP / 2;
}

function getTileY(index: number) {
  if (index == 0 || index == 1) return -INNER_GAP / 2 - TILE_SIZE;
  return INNER_GAP / 2;
}

export function getFactoryPos(world: GameWorld, i: number) {
  const half = world.center.factories.length / 2;
  const shiftX = i + 0.5 - half;

  const y = TILE_SIZE * 3 + OUTER_GAP * 5 + CIRCLE_R + (i % 2) * CIRCLE_R * 2;
  const x = world.windowSize.width / 2 + shiftX * (CIRCLE_R + INNER_GAP);
  return { x, y };
}
