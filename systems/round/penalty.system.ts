import PlayerBoard from "../../components/player-board";

export function getPenalty(player: PlayerBoard) {
  const count = Math.min(player.penalties.length + +player.hasFirst, 7);
  switch (count) {
    case 0:
      return 0;
    case 1:
      return 1;
    case 2:
      return 2;
    case 3:
      return 4;
    case 4:
      return 6;
    case 5:
      return 8;
    case 6:
      return 11;
    default:
      return 14;
  }
}
