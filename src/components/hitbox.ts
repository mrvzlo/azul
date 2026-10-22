export default interface Hitbox {
  color: number;
  x: number;
  y: number;
  w: number;
  h: number;
  source: PickupSource;
  sourceId?: number;
  interactive: boolean;
}

export type PickupSource = "outer" | "line" | "factory";
