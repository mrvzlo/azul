import { CenterBoard } from "../../components/center-board";
import GameWorld from "../../components/game-world";
import { shuffle } from "../shuffle.system";

export function RunRoundShuffle(gameWorld: GameWorld) {
  if (gameWorld.currentPlayer === -1) gameWorld.currentPlayer = Math.floor(Math.random() * gameWorld.players.length);
  const center = gameWorld.center;
  center.outer = [];
  center.factories = Array.from({ length: center.factories.length }, () => Array.from({ length: 4 }, () => getNextTile(center)));
}

function getNextTile(center: CenterBoard) {
  if (center.shuffled.length === 0) {
    center.shuffled = shuffle(center.played);
    center.played = [];
  }
  if (center.shuffled.length === 0) return 0;
  return center.shuffled.pop()!;
}
