import { build } from "esbuild";
import { copyFileSync, cpSync } from "fs";

await build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  minify: false,
  outfile: "dist/main.js",
  platform: "browser",
  target: "ES2020",
  format: "iife",
});

copyFileSync("src/index.html", "dist/index.html");
copyFileSync("src/policy.html", "dist/policy.html");
copyFileSync("src/favicon.ico", "dist/favicon.ico");
cpSync("src/assets", "dist/assets", { recursive: true });
