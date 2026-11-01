import { Graphics } from "pixi.js";
import GameWorld from "../../components/game-world";
import Hitbox from "../../components/hitbox";
import Pickup from "../../components/pickup";
import { INNER_GAP, OUTER_GAP, TILE_SIZE } from "../../consts/sizes";
import { findPlacedIndex } from "../round/round-end.system";
import { getPlayerBoardScale, getPlayerBoardX, getPlayerBoardY } from "./player-board-layout.system";

const PLAYER_BOARD_LEFT = OUTER_GAP + TILE_SIZE * 5 + INNER_GAP * 4;
const ANIMATION_DURATION = 420;
const TILE_STAGGER = 24;
let animationCount = 0;

interface TileMovement {
  hitbox: Hitbox;
  graphic: Graphics;
  toX: number;
  toY: number;
  toScale: number;
}

export function GetAnimationCount() {
  return animationCount;
}

export async function AnimatePickupTiles(world: GameWorld, pickup: Pickup): Promise<void> {
  if (pickup.toLine === undefined) return;

  const player = world.players[pickup.player];
  const totalTiles = pickup.tilesToLine + pickup.tilesToPenalty;
  const keyPrefix = pickup.factory < 0 ? "outer:" : `factory:${pickup.factory}:`;
  const origins = Array.from(world.hitboxes.entries())
    .filter(
      ([key, hitbox]) =>
        key.startsWith(keyPrefix) &&
        hitbox.source === (pickup.factory < 0 ? "outer" : "factory") &&
        hitbox.color === pickup.color &&
        (pickup.factory < 0 || hitbox.sourceId === pickup.factory),
    )
    .slice(0, totalTiles)
    .map(([, hitbox]) => hitbox);
  const movements: TileMovement[] = [];
  const boardX = getPlayerBoardX(world, pickup.player);
  const boardY = getPlayerBoardY(world, pickup.player);
  const scale = getPlayerBoardScale(pickup.player);
  const startLineCount = pickup.toLine < 0 ? 0 : player.lineFilled[pickup.toLine];
  const availableLineSpace = pickup.toLine < 0 ? 0 : pickup.toLine + 1 - startLineCount;
  const tilesToLine = Math.min(totalTiles, Math.max(0, availableLineSpace));
  const tilesToPenalty = totalTiles - tilesToLine;

  for (let i = 0; i < Math.min(tilesToLine, origins.length); i++) {
    movements.push({
      hitbox: origins[i],
      graphic: origins[i].graphic,
      toX: boardX + (TILE_SIZE + INNER_GAP) * (4 - startLineCount - i) * scale - origins[i].x,
      toY: boardY + pickup.toLine * (TILE_SIZE + INNER_GAP) * scale - origins[i].y,
      toScale: scale,
    });
  }

  const penaltyStart = player.penalties.length + +player.hasFirst;
  for (let i = 0; i < tilesToPenalty && tilesToLine + i < origins.length; i++) {
    const penaltyIndex = penaltyStart + i;
    if (penaltyIndex >= 7) continue;
    movements.push({
      hitbox: origins[tilesToLine + i],
      graphic: origins[tilesToLine + i].graphic,
      toX: boardX + penaltyIndex * (TILE_SIZE + INNER_GAP) * scale - origins[tilesToLine + i].x,
      toY: boardY + (5 * (TILE_SIZE + INNER_GAP) + INNER_GAP) * scale - origins[tilesToLine + i].y,
      toScale: scale,
    });
  }

  await animateTiles(movements);
}

export async function AnimateRoundEndTiles(world: GameWorld): Promise<void> {
  const movements: TileMovement[] = [];
  world.players.forEach((player, pi) => {
    player.lineFilled.forEach((filled, line) => {
      if (filled < line + 1) return;

      const color = player.lineColors[line];
      const column = findPlacedIndex(player, color, line);
      if (column < 0) return;

      const boardX = getPlayerBoardX(world, pi);
      const scale = getPlayerBoardScale(pi);

      for (let col = 4 - line; col < 5; col++) {
        const source = world.hitboxes.get(`line:${pi}:${line}:${col}`);
        if (!source) continue;
        const sourceX = source.x;

        movements.push({
          hitbox: source,
          graphic: source.graphic,
          toX: boardX + (PLAYER_BOARD_LEFT + column * (TILE_SIZE + INNER_GAP)) * scale - sourceX - 2,
          toY: 0,
          toScale: scale,
        });
      }
    });
  });

  await animateTiles(movements);
}

function animateTiles(movements: TileMovement[]): Promise<void> {
  if (movements.length === 0) return Promise.resolve();

  animationCount++;
  return new Promise((resolve) => {
    const tiles = movements.map(({ hitbox, graphic, toX, toY, toScale }) => ({
      hitbox,
      fromHitboxX: hitbox.x,
      fromHitboxY: hitbox.y,
      graphic,
      fromX: graphic.position.x,
      fromY: graphic.position.y,
      toX: graphic.position.x + toX,
      toY: graphic.position.y + toY,
      fromScaleX: graphic.scale.x,
      fromScaleY: graphic.scale.y,
      toScale,
    }));

    const startTime = performance.now();
    const update = (time: number) => {
      let active = false;
      tiles.forEach(({ hitbox, fromHitboxX, fromHitboxY, graphic, fromX, fromY, toX, toY, fromScaleX, fromScaleY, toScale }, index) => {
        const progress = Math.max(0, Math.min(1, (time - startTime - index * TILE_STAGGER) / ANIMATION_DURATION));
        const eased = 1 - Math.pow(1 - progress, 3);
        graphic.position.set(fromX + (toX - fromX) * eased, fromY + (toY - fromY) * eased);
        graphic.scale.set(fromScaleX + (toScale - fromScaleX) * eased, fromScaleY + (toScale - fromScaleY) * eased);
        hitbox.x = fromHitboxX + (toX - fromX) * eased;
        hitbox.y = fromHitboxY + (toY - fromY) * eased;
        if (progress < 1) active = true;
      });

      if (active) requestAnimationFrame(update);
      else {
        animationCount--;
        resolve();
      }
    };

    requestAnimationFrame(update);
  });
}
