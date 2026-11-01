import GameWorld from "../../components/game-world";
import Hitbox from "../../components/hitbox";
import Pickup from "../../components/pickup";

export function CreatePickupFromHitbox(world: GameWorld, box: Hitbox) {
  const takesFirst = box.source === "outer" && !world.center.firstTaken;
  const tilesToLine = box.source === "outer" ? sumOfN(world.center.outer, box.color) : sumOfN(world.center.factories[box.sourceId!], box.color);
  const pickup: Pickup = {
    color: box.color,
    player: world.currentPlayer,
    tilesToPenalty: 0,
    tilesToLine,
    takesFirst,
    factory: box.source === "factory" ? box.sourceId! : -1,
  };
  return pickup;
}

function sumOfN(list: number[], n: number) {
  return list.reduce((sum, x) => (x === n ? sum + 1 : sum), 0);
}
