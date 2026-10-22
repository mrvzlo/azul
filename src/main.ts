import { Application } from "pixi.js";
import { setupClickHandling } from "./ux/click-handler";
import { SetupGame } from "./systems/game-setup.system";
import { RunRoundShuffle } from "./systems/round/round-shuffler.system";
import { InformMoveSwitch } from "./systems/moves/player-shift.system";
import { PlayerType } from "./components/player.type";

export const AIS: PlayerType[] = ["Deep3", "Approx", "Approx"];

export async function runApp() {
  console.time("start");
  const app = new Application();
  await app.init({ background: "#555", resizeTo: window });
  document.body.appendChild(app.canvas);
  console.timeEnd("start");
  const world = SetupGame(AIS);
  RunRoundShuffle(world);
  setupClickHandling(app, world);
  InformMoveSwitch();
}

runApp();
