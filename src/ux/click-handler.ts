import { Application, Container, Point } from "pixi.js";
import GameWorld from "../components/game-world";
import { DrawBoard } from "../systems/layout/draw-board.system";
import { CreatePickupFromHitbox } from "../systems/moves/tile-pick.system";
import { applyPickup, undoPickup, validatePickup } from "../systems/moves/pickup.system";
import { IsRoundEnd, RunRoundEnd } from "../systems/round/round-end.system";
import { InformMoveSwitch } from "../systems/moves/player-shift.system";
import { SetupGame } from "../systems/game-setup.system";
import { RunRoundShuffle } from "../systems/round/round-shuffler.system";
import { AIS } from "../main";
import { PlayerType } from "../components/player.type";

const gameContainer = new Container();
const highlightContainer = new Container();
const winners = new Map<PlayerType, number>();
let games = 0;

export function setupClickHandling(app: Application, world: GameWorld) {
  app.stage.addChild(gameContainer);
  app.stage.addChild(highlightContainer);

  app.stage.eventMode = "static";
  app.stage.hitArea = app.screen;
  app.stage.on("pointerdown", (event) => handleClick(world, event.global));
  Object.assign(window, { baba: () => world });

  document.addEventListener("MoveSwitch", () => {
    if (IsRoundEnd(world)) RunRoundEnd(world);
    else setTimeout(() => runAI(world), 1);
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "z") {
      if (world.players[world.currentPlayer].type !== "human") return;
      if (world.history.some((x) => x.player === world.currentPlayer))
        for (let i = 0; i < world.players.length; i++) {
          const lastMove = world.history.pop();
          undoPickup(world, lastMove!, false);
        }
      redraw(world);
      InformMoveSwitch();
    }
  });

  document.addEventListener("GameEnd", () => {
    games++;
    const winner = world.players
      .map((x, i) => ({ id: i, ...x, totalScore: x.score + x.bonusScore }))
      .sort((a, b) => b.totalScore - a.totalScore)[0];
    winners.set(winner.type, (winners.get(winner.type) ?? 0) + 1);
    const list: string[] = [];
    winners.forEach((v, k) => {
      list.push(k + ": " + Math.floor((v / games) * 100) + "%");
    });
    console.log(list.join(", "));
    if (winner.totalScore > 100) {
      redraw(world);
      return;
    }
    world = SetupGame(AIS);
    RunRoundShuffle(world);
    InformMoveSwitch();
  });

  window.addEventListener("resize", () => redraw(world));
}

function handleClick(world: GameWorld, newPos: Point) {
  if (world.players[world.currentPlayer].type !== "human") return;
  const hit = world.hitboxes.find((box) => box.x <= newPos.x && box.y <= newPos.y && box.x + box.w > newPos.x && box.y + box.h > newPos.y);
  if (hit && !hit.interactive) return;
  if (!hit) delete world.lastPickup;
  else if (hit.source !== "line") {
    world.lastPickup = CreatePickupFromHitbox(world, hit);
  } else if (world.lastPickup && hit.source === "line") {
    world.lastPickup.toLine = hit.sourceId;
    if (validatePickup(world, world.lastPickup)) {
      applyPickup(world, world.lastPickup, false);
      delete world.lastPickup;
    } else delete world.lastPickup.toLine;
  }
  redraw(world);
}

function runAI(world: GameWorld) {
  const ai = world.players[world.currentPlayer].ai;
  if (ai) applyPickup(world, ai.makeMove(), false);
  else redraw(world);
}

function redraw(world: GameWorld) {
  gameContainer.removeChildren();
  DrawBoard(gameContainer, world);
}
