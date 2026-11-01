import { Application } from "pixi.js";
import { setupClickHandling } from "./ux/click-handler";
import { SetupGame } from "./systems/game-setup.system";
import { RunRoundShuffle } from "./systems/round/round-shuffler.system";
import { InformMoveSwitch } from "./systems/moves/player-shift.system";
import { PlayerType } from "./components/player.type";
import { prepareTextures } from "./systems/layout/textures";

export const AIS: PlayerType[] = ["human", "Approx", "Approx", "Approx"];
const MIN_WIDTH = 555;

export async function runApp() {
  const app = new Application();
  await app.init({ backgroundAlpha: 0, resizeTo: window, antialias: true });
  if (window.innerWidth < MIN_WIDTH) resize(app);
  document.body.appendChild(app.canvas);
  await prepareTextures();
  const world = SetupGame(app, AIS);
  RunRoundShuffle(world);
  setupClickHandling(app, world);
  InformMoveSwitch();
  if (app.canvas.width < 500) alert(app.canvas.width);
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
