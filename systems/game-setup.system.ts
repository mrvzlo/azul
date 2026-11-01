import { Application } from "pixi.js";
import { CenterBoard } from "../components/center-board";
import GameWorld from "../components/game-world";
import PlayerBoard from "../components/player-board";
import { PlayerType } from "../components/player.type";
import { Approximator } from "./ai/apporiximator";
import { DeepLooker } from "./ai/deep-looker";
import { shuffle } from "./shuffle.system";

export function SetupGame(app: Application, players: PlayerType[]) {
  const world: GameWorld = {
    center: setupGameBoard(players.length),
    currentPlayer: -1,
    players: players.map((x) => setupPlayerBoard(x)),
    round: 0,
    hitboxes: new Map(),
    history: [],
    windowSize: app.canvas,
  };
  assignAI(world);
  return world;
}

function setupGameBoard(players: number) {
  const board: CenterBoard = {
    firstTaken: false,
    outer: [],
    shuffled: shuffle(getAllTiles()),
    factories: Array.from({ length: players * 2 + 1 }, () => []),
    played: [],
  };

  return board;
}

function setupPlayerBoard(type: PlayerType) {
  const board: PlayerBoard = {
    score: 0,
    bonusScore: 0,
    arrangement: baseArrangement(),
    placed: Array.from({ length: 25 }, () => false),
    lineColors: [0, 0, 0, 0, 0],
    lineFilled: [0, 0, 0, 0, 0],
    penalties: [],
    hasFirst: false,
    type,
  };

  return board;
}

function getAllTiles() {
  const tiles = [];
  for (let i = 0; i < 100; i++) tiles.push((i % 5) + 1);
  return tiles;
}

function baseArrangement() {
  const arrangement = [];
  for (let i = 0; i < 50; i++) arrangement.push(((i - Math.floor(i / 5)) % 5) + 1);
  return arrangement;
}

function assignAI(world: GameWorld) {
  world.players.forEach((p, i) => {
    if (p.type === "Approx") p.ai = new Approximator(world, i);
    if (p.type === "Deep2") p.ai = new DeepLooker(world, i, 2);
    if (p.type === "Deep3") p.ai = new DeepLooker(world, i, 3);
  });
}
