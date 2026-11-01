export default interface Pickup {
  tilesToLine: number;
  tilesToPenalty: number;
  color: number;
  factory: number; //-1 = middle
  takesFirst: boolean;
  toLine?: number;
  player: number;
  skipped?: number[];
}
