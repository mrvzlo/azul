import GameWorld from "../../components/game-world";
import PlayerBoard from "../../components/player-board";
import { InformGameEnd, InformMoveSwitch } from "../moves/player-shift.system";
import { getPenalty } from "./penalty.system";
import { RunRoundShuffle } from "./round-shuffler.system";

export function IsRoundEnd(world: GameWorld) {
  if (world.center.outer.length > 0) return false;
  for (let i = 0; i < world.center.factories.length; i++) if (world.center.factories[i].length > 0) return false;
  return true;
}

export function RunRoundEnd(world: GameWorld) {
  world.players.forEach((p) => RunPlayerScore(world, p));
  if (!IsGameEnd(world)) PrepareNewRound(world);
  else InformGameEnd();
}

function IsGameEnd(world: GameWorld) {
  return world.players.some((p) => countFullRows(p) > 0);
}

function PrepareNewRound(world: GameWorld) {
  world.currentPlayer = world.players.findIndex((x) => x.hasFirst);
  world.players.forEach((x) => (x.hasFirst = false));
  world.center.firstTaken = false;
  RunRoundShuffle(world);
  InformMoveSwitch();
}

export function PreCalcPlayerScoreChange(player: PlayerBoard) {
  let score = -getPenalty(player);
  player.lineFilled.forEach((filled, size) => {
    if (filled < size + 1) return;
    score += getTileScore(player, player.lineColors[size], size);
  });
  player.lineFilled.forEach((filled, line) => {
    if (filled < line + 1) return;
    const x = findPlacedIndex(player, player.lineColors[line], line);
    player.placed[x + line * 5] = false;
  });
  return score + getBonusScore(player) - player.bonusScore;
}

export function RunPlayerScore(world: GameWorld, player: PlayerBoard) {
  player.lineFilled.forEach((filled, line) => {
    if (filled < line + 1) return;
    player.score += getTileScore(player, player.lineColors[line], line);
    for (let j = 0; j < line; j++) world.center.played.push(player.lineColors[line]);
    player.lineFilled[line] = 0;
    player.lineColors[line] = -1;
  });
  player.score -= getPenalty(player);
  if (player.score < 0) player.score = 0;
  player.bonusScore = getBonusScore(player);
  world.center.played.push(...player.penalties);
  player.penalties = [];
}

function getTileScore(player: PlayerBoard, tile: number, y: number) {
  const x = findPlacedIndex(player, tile, y);
  player.placed[x + y * 5] = true;
  let top = 0,
    bottom = 0,
    left = 0,
    right = 0;
  while (y - top - 1 >= 0 && player.placed[x + (y - top - 1) * 5]) top++;
  while (y + bottom + 1 < 5 && player.placed[x + (y + bottom + 1) * 5]) bottom++;
  while (x - left - 1 >= 0 && player.placed[x - left - 1 + y * 5]) left++;
  while (x + right + 1 < 5 && player.placed[x + right + 1 + y * 5]) right++;
  const total = 1 + top + bottom + left + right + +(top + bottom > 0 && left + right > 0);
  if (player.type === "human") console.log("Placed at", x, y, " earned " + total);
  return total;
}

function getBonusScore(player: PlayerBoard) {
  return 2 * countFullRows(player) + 7 * countFullColumns(player) + 10 * countFullColors(player);
}

function countFullRows(player: PlayerBoard) {
  let rows = 0;
  for (let y = 0; y < 5; y++) {
    let full = true;
    for (let x = 0; x < 5; x++) full &&= player.placed[x + y * 5];
    if (full) rows++;
  }
  return rows;
}

function countFullColumns(player: PlayerBoard) {
  let cols = 0;
  for (let x = 0; x < 5; x++) {
    let full = true;
    for (let y = 0; y < 5; y++) full &&= player.placed[x + y * 5];
    if (full) cols++;
  }
  return cols;
}

function countFullColors(player: PlayerBoard) {
  let colors = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < player.arrangement.length; i++) {
    if (player.placed[i]) colors[player.arrangement[i]]++;
  }
  return colors.filter((x) => x === 5).length;
}

export function findPlacedIndex(player: PlayerBoard, tile: number, y: number) {
  for (let i = 0; i < 5; i++) if (player.arrangement[i + y * 5] === tile) return i;
  return -1;
}
