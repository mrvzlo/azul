import { Container, Graphics, Text, TextStyleOptions } from "pixi.js";
import GameWorld from "../../components/game-world";
import { OUTER_GAP, TILE_SIZE, INNER_GAP, HITBOX_GAP } from "../../consts/sizes";
import { TileColors } from "../../consts/tile-colors";
import { getPlayerBoardX, getPlayerBoardY } from "./player-board-layout.system";
import PlayerBoard from "../../components/player-board";
import { RenderFirstToken } from "./tile-render.system";

const PLAYER_BOARD_LEFT = OUTER_GAP + TILE_SIZE * 5 + INNER_GAP * 4;
const PLAYER_BOARD_SIZE = TILE_SIZE * 5 + INNER_GAP * 4 + INNER_GAP * 2;

export function RenderPlayerBoard(container: Container, world: GameWorld) {
  const g = new Graphics();
  container.addChild(g);

  world.players.forEach((p, pi) => {
    const isMain = pi === world.currentPlayer;
    const px = getPlayerBoardX(pi);
    const py = getPlayerBoardY(pi);

    g.rect(px + PLAYER_BOARD_LEFT - INNER_GAP, py - INNER_GAP, PLAYER_BOARD_SIZE, PLAYER_BOARD_SIZE)
      .fill(TileColors[0] + "66")
      .stroke(0);
    p.placed.forEach((placed, i) => {
      const x = i % 5;
      const y = Math.floor(i / 5);
      let color = TileColors[p.arrangement[i]];
      if (!placed) color += "66";
      const rect = g.rect(px + PLAYER_BOARD_LEFT + (TILE_SIZE + INNER_GAP) * x, py + (TILE_SIZE + INNER_GAP) * y, TILE_SIZE, TILE_SIZE).fill(color);
      if (placed) rect.stroke(0);
    });

    p.lineFilled.forEach((line, i) => {
      if (line === 0) return;
      const color = p.lineColors[i];
      const top = py + i * (TILE_SIZE + INNER_GAP);
      let left = px + (TILE_SIZE + INNER_GAP) * 4;
      for (let i = 0; i < line; i++) {
        g.rect(left, top, TILE_SIZE, TILE_SIZE).fill(TileColors[color]).stroke(0);
        left -= TILE_SIZE + INNER_GAP;
      }
    });

    //Add penalty tiles

    if (isMain) {
      g.ellipse(px, py, 10, 10).fill("#5a58").stroke(0);
    }

    drawPenalties(p, px, py, container, g);
    drawScore(g, p, px, py, container);
  });
}

function drawPenalties(player: PlayerBoard, px: number, py: number, container: Container, g: Graphics) {
  let ind = 0;
  let left = px;
  const top = py + 5 * (TILE_SIZE + INNER_GAP) + INNER_GAP;
  if (player.hasFirst) {
    RenderFirstToken(g, container, left, top);
    ind++;
  }
  for (let i = 0; i < 7 - +player.hasFirst && i < player.penalties.length; i++) {
    g.rect(left + ind * (TILE_SIZE + INNER_GAP), top, TILE_SIZE, TILE_SIZE)
      .fill(TileColors[player.penalties[i]])
      .stroke(0);
    ind++;
  }
}

const scoreLeft = (TILE_SIZE + INNER_GAP) * 7 + INNER_GAP + TILE_SIZE / 2;
const scoreTop = 5 * (TILE_SIZE + INNER_GAP) + INNER_GAP - HITBOX_GAP / 2;
const scoreW = TILE_SIZE * 2 + INNER_GAP * 2;
const scoreH = TILE_SIZE + HITBOX_GAP;

function drawScore(g: Graphics, p: PlayerBoard, px: number, py: number, container: Container) {
  g.rect(px + scoreLeft, py + scoreTop, scoreW, scoreH)
    .fill(TileColors[0])
    .stroke(0);

  const style: TextStyleOptions = { fontSize: 16, fill: 0x222222 };
  const text = p.score + (p.bonusScore > 0 ? " + " + p.bonusScore : "");
  const score = new Text({ text, style });
  score.x = px + scoreLeft - score.width / 2 + scoreW / 2;
  score.y = py + scoreTop - score.height / 2 + scoreH / 2;
  container.addChild(score);
}
