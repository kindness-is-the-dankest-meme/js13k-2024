import { on } from "./lib/on.ts";

declare const m: HTMLElementTagNameMap["main"];
declare const c: HTMLElementTagNameMap["canvas"];

const win = window;
const { devicePixelRatio: dpr, requestAnimationFrame: raf } = win;

const scale = 1 / dpr;
let w: number, h: number, hw: number, hh: number;

const onResize = () => {
  ({ innerWidth: hw, innerHeight: hh } = win);
  w = hw * dpr;
  h = hh * dpr;

  c.width = w;
  c.height = h;
  c.style.transform = `scale(${scale})`;
};

on(win, "resize", onResize);
win.dispatchEvent(new Event("resize"));

const ctx = c.getContext("2d")!;
const draw = () => {
  raf(draw);

  ctx.fillStyle = "hsl(100, 40%, 60%)";
  ctx.fillRect(0, 0, w, h);

  ctx.font = "bold 8rem sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "hsla(50, 10%, 90%, 0.1)";
  ctx.fillText("hello", hw, hh);
};

raf(draw);
