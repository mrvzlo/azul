import { Container, Graphics, Text, TextStyleOptions } from "pixi.js";
import GameWorld from "../components/game-world";
import { MAIN_BG, MAIN_BORDER } from "../consts/colors";

export function showGameOver(world: GameWorld, container: Container) {
  const human = world.players[0];
  const total = human.score + human.bonusScore;
  const winner = world.players.map((x) => x.bonusScore + x.score).sort((a, b) => b - a);
  const place = winner.findIndex((x) => x === total);

  const g = new Graphics();
  const w = 550;
  const h = 80;
  const l = (world.windowSize.width - w) / 2;
  const t = 50;
  g.rect(l, t, w, h).fill(MAIN_BG).stroke(MAIN_BORDER);

  const messageStyle: TextStyleOptions = { fontSize: 24, fill: 0x222222, fontFamily: "Consolas", fontWeight: "bold" };
  const opts = ["1st", "2nd", "3rd", "4th"];
  const message = new Text({ text: "You got " + opts[place] + " place with " + total + " points", style: messageStyle });
  message.x = world.windowSize.width / 2 - message.width / 2;
  message.y = t + 20;

  const reloadStyle: TextStyleOptions = { fontSize: 16, fill: 0x777777, fontFamily: "Consolas" };
  const reload = new Text({ text: "Click to reload", style: reloadStyle });
  reload.x = world.windowSize.width / 2 - reload.width / 2;
  reload.y = t + 55;

  container.addChild(g);
  container.addChild(message);
  container.addChild(reload);
  world.gameOver = true;
}
