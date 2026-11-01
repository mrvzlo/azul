import { Container, Graphics, Text, TextStyleOptions } from "pixi.js";
import GameWorld from "../../components/game-world";
import { TILE_SIZE, INNER_GAP, PLAYER_BOARD_LEFT, PLAYER_BOARD_SIZE } from "../../consts/sizes";
import { getPlayerBoardScale, getPlayerBoardX, getPlayerBoardY } from "./player-board-layout.system";
import PlayerBoard from "../../components/player-board";
import { HideHitboxTile, RenderFirstToken, RenderHitboxTile } from "./tile-render.system";
import { shadowTextures, tileTextures } from "./textures";
import { MAIN_BG, MAIN_BORDER } from "../../consts/colors";

export function RenderPlayerBoard(container: Container, world: GameWorld) {
  world.players.forEach((p, pi) => {
    const px = getPlayerBoardX(world, pi);
    const py = getPlayerBoardY(world, pi);
    const scale = getPlayerBoardScale(pi);
    const gap = INNER_GAP * scale;

    const board = new Graphics();
    board
      .rect(px + (PLAYER_BOARD_LEFT - INNER_GAP) * scale, py - gap, PLAYER_BOARD_SIZE * scale, PLAYER_BOARD_SIZE * scale)
      .fill(MAIN_BG)
      .stroke(MAIN_BORDER);
    container.addChild(board);

    p.placed.forEach((placed, i) => {
      const x = i % 5;
      const y = Math.floor(i / 5);
      const g = drawTile(
        px + (PLAYER_BOARD_LEFT + (TILE_SIZE + INNER_GAP) * x) * scale,
        py + (TILE_SIZE + INNER_GAP) * y * scale,
        p.arrangement[i],
        TILE_SIZE * scale,
        !placed,
      );
      container.addChild(g);
    });

    world.hitboxes.forEach((hitbox) => {
      if (hitbox.source !== "line" || hitbox.playerIndex !== pi || hitbox.sourceId === undefined || hitbox.sourceId < 0) return;
      if (hitbox.occupied) RenderHitboxTile(container, hitbox, p.lineColors[hitbox.sourceId]);
      else HideHitboxTile(hitbox);
    });

    /*if (pi === world.currentPlayer) {
      const marker = new Graphics();
      marker.ellipse(px, py, 10, 10).fill("#5a58").stroke(0);
      container.addChild(marker);
    }*/

    drawPenalties(p, px, py, container, scale);
    drawScore(p, px, py, container, scale);
  });
}

function drawTile(x: number, y: number, color: number, size: number, grayed = false) {
  const tile = new Graphics();
  tile.rect(x, y, size, size).fill(grayed ? shadowTextures[color] : tileTextures[color]);
  return tile;
}

function drawPenalties(player: PlayerBoard, px: number, py: number, container: Container, scale: number) {
  let ind = 0;
  const size = TILE_SIZE * scale;
  const step = (TILE_SIZE + INNER_GAP) * scale;
  const top = py + (5 * (TILE_SIZE + INNER_GAP) + INNER_GAP) * scale;
  if (player.hasFirst) {
    const firstToken = new Graphics();
    RenderFirstToken(firstToken, px, top, size);
    container.addChild(firstToken);
    ind++;
  }
  for (let i = 0; i < 7 - +player.hasFirst && i < player.penalties.length; i++) {
    const g = drawTile(px + ind * step, top, player.penalties[i], size);
    container.addChild(g);
    ind++;
  }
}

const scoreW = 75;
const scoreH = 50;

function drawScore(p: PlayerBoard, px: number, py: number, container: Container, scale: number) {
  const width = scoreW * scale;
  const height = scoreH * scale;
  const scoreBackground = new Graphics();
  scoreBackground.rect(px, py, width, height).fill(MAIN_BG).stroke(MAIN_BORDER);
  container.addChild(scoreBackground);

  const style: TextStyleOptions = { fontSize: 32 * scale, fill: 0x222222, fontFamily: "Consolas", fontWeight: "bold" };
  const text = p.score + p.bonusScore;
  const score = new Text({ text, style });
  score.x = px - score.width / 2 + width / 2;
  score.y = py - score.height / 2 + height / 2;
  container.addChild(score);
}
