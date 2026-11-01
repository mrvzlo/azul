import GameWorld from "../components/game-world";
import Pickup from "../components/pickup";
import { validatePickup } from "./moves/pickup.system";

export function getAvailableMoves(world: GameWorld) {
  const pushFromArray = (array: number[], factory: number, takesFirst: boolean) => {
    for (let i = 0; i < array.length; i++)
      if (array[i] > 0)
        availableTiles.push({
          color: i,
          factory,
          player: world.currentPlayer,
          tilesToLine: array[i],
          tilesToPenalty: 0,
          takesFirst,
        });
  };

  const availableMoves: Pickup[] = [];
  const availableTiles: Pickup[] = [];
  world.center.factories.forEach((factory, sourceId) => {
    const factoryColors = [0, 0, 0, 0, 0, 0];
    for (const color of factory) factoryColors[color]++;
    pushFromArray(factoryColors, sourceId, false);
  });
  const centerColors = [0, 0, 0, 0, 0, 0];
  for (const color of world.center.outer) centerColors[color]++;
  pushFromArray(centerColors, -1, !world.center.firstTaken);

  for (const take of availableTiles) {
    let anyLine = false;
    for (let toLine = 0; toLine < 5; toLine++) {
      const candidate = { ...take, toLine };
      if (validatePickup(world, candidate)) {
        availableMoves.push(candidate);
        anyLine = true;
      }
    }
    if (!anyLine) availableMoves.push({ ...take, toLine: -1 });
  }

  return availableMoves;
}
