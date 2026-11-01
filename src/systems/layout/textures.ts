import { Texture, Assets } from "pixi.js";

export const tileTextures: Texture[] = [];
export const shadowTextures: Texture[] = [];

export async function prepareTextures() {
  const files = [
    "./assets/0.png",
    "./assets/1.png",
    "./assets/2.png",
    "./assets/3.png",
    "./assets/4.png",
    "./assets/5.png",
    "./assets/6.png",
  ];
  const shadow = ["./assets/n1.png", "./assets/n2.png", "./assets/n3.png", "./assets/n4.png", "./assets/n5.png"];
  const loaded = await loadTextures(files);
  loaded.forEach((x, i) => (tileTextures[i] = x));
  const loadedShadows = await loadTextures(shadow);
  loadedShadows.forEach((x, i) => (shadowTextures[i + 1] = x));
}

export function loadTextures(names: string[]) {
  return Promise.all(names.map((x) => Assets.load<Texture>(x)));
}
