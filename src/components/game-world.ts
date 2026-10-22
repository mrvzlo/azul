import { CenterBoard } from "./center-board";
import Hitbox from "./hitbox";
import Pickup from "./pickup";
import PlayerBoard from "./player-board";

export default interface GameWorld {
  round: number;
  currentPlayer: number;
  center: CenterBoard;
  players: PlayerBoard[];
  hitboxes: Hitbox[];
  lastPickup?: Pickup;
  history: Pickup[];
}
