import { Texture, Assets } from "pixi.js";

export const tileTextures: Texture[] = [];

export async function prepareTextures() {
  const files = ["./assets/0.png", "./assets/1.png", "./assets/2.png", "./assets/3.png", "./assets/4.png", "./assets/5.png"];
  const loaded = await loadTextures(files);
  loaded.forEach((x, i) => (tileTextures[i] = x));
}

export function loadTextures(names: string[]) {
  return Promise.all(names.map((x) => Assets.load<Texture>(x)));
}
