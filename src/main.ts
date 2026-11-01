import { Application } from "pixi.js";
import { setupClickHandling } from "./ux/click-handler";
import { SetupGame } from "./systems/game-setup.system";
import { RunRoundShuffle } from "./systems/round/round-shuffler.system";
import { InformMoveSwitch } from "./systems/moves/player-shift.system";
import { PlayerType } from "./components/player.type";
import { prepareTextures } from "./systems/layout/textures";

const MIN_WIDTH = 555;

export async function runApp() {
  const playerCount = await askPlayerCount();
  const app = new Application();
  await app.init({ backgroundAlpha: 0, resizeTo: window, antialias: true });
  if (window.innerWidth < MIN_WIDTH) resize(app);
  document.body.appendChild(app.canvas);
  await prepareTextures();
  const players: PlayerType[] = ["human", ...Array.from({ length: playerCount }, () => "Approx" as const)];
  const world = SetupGame(app, players);
  RunRoundShuffle(world);
  setupClickHandling(app, world);
  InformMoveSwitch();
  if (app.canvas.width < 500) alert(app.canvas.width);
}

function askPlayerCount(): Promise<number> {
  const dialog = document.querySelector<HTMLDialogElement>("#start-dialog")!;
  const form = document.querySelector<HTMLFormElement>("#start-game-form")!;

  dialog.showModal();
  return new Promise((resolve) => {
    form.addEventListener(
      "submit",
      (event) => {
        event.preventDefault();
        const count = Number((event.submitter! as any).value);
        dialog.close();
        resolve(count);
      },
      { once: true },
    );
  });
}

function resize(app: Application) {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const scale = Math.min(1, screenWidth / MIN_WIDTH);
  app.renderer.resize(MIN_WIDTH, screenHeight / scale);
  app.canvas.style.width = `${MIN_WIDTH * scale}px`;
  app.canvas.style.height = `${screenHeight}px`;
}

runApp();
