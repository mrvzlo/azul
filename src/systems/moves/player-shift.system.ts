import GameWorld from "../../components/game-world";

export function setNextPlayer(world: GameWorld, simulate: boolean) {
  world.currentPlayer = adjust(world.currentPlayer + 1, world.players.length);
  if (!simulate) InformMoveSwitch();
}

export function setPreviousPlayer(world: GameWorld, simulate: boolean) {
  world.currentPlayer = adjust(world.currentPlayer - 1, world.players.length);
  if (!simulate) InformMoveSwitch();
}

function adjust(n: number, max: number) {
  while (n < 0) n += max;
  return n % max;
}

export function InformMoveSwitch() {
  document.dispatchEvent(new Event("MoveSwitch"));
}

export function InformGameEnd() {
  document.dispatchEvent(new Event("GameEnd"));
}
