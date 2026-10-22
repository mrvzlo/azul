import GameWorld from "../../components/game-world";
import Pickup from "../../components/pickup";
import PlayerBoard from "../../components/player-board";
import { findPlacedIndex } from "../round/round-end.system";
import { setNextPlayer, setPreviousPlayer } from "./player-shift.system";

export function applyPickup(world: GameWorld, pickup: Pickup, simulate: boolean) {
  if (!pickup) console.log(world, pickup, simulate);
  const target = world.players[pickup.player];
  recountPenaltyTiles(world, pickup);
  if (pickup.factory < 0) removeFromCenter(world, pickup);
  else removeFromFactory(world, pickup);
  addToPlayer(target, pickup);
  if (!simulate) world.history.push(pickup);
  setNextPlayer(world, simulate);
}

export function undoPickup(world: GameWorld, pickup: Pickup, simulate: boolean) {
  const target = world.players[pickup.player];
  if (pickup.factory < 0) addToCenter(world, pickup);
  else addToFactory(world, pickup);
  removeFromPlayer(target, pickup);
  if (!simulate) world.history.pop();
  setPreviousPlayer(world, simulate);
}

function addToPlayer(target: PlayerBoard, pickup: Pickup) {
  const line = pickup.toLine!;
  if (line >= 0) {
    target.lineFilled[line] += pickup.tilesToLine;
    target.lineColors[line] = pickup.color;
  }
  target.penalties.push(...Array.from({ length: pickup.tilesToPenalty }, () => pickup.color));
  if (pickup.takesFirst) target.hasFirst = true;
}

function removeFromPlayer(target: PlayerBoard, pickup: Pickup) {
  const line = pickup.toLine!;
  if (line >= 0) {
    target.lineFilled[line] -= pickup.tilesToLine;
    if (target.lineColors[line] === 0) target.lineColors[line] = 0;
  }
  filterOut(target.penalties, pickup.color, pickup.tilesToPenalty);
  if (pickup.takesFirst) target.hasFirst = false;
}

function removeFromCenter(world: GameWorld, pickup: Pickup) {
  filterOut(world.center.outer, pickup.color, pickup.tilesToLine + pickup.tilesToPenalty);
  if (pickup.takesFirst) world.center.firstTaken = true;
}

function addToCenter(world: GameWorld, pickup: Pickup) {
  world.center.outer.push(...Array.from({ length: pickup.tilesToPenalty + pickup.tilesToLine }, () => pickup.color));
  if (pickup.takesFirst) world.center.firstTaken = false;
}

function removeFromFactory(world: GameWorld, pickup: Pickup) {
  const factory = world.center.factories[pickup.factory];
  pickup.skipped = factory.filter((x) => x !== pickup.color);
  pickup.skipped.forEach((x) => world.center.outer.push(x));
  world.center.factories[pickup.factory] = [];
}

function addToFactory(world: GameWorld, pickup: Pickup) {
  if (pickup.skipped) pickup.skipped.forEach((x) => filterOut(world.center.outer, x, 1));
  world.center.factories[pickup.factory] = [];
  for (let i = 0; i < pickup.tilesToPenalty + pickup.tilesToLine; i++) world.center.factories[pickup.factory].push(pickup.color);
  if (pickup.skipped) for (let i = 0; i < pickup.skipped.length; i++) world.center.factories[pickup.factory].push(pickup.skipped[i]);
}

export function validatePickup(world: GameWorld, pickup: Pickup) {
  const target = world.players[pickup.player];
  if (pickup.toLine === -1) return true;
  if (pickup.toLine === undefined || pickup.toLine > 4) return false;
  const startedDifferently = target.lineFilled[pickup.toLine] > 0 && target.lineColors[pickup.toLine] !== pickup.color;
  if (startedDifferently) return false;
  const full = target.lineFilled[pickup.toLine] === pickup.toLine + 1;
  if (full) return false;
  const id = findPlacedIndex(target, pickup.color, pickup.toLine) + pickup.toLine * 5;
  const filledPreviously = target.placed[id];
  return !filledPreviously;
}

function filterOut(array: number[], value: number, count: number) {
  let writeIndex = 0;

  for (let readIndex = 0; readIndex < array.length; readIndex++) {
    const matches = array[readIndex] === value && count > 0;
    if (matches) {
      count--;
      continue;
    }

    array[writeIndex++] = array[readIndex];
  }
  array.length = writeIndex;
}

function recountPenaltyTiles(world: GameWorld, pickup: Pickup) {
  const target = world.players[pickup.player];
  if (pickup.toLine === undefined) return;
  const freeSpace = pickup.toLine < 0 ? 0 : pickup.toLine + 1 - target.lineFilled[pickup.toLine];
  if (pickup.tilesToLine > freeSpace) {
    pickup.tilesToPenalty = pickup.tilesToLine - freeSpace;
    pickup.tilesToLine = freeSpace;
  }
}
