import { Application } from "pixi.js";
import { setupClickHandling } from "./ux/click-handler";
import { SetupGame } from "./systems/game-setup.system";
import { RunRoundShuffle } from "./systems/round/round-shuffler.system";
import { InformMoveSwitch } from "./systems/moves/player-shift.system";
import { PlayerType } from "./components/player.type";
import { prepareTextures } from "./systems/layout/textures";

export const AIS: PlayerType[] = ["human", "Approx", "Approx"];

export async function runApp() {
  const app = new Application();
  await app.init({ backgroundAlpha: 0, resizeTo: window, antialias: true });
  document.body.appendChild(app.canvas);
  await prepareTextures();
  const world = SetupGame(app, AIS);
  RunRoundShuffle(world);
  setupClickHandling(app, world);
  InformMoveSwitch();
}

runApp();
