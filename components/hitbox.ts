import { Graphics } from "pixi.js";

export default interface Hitbox {
  color: number;
  x: number;
  y: number;
  w: number;
  h: number;
  source: PickupSource;
  sourceId?: number;
  interactive: boolean;
  playerIndex?: number;

  occupied: boolean;
  graphic: Graphics;
  graphicColor?: number;
  graphicSelected?: boolean;
}

export type PickupSource = "outer" | "line" | "factory";

type HitboxData = Omit<Hitbox, "graphic" | "graphicColor" | "graphicSelected">;

export function updateHitbox(hitboxes: Map<string, Hitbox>, key: string, data: HitboxData) {
  const hitbox = hitboxes.get(key);
  if (hitbox) {
    Object.assign(hitbox, data);
    return hitbox;
  }

  const created = { ...data, graphic: new Graphics() };
  hitboxes.set(key, created);
  return created;
}
