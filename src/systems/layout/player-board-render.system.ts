import { Container, Graphics, Text, TextStyleOptions } from "pixi.js";
import GameWorld from "../../components/game-world";
import { OUTER_GAP, TILE_SIZE, INNER_GAP, PLAYER_BOARD_LEFT, PLAYER_BOARD_SIZE } from "../../consts/sizes";
import { getPlayerBoardX, getPlayerBoardY } from "./player-board-layout.system";
import PlayerBoard from "../../components/player-board";
import { HideHitboxTile, RenderFirstToken, RenderHitboxTile } from "./tile-render.system";
import { tileTextures } from "./textures";
import { MAIN_BG, MAIN_BORDER } from "../../consts/colors";

export function RenderPlayerBoard(container: Container, world: GameWorld) {
  world.players.forEach((p, pi) => {
    const px = getPlayerBoardX(world, pi);
    const py = getPlayerBoardY(pi);

    const board = new Graphics();
    board
      .rect(px + PLAYER_BOARD_LEFT - INNER_GAP, py - INNER_GAP, PLAYER_BOARD_SIZE, PLAYER_BOARD_SIZE)
      .fill(MAIN_BG)
      .stroke(MAIN_BORDER);
    container.addChild(board);

    p.placed.forEach((placed, i) => {
      const x = i % 5;
      const y = Math.floor(i / 5);
      const g = drawTile(px + PLAYER_BOARD_LEFT + (TILE_SIZE + INNER_GAP) * x, py + (TILE_SIZE + INNER_GAP) * y, p.arrangement[i]);
      if (!placed) g.alpha = 0.4;
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

    drawPenalties(p, px, py, container);
    drawScore(p, px, py, container);
  });
}

function drawTile(x: number, y: number, color: number, outlined = false) {
  const tile = new Graphics();
  const rect = tile.rect(x, y, TILE_SIZE, TILE_SIZE).fill(tileTextures[color]);
  if (outlined) rect.stroke(0);
  return tile;
}

function drawPenalties(player: PlayerBoard, px: number, py: number, container: Container) {
  let ind = 0;
  let left = px;
  const top = py + 5 * (TILE_SIZE + INNER_GAP) + INNER_GAP;
  if (player.hasFirst) {
    const firstToken = new Graphics();
    RenderFirstToken(firstToken, left, top);
    container.addChild(firstToken);
    ind++;
  }
  for (let i = 0; i < 7 - +player.hasFirst && i < player.penalties.length; i++) {
    const g = drawTile(left + ind * (TILE_SIZE + INNER_GAP), top, player.penalties[i]);
    container.addChild(g);
    ind++;
  }
}

const scoreLeft = (TILE_SIZE + INNER_GAP) * 7 + INNER_GAP;
const scoreTop = 5 * (TILE_SIZE + INNER_GAP) + INNER_GAP;
const scoreW = TILE_SIZE * 3 + INNER_GAP * 2;
const scoreH = TILE_SIZE;

function drawScore(p: PlayerBoard, px: number, py: number, container: Container) {
  const scoreBackground = new Graphics();
  scoreBackground
    .rect(px + scoreLeft, py + scoreTop, scoreW, scoreH)
    .fill(MAIN_BG)
    .stroke(MAIN_BORDER);
  container.addChild(scoreBackground);

  const style: TextStyleOptions = { fontSize: 16, fill: 0x222222, fontFamily: "Courier New", fontWeight: "bold" };
  const text = p.score + (p.bonusScore > 0 ? " + " + p.bonusScore : "");
  const score = new Text({ text, style });
  score.x = px + scoreLeft - score.width / 2 + scoreW / 2;
  score.y = py + scoreTop - score.height / 2 + scoreH / 2;
  container.addChild(score);
}
