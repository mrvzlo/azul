import GameWorld from "../../components/game-world";
import { CIRCLE_R, HITBOX_GAP, INNER_GAP, OUTER_GAP, PLAYER_BOARD_TOP, TILE_SIZE } from "../../consts/sizes";

const lines = 5;

export function SetPlayerLineHitboxes(world: GameWorld) {
  world.players.forEach((p, pi) => {
    const px = getPlayerBoardX(pi);
    const py = getPlayerBoardY(pi);
    const isMain = pi === world.currentPlayer;
    for (let i = 0; i < lines; i++)
      for (let j = lines - i - 1; j < lines; j++)
        world.hitboxes.push({
          color: 6,
          x: px + j * (TILE_SIZE + INNER_GAP) - HITBOX_GAP / 2,
          y: py + i * (TILE_SIZE + INNER_GAP) - HITBOX_GAP / 2,
          w: TILE_SIZE + HITBOX_GAP,
          h: TILE_SIZE + HITBOX_GAP,
          source: "line",
          sourceId: i,
          interactive: isMain,
        });

    for (let i = 0; i < 7; i++) {
      world.hitboxes.push({
        color: 0,
        x: px - HITBOX_GAP / 2 + i * (TILE_SIZE + INNER_GAP),
        y: py + 5 * (TILE_SIZE + INNER_GAP) + INNER_GAP - HITBOX_GAP / 2,
        w: TILE_SIZE + HITBOX_GAP,
        h: TILE_SIZE + HITBOX_GAP,
        source: "line",
        sourceId: -1,
        interactive: isMain,
      });
    }
  });
}

export function getPlayerBoardY(index: number) {
  if (index == 0 || index == 1) return PLAYER_BOARD_TOP;
  return PLAYER_BOARD_TOP + TILE_SIZE * 6 + INNER_GAP * 6 + CIRCLE_R;
}

export function getPlayerBoardX(index: number) {
  if (index == 0 || index == 3) return OUTER_GAP;
  return OUTER_GAP + TILE_SIZE * 10 + INNER_GAP * 10 + CIRCLE_R;
}
