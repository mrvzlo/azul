import { BaseAi } from "../systems/ai/base-ai";
import { PlayerType } from "./player.type";

export default interface PlayerBoard {
  score: number;
  bonusScore: number;
  hasFirst: boolean;
  arrangement: number[];
  placed: boolean[];
  lineColors: number[];
  lineFilled: number[];
  penalties: number[];
  type: PlayerType;
  ai?: BaseAi;
}
