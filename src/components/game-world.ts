import { Size } from "pixi.js";
import { CenterBoard } from "./center-board";
import Hitbox from "./hitbox";
import Pickup from "./pickup";
import PlayerBoard from "./player-board";

export default interface GameWorld {
  round: number;
  currentPlayer: number;
  center: CenterBoard;
  players: PlayerBoard[];
  hitboxes: Map<string, Hitbox>;
  lastPickup?: Pickup;
  history: Pickup[];
  windowSize: Size;
  gameOver?: boolean;
}
