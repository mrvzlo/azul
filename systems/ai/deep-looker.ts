import GameWorld from "../../components/game-world";
import { getAvailableMoves } from "../available-move-system";
import { applyPickup, undoPickup } from "../moves/pickup.system";
import { IsRoundEnd, PreCalcPlayerScoreChange } from "../round/round-end.system";
import { BaseAi } from "./base-ai";

export class DeepLooker implements BaseAi {
  constructor(
    public world: GameWorld,
    public me: number,
    public maxDepth: number,
  ) {}

  makeMove = () => this.recursiveScore().bestMove;

  recursiveScore(depth = 0) {
    const available = getAvailableMoves(this.world);
    const maximizing = this.world.currentPlayer === this.me;
    let bestScore = maximizing ? -Infinity : Infinity;
    let bestMove = available[0];

    for (const move of available) {
      applyPickup(this.world, move, true);
      let score: number;
      try {
        score =
          IsRoundEnd(this.world) || depth >= this.maxDepth ? this.evaluateScoreDifference() : this.recursiveScore(depth + 1).bestScore;
      } finally {
        undoPickup(this.world, move, true);
      }

      if (maximizing ? score > bestScore : score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return { bestScore, bestMove };
  }

  evaluateScoreDifference() {
    return this.world.players.reduce((difference, player, index) => {
      const projectedScore = player.score + PreCalcPlayerScoreChange(player);
      return difference + (index === this.me ? projectedScore : -projectedScore);
    }, 0);
  }

  get myBoard() {
    return this.world.players[this.me];
  }
}
