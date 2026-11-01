import { Application, Container, Point } from "pixi.js";
import GameWorld from "../components/game-world";
import { DrawBoard } from "../systems/layout/draw-board.system";
import { CreatePickupFromHitbox } from "../systems/moves/tile-pick.system";
import { applyPickup, undoPickup, validatePickup } from "../systems/moves/pickup.system";
import { IsRoundEnd, RunRoundEnd } from "../systems/round/round-end.system";
import { InformMoveSwitch } from "../systems/moves/player-shift.system";
import { AnimatePickupTiles, AnimateRoundEndTiles, GetAnimationCount } from "../systems/layout/tile-animation.system";
import { showGameOver } from "../systems/game-end.system";

const gameContainer = new Container();
const highlightContainer = new Container();

export function setupClickHandling(app: Application, world: GameWorld) {
  app.stage.addChild(gameContainer);
  app.stage.addChild(highlightContainer);

  app.stage.eventMode = "static";
  app.stage.hitArea = app.screen;
  app.stage.on("pointerdown", (event) => handleClick(world, event.global));
  Object.assign(window, { baba: () => world });

  document.addEventListener("MoveSwitch", () => {
    if (IsRoundEnd(world)) {
      finishRound(world);
    } else queueMicrotask(() => runAI(world));
  });

  window.addEventListener("keydown", (e) => {
    if (e.code === "KeyZ" && GetAnimationCount() === 0) {
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

  window.addEventListener("resize", () => {
    if (GetAnimationCount() === 0) redraw(world);
  });
  document.addEventListener("GameEnd", () => {
    redraw(world);
    showGameOver(world, highlightContainer);
  });
}

async function handleClick(world: GameWorld, newPos: Point) {
  if (world.gameOver) location.reload();
  if (GetAnimationCount() > 0) return;
  if (world.players[world.currentPlayer].type !== "human") return;
  const hit = Array.from(world.hitboxes.values()).find(
    (box) => box.x <= newPos.x && box.y <= newPos.y && box.x + box.w > newPos.x && box.y + box.h > newPos.y,
  );
  if (hit && !hit.interactive) return;
  if (!hit) delete world.lastPickup;
  else if (hit.source !== "line") {
    world.lastPickup = CreatePickupFromHitbox(world, hit);
  } else if (world.lastPickup && hit.source === "line") {
    world.lastPickup.toLine = hit.sourceId;
    if (validatePickup(world, world.lastPickup)) {
      await AnimatePickupTiles(world, world.lastPickup);
      applyPickup(world, world.lastPickup, false);
      delete world.lastPickup;
    } else delete world.lastPickup.toLine;
  }
  redraw(world);
}

async function runAI(world: GameWorld) {
  const ai = world.players[world.currentPlayer].ai;
  if (ai) {
    const pickup = ai.makeMove();

    await AnimatePickupTiles(world, pickup);
    applyPickup(world, pickup, false);

    redraw(world);
  } else redraw(world);
}

async function finishRound(world: GameWorld) {
  await AnimateRoundEndTiles(world);
  RunRoundEnd(world);
  redraw(world);
}

function redraw(world: GameWorld) {
  gameContainer.removeChildren();
  DrawBoard(gameContainer, world);
}
