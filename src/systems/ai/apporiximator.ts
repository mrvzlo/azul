import GameWorld from "../../components/game-world";
import Pickup from "../../components/pickup";
import { getAvailableMoves } from "../available-move-system";
import { applyPickup, undoPickup } from "../moves/pickup.system";
import { PreCalcPlayerScoreChange } from "../round/round-end.system";
import { BaseAi } from "./base-ai";

const Q = 27 / 25;

export class Approximator implements BaseAi {
  constructor(
    public world: GameWorld,
    public me: number,
  ) {}

  makeMove = () => {
    const available = getAvailableMoves(this.world);
    let bestMove = 0;
    let bestScore = this.evaluate(available[0]);
    for (let i = 1; i < available.length; i++) {
      const score = this.evaluate(available[i]);
      if (score <= bestScore) continue;
      bestMove = i;
      bestScore = score;
    }
    return available[bestMove];
  };

  evaluate(move: Pickup) {
    const tilesToLine = move.tilesToLine;
    const tilesToPenalty = move.tilesToPenalty;
    applyPickup(this.world, move, true);
    try {
      return PreCalcPlayerScoreChange(this.myBoard) + this.getCellsPotential();
    } finally {
      undoPickup(this.world, move, true);
      move.tilesToLine = tilesToLine;
      move.tilesToPenalty = tilesToPenalty;
    }
  }

  getCellsPotential() {
    return this.myBoard.arrangement.map((_, i) => this.getCellPotential(i) * Q).reduce((a, b) => a + b, 0);
  }

  getCellPotential(id: number) {
    if (this.myBoard.placed[id]) return 1;
    const row = Math.floor(id / 5);
    if (this.myBoard.lineFilled[row] === 0 || this.myBoard.lineColors[row] !== this.myBoard.arrangement[id]) return 0;
    return (this.myBoard.lineFilled[row] / (row + 1)) ** 2;
  }

  get myBoard() {
    return this.world.players[this.me];
  }
}
